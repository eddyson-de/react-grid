var webpack = require('webpack');
var path = require('path');
var yargs = require('yargs');

var optimizeMinimize = yargs.alias('p', 'optimize-minimize').argv.optimizeMinimize;
var nodeEnv = optimizeMinimize ? 'production' : 'development';

process.env.BABEL_ENV = 'distribution'

module.exports = {
    entry: {
      Ardagryd: './Ardagryd.js'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      library: 'Ardagryd',
      filename: optimizeMinimize ? '[name].min.js' : '[name].js',
      libraryTarget: "umd"
    },
    module: {
      rules: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
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
        },
        'prop-types': {
          root: 'Proptypes',
          commonjs2: 'prop-types',
          commonjs: 'prop-types',
          amd: 'prop-types'
        }
      }

    ],
    plugins: [
              new webpack.DefinePlugin({
                'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
              }),
    ],

    devtool: optimizeMinimize ? 'source-map' : false
};
