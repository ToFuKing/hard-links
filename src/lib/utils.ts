import path from 'path';
import { linkSync, existsSync, readdirSync, statSync, Stats } from 'fs';
import { ensureDirSync } from 'fs-extra';

type FileStat = { file: string; stat: Stats };
type ForEachFilesCallback = (params: FileStat) => void;
type ForEachFilesParams = {
  folder: string;
  includesFolder?: string[];
  excludes?: string[];
  callback?: ForEachFilesCallback;
};

export const forEachFiles = (_params: ForEachFilesParams) => {
  const { folder, includesFolder = [], excludes = [], callback } = _params;
  const folderFullPath = pathResolve(folder);
  if (!existsSync(folderFullPath)) throw new Error(`folder not found`);
  // inner method
  const __readFiles = (root: string): FileStat[] => {
    let files: FileStat[] = [];
    readdirSync(root).forEach((item) => {
      const fullPath = `${root}/${item}`;
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        if (excludes.length > 0) if (excludes.includes(fullPath)) return;

        files = [...files, ...__readFiles(fullPath)];
      } else if (stat.isFile()) {
        if (includesFolder.length > 0) if (!includesFolder.some((i) => fullPath.startsWith(i))) return;

        const temp = { file: fullPath, stat };
        if (callback) callback(temp);
        files.push(temp);
      }
    });
    return files;
  };

  return __readFiles(folderFullPath);
};

export const hardLinkSync = (src: string, dest: string, file: string): string => {
  const filePathWithoutSrc = file.substr(`${src}/`.length);
  const destFullPath = `${dest}/${filePathWithoutSrc}`;
  const destFileParentDir = destFullPath.substr(0, destFullPath.lastIndexOf('/'));
  ensureDirSync(destFileParentDir);
  linkSync(file, destFullPath);
  return destFullPath;
};

export const pathResolve = path.resolve;
