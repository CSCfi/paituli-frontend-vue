const { merge } = require('webpack-merge');
const Dotenv = require('dotenv-webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: './dist',
    //openPage: 'home.html',
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
		pathRewrite: { '^/api': '' },
      },
    },
  },
  plugins: [
    new Dotenv({
      path: './.env.development',
    }),
  ],

  performance: {
    hints: 'warning',
    maxAssetSize: 20000000,
    maxEntrypointSize: 40000000,
  },
})
