const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

// const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
// const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

let devMode;

// console.log(process.env.NODE_ENV);

const config = {
  mode: devMode ? 'development' : 'production',
  entry: { 
    main: './src/index.js'
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
  },
  // entry: './src/index.js',
  output: {
    path: devMode ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'dist'),
    filename: devMode ? 'scripts/main.js' : 'scripts/main.js'
  },
  optimization: {
    // minimizer: [new TerserJSPlugin({})/*, new OptimizeCSSAssetsPlugin({})*/],
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : 'css/[name].min.css',
    })
  ],
  optimization: {
    minimize: false
  }
};


module.exports = (env, argv) => {
  devMode = argv.mode !== 'production';

  console.log(devMode);

  return config;
};