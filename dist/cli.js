#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var helpers_1 = require("yargs/helpers");
var core_1 = require("./lib/core");
var utils_1 = require("./lib/utils");
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command('link [src] [dest] [fullCheck]', 'Start to hard link', function (self) {
    return self
        .positional('src', { describe: 'Source directory', type: 'string', alias: 's' })
        .positional('dest', { describe: 'Destination directory', type: 'string', alias: 'd' })
        .positional('fullCheck', { describe: 'Full checking', type: 'boolean', alias: 'full', default: false })
        .demandOption(['src', 'dest']);
}, function (argv) {
    var _a = [(0, utils_1.pathResolve)(argv.src), (0, utils_1.pathResolve)(argv.dest)], src = _a[0], dest = _a[1];
    (0, core_1.run)({ src: src, dest: dest, fullCheck: argv.fullCheck });
})
    .command('link-plus [config]', 'Start to hard link plus', function (self) {
    return self.positional('config', { describe: '', type: 'string', alias: 'c' }).demandOption('config');
}, function (argv) {
    var config = (0, utils_1.pathResolve)(argv.config);
    (0, core_1.runWithConfig)(config);
})
    .parse();
