
const PATH = require("path");
const SPAWN = require("child_process").spawn;


exports.for = function(API, plugin) {

    plugin.install = function(packagePath, options) {
        var opts = API.UTIL.copy(options);
        opts.cwd = packagePath;
        // TODO: Set `opts.silent = true` to only print buffer on error.

        function configure() {
            if (!API.FS.existsSync(PATH.join(packagePath, "./configure"))) {
                return API.Q.resolve();
            }
            // TODO: Insert config args from `plugin.node.summary.config.args`.
            return API.OS.spawnInline("./configure", [], opts);
        }

        return configure().then(function() {
            return API.OS.spawnInline("make", [], opts);
        });
    }

    plugin.test = function(node, options) {
        // package.json is king.
        if (!node.descriptor.package.scripts || !node.descriptor.package.scripts.test) {
            var opts = API.UTIL.copy(options);
            opts.cwd = node.path;
            return API.OS.spawnInline("make", [ "test" ], opts);
        }

        // TODO: Call `node.descriptor.package.scripts.test` command.
        return API.Q.resolve();
    }
}
