import { describe, it } from 'mocha';
import { createCatalog, TESTING_ROOT_PATH } from '../helper';
import { run } from '../../src';

before(() => {
  createCatalog();
});

describe('Testing lib/core', () => {
  it('Should be no error!', () => {
    run({
      src: `${TESTING_ROOT_PATH}/download`,
      dest: `${TESTING_ROOT_PATH}/media`,
      excludes: [`${TESTING_ROOT_PATH}/download/_temp`],
    });
  });
});
