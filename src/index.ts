import {run} from './lib/core';
import {pathResolve} from "./lib/utils";

const src = pathResolve('./testing/dir-src');
const dest = pathResolve('./testing/dir-dest');

run({src, dest});
