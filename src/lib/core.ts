import { readJsonSync } from 'fs-extra';
import { findLinks } from './command';
import { forEachFiles, hardLinkSync, pathResolve } from './utils';

type RunConfig = {
  src: string;
  dest: string;
  includesFolder?: string[];
  excludes?: string[];
  fullCheck?: boolean;
  cacheLinks?:
    | boolean
    | {
        enabled: boolean;
        cachePath: string;
      };
};

export const run = (_config: RunConfig) => {
  const { src, dest, includesFolder = [], excludes = [], fullCheck = false } = _config;

  console.log('========================== Start ===========================');
  let [skip, link, err, total] = [0, 0, 0, 0];
  forEachFiles({
    folder: src,
    includesFolder,
    excludes,
    callback: ({ file, stat }) => {
      // Check whether hard links are required
      let needLink = false;
      if (stat.nlink === 1) {
        // If nlink === 1, the file is not hard linked, so link it
        needLink = true;
      } else if (stat.nlink > 1 && fullCheck) {
        // 当 nlink > 1 时, 说明该文件已有硬链接, 找找是否在 dest 中
        const { result, message, data } = findLinks({ dest, ino: stat.ino });
        if (result) {
          const { links } = data || { links: [] };
          if (links.length === 0) {
            needLink = true;
          } else if (links.length === 1) {
            if (!links[0].startsWith(`${dest}/`)) needLink = true;
          } else if (!links.some((i: string) => i.startsWith(`${dest}/`))) {
            needLink = true;
          }
        } else {
          console.log('-  err:', message);
        }
      }

      // hard link
      if (needLink) {
        try {
          console.log(`- link: ${file}`);
          const destFullPath = hardLinkSync(src, dest, file);
          console.log(`-   to: ${destFullPath}, done...`);
          link++;
        } catch (e: any) {
          console.log('-  err:', e.message);
          err++;
        }
      } else {
        console.log('- skip:', file);
        skip++;
      }
      total++;
    },
  });

  console.log('========================== Result ==========================');
  console.log('       Src', src);
  console.log('      Dest', dest);
  excludes?.forEach((item, index) => {
    if (index === 0) console.log('  Excludes', item);
    else console.log('          ', item);
  });
  includesFolder?.forEach((item, index) => {
    if (index === 0) console.log('  Includes', item);
    else console.log('          ', item);
  });
  console.log('Full Check', fullCheck ? 'YES' : 'NO');
  console.log({ skip, link, err, total });
  console.log('============================================================');
};

type JsonConfig = { name: string; configs: RunConfig[] };
export const runWithConfig = (jsonConfig: JsonConfig) => {
  jsonConfig.configs.forEach((config, index) => {
    config.src = pathResolve(config.src);
    config.dest = pathResolve(config.dest);
    config.excludes = config.excludes?.map((i) => pathResolve(i));
    config.includesFolder = config.includesFolder?.map((i) => pathResolve(i));
    console.log(`===== Task ${index + 1}/${jsonConfig.configs.length} =====`);
    run(config);
  });
};

export const runWithConfigFile = (configFile: string) => {
  const pathConfig = pathResolve(configFile);
  const jsonConfig: JsonConfig = readJsonSync(pathConfig);

  runWithConfig(jsonConfig);
};
