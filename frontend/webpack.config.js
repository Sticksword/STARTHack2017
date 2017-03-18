const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './index.tsx',
    common: [ 'react', 'react-dom' ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/assets'
  },
  module: {
    rules: [
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { test: /\.styl$/, use: ExtractTextPlugin.extract({
        fallback: 'style-loader', use: ['css-loader', 'stylus-loader']
      })}
    ]
  },
  plugins: [
    //new BundleAnalyzerPlugin(),
    new ExtractTextPlugin('[name].css')
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  devtool: 'source-map',
  devServer: {
    // TODO: react hot loader
    contentBase: path.resolve(__dirname, './src'),
    inline: true
  }
};
