/*!
 * @author smailsky
 */
var path = require("path");
var requirejsPlugin = require('requirejs-webpack-plugin');

module.exports = {
    entry:{
        "index":"./src/index.js"
    },
    output:{
        path:path.join(__dirname, "app"),
        publicPath:"",
        filename:"[name].js"
    },
    plugins: [
        new requirejsPlugin({
            path: path.join(__dirname, 'app'),
            filename: 'main.js',
            baseUrl : '',
            pathUrl : '',
            processOutput: function (assets) {
                return 'require.config(' + JSON.stringify(assets) + ')'
            }
        })
    ]
};