# requirejs-webpack-plugin

Webpack plugin that update cache for requirejs

base on [assets-webpack-plugin](https://github.com/kossnocorp/assets-webpack-plugin)


## Example:

For example, given the following webpack config:

see ./example

```js
var path = require("path");
var requirejsPlugin = require('requirejs-webpack-plugin');
{
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
}
```

The plugin will output the following requirejs config file(./app/main.js):

```js
require.config({
  "paths": {
    "index": "index.js?v=89b820adce324ffcdeb3675767248d32"
  },
  "baseUrl": ""
})
```

## Useage

index.html

```html
...
    <script type="text/javascript" src="./require.js"></script>
    <script type="text/javascript" src="./main.js"></script>
    <script type="text/javascript">
        require(['./index']);
    </script>
...

```


## Install

```sh
npm install requirejs-webpack-plugin --save-dev
```

## Options

You can pass the following options:

### `filename`

Optinal. `main.js` by default.

Name for the created json file.

```js
new requirejsPlugin({filename: 'main.js'})
```


### `path`

Optional. Defaults to the current directory.

Path where to save the created JSON file.

```js
new requirejsPlugin({path: path.join(__dirname, 'app', 'views')})
```

### `processOutput`

Optional. Defaults is JSON stringify function.

Formats the assets output.

```js
new requirejsPlugin({
  processOutput: function (assets) {
    return 'window.staticMap = ' + JSON.stringify(assets)
  }
})
```

### `baseUrl`

RequireJS baseUrl


### `pathUrl`

RequireJS paths dir

