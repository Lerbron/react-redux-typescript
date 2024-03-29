const {
  merge
} = require('webpack-merge');
const webpack = require('webpack');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const {
  resolve
} = require("path");
const common = require('./webpack.common.js');
const proxySetting = require('./proxy');
const config = require('./baseConfig');

module.exports = merge(common, {
  target: 'web',
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: config.SERVER_HOST,
    port: config.SERVER_PORT,
    stats: 'errors-only',
    clientLogLevel: 'silent',
    historyApiFallback: true,
    compress: true,
    open: false,
    hot: true, // 热更新
    proxy: {
      ...proxySetting
    }, // 代理配置
    // contentBase: resolve(__dirname, '../public')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new HardSourceWebpackPlugin(),
  ],
});