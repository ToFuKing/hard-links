#!/usr/bin/env node
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {run, runWithConfig} from "./lib/core";
import {pathResolve} from './lib/utils';

yargs(hideBin(process.argv))
  .command('link [src] [dest] [fullCheck]', 'Start to hard link', (self) => {
    return self
      .positional('src', {describe: 'Source directory', type: 'string', alias: 's'})
      .positional('dest', {describe: 'Destination directory', type: 'string', alias: 'd'})
      .positional('fullCheck', {describe: 'Full checking', type: 'boolean', alias: 'full', default: false})
      .demandOption(['src', 'dest']);
  }, (argv) => {
    const [src, dest] = [pathResolve(argv.src), pathResolve(argv.dest)];
    run({src, dest, fullCheck: argv.fullCheck});
  })
  .command('link-plus [config]', 'Start to hard link plus', (self) => {
    return self
      .positional('config', {describe: '', type: 'string', alias: 'c'})
      .demandOption('config');
  }, ((argv) => {
    const config = pathResolve(argv.config);
    runWithConfig(config);
  }))
  .parse();
