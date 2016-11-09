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
    var self = this;
    compiler.plugin('after-emit', function (compilation, callback) {
      var options = compiler.options;
      var stats = compilation.getStats().toJson();
      var assetsByChunkName = stats.assetsByChunkName;
      var {baseUrl,pathUrl} = self.options;
      var output = {paths:{}, baseUrl:baseUrl};
      output.paths = stats.chunks.reduce(function(cur,prev){
        var files = prev['files'];
        prev['names'].reduce(function(c,p,i,a){
          var filename = p;
            var asset = files[i];
            var chunkNameStr = prev['hash'];
            cur[filename] = pathUrl + asset + '?v=' + chunkNameStr;
            return cur;
        },cur);
        return cur;
      },{});

      self.writer(output, function (err) {
        if (err) {
          compilation.errors.push(err)
        }
        callback();
      })
    });
  }
}

module.exports = requirejsWebpackPlugin;