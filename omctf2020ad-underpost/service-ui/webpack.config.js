const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: ['react-hot-loader/patch', './src/index.js'],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                ],
            },
            {
                // HTML LOADER
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000',
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                exclude: [/img/],
                use: 'file-loader',
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                include: [/img/],
                use: ['file-loader'],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve('./src/'),
            path.resolve('./node_modules'),
            'node_modules',
        ],
        extensions: ['*', '.js', '.jsx'],
    },
    output: {
        path: `${__dirname}/dist`,
        publicPath: '/',
        filename: 'bundle.[hash:8].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/assets/index.html',
        }),
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css',
            disable: process.env.NODE_ENV === 'development',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            { from: './src/assets/img/*.*', to: 'assets/img', flatten: true },
            { from: './src/assets/favicon/*.*', to: '', flatten: true },
            // { from: './src/assets/index.html', to: '', flatten: true }
        ]),
        new webpack.DefinePlugin({        
           'process.env.REACT_APP_API_PORT': JSON.stringify(process.env.REACT_APP_API_PORT),
           'process.env.REACT_APP_API_HOST': JSON.stringify(process.env.REACT_APP_API_HOST)
        }),
    ],
    ...(process.env.NODE_ENV === 'development'
        ? { devtool: 'cheap-source-map' }
        : {}),
    devServer: {
        contentBase: './dist',
        port: 9000,
        hot: true,
        historyApiFallback: true,
        disableHostCheck: true,
    },
};
