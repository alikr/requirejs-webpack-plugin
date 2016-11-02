module.exports = function pluginError (message, previousError) {
  var err = new Error('[AssetsWebpackPlugin] ' + message)

  return previousError ? Object.assign(err, previousError) : err
}
