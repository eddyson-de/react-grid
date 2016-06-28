var webpack = require('webpack');
var path = require('path');
var yargs = require('yargs');

var optimizeMinimize = yargs.alias('p', 'optimize-minimize').argv.optimizeMinimize;
var nodeEnv = optimizeMinimize ? 'production' : 'development';

module.exports = [
  {
    entry: [
      'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
      'webpack/hot/only-dev-server',
      './index.jsx' // Your appʼs entry point
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['react-hot', 'babel'],
            },

            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            },
            {
                test: /\.(woff|woff2)$/,
                loader: "url?prefix=font/&limit=5000"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.gif/,
                loader: "url-loader?limit=10000&mimetype=image/gif"
            },
            {
                test: /\.jpg/,
                loader: "url-loader?limit=10000&mimetype=image/jpg"
            },
            {
                test: /\.png/,
                loader: "url-loader?limit=10000&mimetype=image/png"
            }

             ]
    },
    devServer: {
        contentBase: "./public",
        noInfo: true, // --no-info option
        hot: true,
        inline: true
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
  } , {
    entry: {
      Ardagryd: './Ardagryd.js'
    },
    output: {
      path: 'dist',
      library: 'Ardagryd',
      filename: optimizeMinimize ? '[name].min.js' : '[name].js',
      libraryTarget: "umd"
    },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react']
          }
        }
      ]
    },
    externals: [
      {
        'react': {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react'
        }
      }

    ],
    plugins: [
              new webpack.DefinePlugin({
                'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
              }),
    ],

    devtool: optimizeMinimize ? 'source-map' : null
  }
];