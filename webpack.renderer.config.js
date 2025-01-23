const { BytenodeWebpackPlugin } = require('@herberttn/bytenode-webpack-plugin');
const rules = require('./webpack.rules');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const assets = ['assets'];

const copyPlugins = assets.map((asset) => {
  return new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src', asset),
        to: path.resolve(__dirname, '.webpack/renderer', asset),
      },
    ],
  });
});

/** @type {import("webpack").Configuration} */
module.exports = {
  output: { devtoolModuleFilenameTemplate: '[absolute-resource-path]' },
  module: {
    rules: [
      ...rules,
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new BytenodeWebpackPlugin({ compileForElectron: true }),
    ...copyPlugins,
  ],
  target: 'electron-renderer',
};
