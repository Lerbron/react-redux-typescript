const {
  resolve
} = require('path')
const webpack = require('webpack')
const config = require("./baseConfig")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const WebpackBar = require("webpackbar");
const os = require('os');
var threadPool = os.cpus().length - 1;

class Reporter {
  done(context) {
    if (config.isDev) {
      console.clear();
      console.log(`启动成功:${config.SERVER_HOST}:${config.SERVER_PORT}`);
    }
  }
}

const {
  getCssLoaders
} = require("./utils");

module.exports = {
  entry: resolve(__dirname, "../src/index.tsx"),
  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js',
    path: resolve(__dirname, '../dist'),
    publicPath: "/",
  },
  module: {
    rules: [{
        test: /\.(tsx?|js)$/,
        use: [{
            loader: 'thread-loader',
            options: {
              workers: threadPool // 进程2个
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            },
          }
        ],

        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getCssLoaders(1),
        // exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: config.isDev
            },
          }
        ],
        exclude: /node_modules/
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10 * 1024,
            name: "static/img/[name].[ext]",
            esModule: false
          },
        }, ],
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: "static/font/[name].[ext]",
            esModule: false
          },
        }, ],
      },
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        },
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|redux|react-router-dom|redux-thunk|react-loadable|antd)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        }
      }
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, '../src')
    },
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      title: config.PROJECT_NAME,
      cache: false,
      inject: true,
      minify: {
        // 移除注释
        removeComments: true,
        // 不要留下任何空格
        collapseWhitespace: true,
        // 当值匹配默认值时删除属性
        removeRedundantAttributes: true,
        // 使用短的doctype替代doctype
        useShortDoctype: true,
        // 移除空属性
        removeEmptyAttributes: true,
        // 从style和link标签中删除type="text/css"
        removeStyleLinkTypeAttributes: true,
        // 保留单例元素的末尾斜杠。
        keepClosingSlash: true,
        // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyJS: true,
        // 缩小CSS样式元素和样式属性
        minifyCSS: true,
        // 在各种属性中缩小url
        minifyURLs: true
      }
    }),
    // new CopyPlugin({
    //   patterns: [{
    //     from: resolve(__dirname, "../public"),
    //     to: resolve(__dirname, "../dist")
    //   }],
    // }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: resolve(__dirname, '../tsconfig.json'),
      },
    }),
    new WebpackBar({
      name: config.isDev ? "正在启动" : "正在打包",
      color: "#fa8c16",
      reporter: new Reporter()
    }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/)
  ]
}