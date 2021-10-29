import { emptyDirSync, outputFileSync, readJsonSync } from "fs-extra";

export const TESTING_ROOT_PATH = 'testing';
export type Catalog = { testing: any };
export const createCatalog = () => {
  const __makeCatalog = (key: string, value: any, _root: string, _files: string[] = []) => {
    let files = _files;
    if (typeof value === 'string') {
      const filePath = `${_root}${key}`;
      const fileContent = `${value}\n${key}\n${new Date().getTime()}`;
      files.push(filePath);
      outputFileSync(filePath, `${fileContent}`);
    } else {
      Object.entries(value).forEach(([k, v]) => {
        files = __makeCatalog(k, v, `${_root}${key}/`, files);
      });
    }
    return files;
  };

  emptyDirSync(TESTING_ROOT_PATH);
  const catalog: Catalog = readJsonSync('./test/helper/catalog.json');
  return __makeCatalog(TESTING_ROOT_PATH, catalog.testing, '');
};
