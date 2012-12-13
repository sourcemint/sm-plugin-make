
const PATH = require("path");
const FS = require("fs");
const SPAWN = require("child_process").spawn;


exports.for = function(API, plugin) {

    plugin.install = function(packagePath, options) {
        var opts = API.UTIL.copy(options);
        opts.cwd = packagePath;
        // TODO: Insert config args from `plugin.node.summary.config.args`.
        return API.OS.spawnInline("./configure", [], opts).then(function() {
            return API.OS.spawnInline("make", [], opts);
        });
    }

    plugin.test = function(node, options) {
        // package.json is king.
        if (!node.descriptors.package.scripts || !node.descriptors.package.scripts.test) {
            var opts = API.UTIL.copy(options);
            opts.cwd = node.path;
            return API.OS.spawnInline("make", [ "test" ], opts);
        }

        // TODO: Call `node.descriptors.package.scripts.test` command.
        return API.Q.resolve();
    }
}
