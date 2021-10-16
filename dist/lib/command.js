"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLinks = void 0;
var child_process_1 = require("child_process");
var utils_1 = require("./utils");
function findLinks(dest, ino) {
    try {
        var destFull = (0, utils_1.pathResolve)(dest);
        var output = (0, child_process_1.execSync)("find \"" + destFull + "\" -inum " + ino).toString();
        return {
            result: true,
            message: 'success',
            data: { ino: ino, links: output.split('\n').filter(function (i) { return i !== ''; }) },
        };
    }
    catch (e) {
        if (e.message.includes('No such file or directory'))
            return { result: false, message: 'No such file or directory', code: 'NO_SUCH_FILE_OR_DIRECTORY' };
        return { result: false, message: e.message };
    }
}
exports.findLinks = findLinks;
