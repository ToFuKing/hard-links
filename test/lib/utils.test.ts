import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createCatalog, TESTING_ROOT_PATH } from '../helper';
import { forEachFiles } from '../../src/lib/utils';

let CATALOG_FILES = [];
before(() => {
  CATALOG_FILES = createCatalog();
});

describe('Testing lib/utils', () => {
  it('Files length should be equal!', () => {
    const filesLen = forEachFiles({ folder: TESTING_ROOT_PATH }).length;
    expect(filesLen).to.be.equal(CATALOG_FILES.length);
  });
});
