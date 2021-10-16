"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWithConfigFile = exports.runWithConfig = exports.run = void 0;
var fs_extra_1 = require("fs-extra");
var command_1 = require("./command");
var utils_1 = require("./utils");
var run = function (_a) {
    var src = _a.src, dest = _a.dest, _b = _a.excludes, excludes = _b === void 0 ? [] : _b, _c = _a.fullCheck, fullCheck = _c === void 0 ? false : _c;
    console.log('========================== Start ===========================');
    var _d = [0, 0, 0, 0], skip = _d[0], link = _d[1], err = _d[2], total = _d[3];
    (0, utils_1.forEachFiles)({
        folder: src,
        excludes: excludes,
        callback: function (_a) {
            var file = _a.file, stat = _a.stat;
            // Check whether hard links are required
            var needLink = false;
            if (stat.nlink === 1) {
                // If nlink === 1, the file is not hard linked, so link it
                needLink = true;
            }
            else if (stat.nlink > 1 && fullCheck) {
                // 当 nlink > 1 时, 说明该文件已有硬链接, 找找是否在 dest 中
                var _b = (0, command_1.findLinks)({ dest: dest, ino: stat.ino }), result = _b.result, message = _b.message, data = _b.data;
                if (result) {
                    var links = (data || { links: [] }).links;
                    if (links.length === 0) {
                        needLink = true;
                    }
                    else if (links.length === 1) {
                        if (!links[0].startsWith(dest + "/"))
                            needLink = true;
                    }
                    else if (!links.some(function (i) { return i.startsWith(dest + "/"); })) {
                        needLink = true;
                    }
                }
                else {
                    console.log('-  err:', message);
                }
            }
            // hard link
            if (needLink) {
                try {
                    console.log("- link: " + file);
                    var destFullPath = (0, utils_1.hardLinkSync)(src, dest, file);
                    console.log("-   to: " + destFullPath + ", done...");
                    link++;
                }
                catch (e) {
                    console.log('-  err:', e.message);
                    err++;
                }
            }
            else {
                console.log('- skip:', file);
                skip++;
            }
            total++;
        },
    });
    console.log('========================== Result ==========================');
    console.log('       Src', src);
    console.log('      Dest', dest);
    excludes === null || excludes === void 0 ? void 0 : excludes.forEach(function (item, index) {
        if (index === 0)
            console.log('  Excludes', item);
        else
            console.log('          ', item);
    });
    console.log('Full Check', fullCheck ? 'YES' : 'NO');
    console.log({ skip: skip, link: link, err: err, total: total });
    console.log('============================================================');
};
exports.run = run;
var runWithConfig = function (jsonConfig) {
    jsonConfig.configs.forEach(function (config, index) {
        var _a;
        config.src = (0, utils_1.pathResolve)(config.src);
        config.dest = (0, utils_1.pathResolve)(config.dest);
        config.excludes = (_a = config.excludes) === null || _a === void 0 ? void 0 : _a.map(function (i) { return (0, utils_1.pathResolve)(i); });
        console.log("===== Task " + (index + 1) + "/" + jsonConfig.configs.length + " =====");
        (0, exports.run)(config);
    });
};
exports.runWithConfig = runWithConfig;
var runWithConfigFile = function (configFile) {
    var pathConfig = (0, utils_1.pathResolve)(configFile);
    var jsonConfig = (0, fs_extra_1.readJsonSync)(pathConfig);
    (0, exports.runWithConfig)(jsonConfig);
};
exports.runWithConfigFile = runWithConfigFile;
