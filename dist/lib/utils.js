"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathResolve = exports.hardLinkSync = exports.forEachFiles = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = require("fs");
var fs_extra_1 = require("fs-extra");
var forEachFiles = function (folder, callback) {
    var folderFullPath = (0, exports.pathResolve)(folder);
    if (!(0, fs_1.existsSync)(folderFullPath))
        throw new Error("folder not found");
    // inner method
    var __readFiles = function (root) {
        var files = [];
        (0, fs_1.readdirSync)(root).forEach(function (item) {
            var fullPath = root + "/" + item;
            var stat = (0, fs_1.statSync)(fullPath);
            if (stat.isDirectory()) {
                files = __spreadArray(__spreadArray([], files, true), __readFiles(fullPath), true);
            }
            else if (stat.isFile()) {
                var temp = { file: fullPath, stat: stat };
                if (callback)
                    callback(temp);
                files.push(temp);
            }
        });
        return files;
    };
    return __readFiles(folderFullPath);
};
exports.forEachFiles = forEachFiles;
var hardLinkSync = function (src, dest, file) {
    var filePathWithoutSrc = file.substr((src + "/").length);
    var destFullPath = dest + "/" + filePathWithoutSrc;
    var destFileParentDir = destFullPath.substr(0, destFullPath.lastIndexOf('/'));
    (0, fs_extra_1.ensureDirSync)(destFileParentDir);
    (0, fs_1.linkSync)(file, destFullPath);
};
exports.hardLinkSync = hardLinkSync;
exports.pathResolve = path_1.default.resolve;
