import { expect } from 'chai';
import { emptyDirSync, outputFileSync } from 'fs-extra';
import { forEachFiles } from '../../src/lib/utils';
import { it } from 'mocha';

const ROOT_TESTING = 'testing';
const TESTING_FILES = ['src/hello.txt', 'src/hard.txt', 'src/links.txt'];
before(() => {
  console.log(`[before] Clear ${ROOT_TESTING}/, Build testing files...`);
  emptyDirSync(ROOT_TESTING);
  TESTING_FILES.forEach((_file) => {
    outputFileSync(`${ROOT_TESTING}/${_file}`, _file);
  });
});

describe('Testing lib/utils.ts', () => {
  describe('forEachFiles', () => {
    it('There are 3 files', () => {
      const filesLen = forEachFiles(ROOT_TESTING).length;
      expect(filesLen).to.be.equal(3);
    });

    it("It's all.txt files", () => {
      forEachFiles(ROOT_TESTING, ({ file }) => {
        expect(file).to.match(/.txt$/);
      });
    });
  });

  describe('hardLinkSync', () => {
    it('Should be links', ()=>{
      // TODO
    });
  });
});
