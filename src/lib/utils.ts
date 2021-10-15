import path from 'path';
import { linkSync, existsSync, readdirSync, statSync, Stats } from 'fs';
import { ensureDirSync } from 'fs-extra';

type FileStat = { file: string; stat: Stats };
type ForEachFilesCallback = (params: FileStat) => void;

export const forEachFiles = (folder: string, callback?: ForEachFilesCallback) => {
  const folderFullPath = pathResolve(folder);
  if (!existsSync(folderFullPath)) throw new Error(`folder not found`);
  // inner method
  const __readFiles = (root: string): FileStat[] => {
    let files: FileStat[] = [];
    readdirSync(root).forEach((item) => {
      const fullPath = `${root}/${item}`;
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        files = [...files, ...__readFiles(fullPath)];
      } else if (stat.isFile()) {
        const temp = { file: fullPath, stat };
        if (callback) callback(temp);
        files.push(temp);
      }
    });
    return files;
  };

  return __readFiles(folderFullPath);
};

export const hardLinkSync = (src: string, dest: string, file: string) => {
  const filePathWithoutSrc = file.substr(`${src}/`.length);
  const destFullPath = `${dest}/${filePathWithoutSrc}`;
  const destFileParentDir = destFullPath.substr(0, destFullPath.lastIndexOf('/'));
  console.log(`- link: ${file}`);
  console.log(`-   to: ${destFullPath}`);
  ensureDirSync(destFileParentDir);
  linkSync(file, destFullPath);
  console.log(`-     : done...`);
};

export const pathResolve = path.resolve;
