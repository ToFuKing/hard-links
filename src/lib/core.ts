import {readJsonSync} from 'fs-extra';
import {findLinks} from './command';
import {forEachFiles, hardLinkSync, pathResolve} from './utils'

type StartParams = {
  src: string;
  dest: string;
  excludes?: string[];
  fullCheck?: boolean;
};

export const run = ({src, dest, excludes = [], fullCheck = false}: StartParams) => {
  console.log('========================== Start ===========================');

  let [skip, link, err, total] = [0, 0, 0, 0];
  forEachFiles(src, ({file, stat}) => {
    if (excludes.some((i: string) => file.startsWith(`${i}/`))) return;

    // Check whether hard links are required
    let needLink = false;
    if (stat.nlink === 1) {
      // If nlink === 1, the file is not hard linked, so link it
      needLink = true;
    } else if (stat.nlink > 1 && fullCheck) {
      // 当 nlink > 1 时, 说明该文件已有硬链接, 找找是否在 dest 中
      const {result, message, data} = findLinks(dest, String(stat.ino));
      if (result) {
        const {links} = data || {links: []};
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
        hardLinkSync(src, dest, file);
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
  });

  console.log('========================== Result ==========================');
  console.log('       Src', src);
  console.log('      Dest', dest);
  excludes?.forEach((item, index) => {
    if (index === 0) console.log('  Excludes', item);
    else console.log('           ', item);
  });
  console.log('Full Check', fullCheck ? 'YES' : 'NO');
  console.log({skip, link, err, total});
  console.log('============================================================')
};

type JsonConfig = { name: string; configs: StartParams[]; };
export const runWithConfig = (config: string) => {
  const pathConfig = pathResolve(config);
  const jsonConfig: JsonConfig = readJsonSync(pathConfig);

  jsonConfig.configs.forEach((item, index) => {
    item.src = pathResolve(item.src);
    item.dest = pathResolve(item.dest);
    item.excludes = item.excludes?.map(i => pathResolve(i));
    console.log(`===== Task ${index + 1}/${jsonConfig.configs.length} =====`);
    run(item);
  });
};
