const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const postcssNormalize = require('postcss-normalize');
const isWsl = require('is-wsl');
const safePostCssParser = require('postcss-safe-parser');
const TerserPlugin = require('terser-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require("path");
const isEnvProduction = process.env.NODE_ENV == 'production';
const isEnvDevelopment = process.env.NODE_ENV == 'development';
const smp = new SpeedMeasurePlugin();
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const webpack = require('webpack');

const getStyleLoaders = () => {
    const loaders = [
        isEnvDevelopment && require.resolve('style-loader'),
        isEnvProduction && {
            loader: MiniCssExtractPlugin.loader
        },

        'css-loader',
        {
            loader: require.resolve('postcss-loader'),
            options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                        autoprefixer: {
                            // flexbox: 'no-2009',
                        },
                        stage: 3,
                    }),
                    // Adds PostCSS Normalize as the reset css with default options,
                    // so that it honors browserslist config in package.json
                    // which in turn let's users customize the target behavior as per their needs.
                    postcssNormalize(),
                ],
                sourceMap: isEnvProduction,
            }
        },
        'sass-loader'
    ].filter(Boolean);

    return loaders;
};
/**
 * noParse 和ignorePlugin并不一样。 用moment测试的额结果是：
 * 如果noParse设置moment，那么moment里面的require什么都不加载，如果代码中手动import加载其中的语言包，。报错
 * 按时设置ignorePlugin的话，手动import是work的

 */

module.exports = smp.wrap({
    mode: isEnvProduction ? 'production' : 'development',
    devtool: 'inline-source-map',
    entry: {
        index: './src/index.tsx',
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, "dist"), //路径必须是绝对路径
        // publicPath: '/dist/' // publicPath会影响最终在path目录下生成的资源的引用。比如生成的html中，引用的main.js的路径会根据这个配置改变。
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            "@": path.join(__dirname, "src"),
            pages: path.join(__dirname, "src/pages"),
            router: path.join(__dirname, "src/router")
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({ eslint: true }),
        new ForkTsCheckerNotifierWebpackPlugin({ title: 'TypeScript', excludeWarnings: false }),
        new CleanWebpackPlugin(), // 清空output folder
        new webpack.IgnorePlugin(/\.\/locale/, /moment/),
        new htmlWebpackPlugin({
            template: './src/index.html', // 原始的页面
            filename: 'index.html', // 最终生成的页面
            // favicon: './src/assets/M1.ico'
        }),
        new MiniCssExtractPlugin({ // 只在production用。
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[hash].css',
            chunkFilename: '[id].css'
        }),

        // new webpack.ProvidePlugin({ // 在每个模块中都注入$，不用import $ from 'jquery'
        //     $: 'jquery'
        // }),
        // new AddAssetHtmlWebpackPlugin({
        //     filepath: path.resolve(__dirname, 'dll/vendors.dll.js') // 对应的 dll 文件路径
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        outputPath: "images/", // 图片输出的路径
                        name: '[name].[hash:8].[ext]',
                        limit: 0
                    }
                }
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
                            publicPath: 'fonts/',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(ts|js)x?$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            formatter: eslintFormatter,
                        },
                    },
                ],
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.(ts|js)x?$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, // 这个cache是babel-loader提供的
                            cacheCompression: isEnvProduction,
                            compact: isEnvProduction
                        }
                    }
                ]

            },
            {
                test: /(\.module|).scss$/,
                use: getStyleLoaders(),
                sideEffects: true,
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        module: 'empty',
        dgram: 'empty',
        dns: 'mock',
        fs: 'empty',
        http2: 'empty',
        net: 'empty',
        tls: 'empty',
        'child_process': 'empty',
    },
    devServer: {
        port: 8080,
        hot: true,
        // host: "0.0.0.0", // 可以使用手机访问
        historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
        // progress: true,
        contentBase: false, // 默认是当前working directory，即 Content not from webpack is served from /Users/choli/Desktop/chong/webpack-test
        compress: false,
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:1337',
        //         pathRewrite: { '^/api': '' }
        //     }
        // }
        // publicPath: '/dist/' // 设置这个就是： Project is running at http://0.0.0.0:8080/ ｢wds｣: webpack output is served from /dist/
    }
});
