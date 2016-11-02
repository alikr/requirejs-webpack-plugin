var md5 = require('md5');
var createQueuedWriter = require('./lib/createQueuedWriter')
var createOutputWriter = require('./lib/createOutputWriter')

function requirejsWebpackPlugin (options) {
  var {
    path = '.',
    filename = 'main.js',
    baseUrl = '',
    pathUrl = '',
    prettyPrint = false,
    update = false,
    fullPath = true
  } = options;
  var opts = {path, filename, baseUrl, pathUrl, prettyPrint, update, fullPath};
  this.options = Object.assign(opts, options);
  this.writer = createQueuedWriter(createOutputWriter(this.options))
}

requirejsWebpackPlugin.prototype = {
  constructor: requirejsWebpackPlugin,
  apply: function (compiler) {
    var self = this
    compiler.plugin('after-emit', function (compilation, callback) {
      var options = compiler.options
      var stats = compilation.getStats().toJson();
      var assetsByChunkName = stats.assetsByChunkName;
      var baseUrl = self.options.baseUrl;
      var pathUrl = self.options.pathUrl;
      var output = {paths:{}, baseUrl:baseUrl};
      output.paths = Object.keys(assetsByChunkName).reduce(function (chunkMap, chunkName) {
        var assets = assetsByChunkName[chunkName]
        if (!Array.isArray(assets)) {
          assets = [assets]
        }
        chunkMap[chunkName] = assets.reduce(function (typeMap, asset) {
          var _cachedSource = compilation.assets[asset]['_cachedSource'];
          var chunkNameStr = _cachedSource ? md5(_cachedSource) : '';
          typeMap = pathUrl + asset + '?v=' + chunkNameStr;
          return typeMap
        }, {})

        return chunkMap
      }, {});

      self.writer(output, function (err) {
        if (err) {
          compilation.errors.push(err)
        }
        callback();
      })
    });
  }
}

module.exports = requirejsWebpackPlugin
