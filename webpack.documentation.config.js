var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackConfig = {
    entry:[
        'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
        'webpack/hot/only-dev-server',
        './documentation/index.jsx',    
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader"
            },
            {
                test: /\.(woff|woff2)$/,
                loader: "url-loader",
                options: {'prefix': 'font/', 'limit': '5000'}
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                options: {'mimetype': 'application/octet-stream', 'limit': '10000'}
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                options: {'mimetype': 'image/svg+xml', 'limit': '10000'}
                
            },
            {
                test: /\.gif/,
                loader: "url-loader",
                options: {'mimetype': 'image/gif', 'limit': '10000'}
            },
            {
                test: /\.jpg/,
                loader: "url-loader",
                options: {'mimetype': 'image/jpg', 'limit': '10000'}
            },
            {
                test: /\.png/,
                loader: "url-loader",
                options: {'mimetype': 'image/png', 'limit': '10000'}
            }
        
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: path.join(__dirname, 'documentation','index.html'),
        filename: 'index.html',
        inject: 'body'
    }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        noInfo: true, // --no-info option
        hot: true,
        historyApiFallback: true,
        inline: true
    }
};

module.exports = webpackConfig;
