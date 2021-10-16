import { execSync } from 'child_process';
import { pathResolve } from './utils';

type FindLinksParams = {
  dest: string;
  ino: number;
};
type FindLinksResult = {
  result: boolean;
  message: string;
  code?: 'UNKNOWN' | 'FILE_EXIST' | 'NO_SUCH_FILE_OR_DIRECTORY';
  data?: {
    ino: number;
    links: string[];
  };
};
export function findLinks({ dest, ino }: FindLinksParams): FindLinksResult {
  try {
    const destFull = pathResolve(dest);
    const output = execSync(`find "${destFull}" -inum ${ino}`).toString();
    return {
      result: true,
      message: 'success',
      data: { ino, links: output.split('\n').filter((i) => i !== '') },
    };
  } catch (e: any) {
    if (e.message.includes('No such file or directory'))
      return { result: false, message: 'No such file or directory', code: 'NO_SUCH_FILE_OR_DIRECTORY' };
    return { result: false, message: e.message };
  }
}
