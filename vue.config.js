const path = require('path')

const BASE_URL = 'http://your_domain/'

const minify = process.env.NODE_ENV === 'development' ? false : {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: "",
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      minify
    }
  },
  // runtimeCompiler: true,
  // configureWebpack: {
  //   externals: {
  //     vue: 'Vue',
  //     'vue-router': 'VueRouter',
  //     'element-ui': 'ELEMENT'
  //   }
  // },
  devServer: {
    overlay: false
  },
  chainWebpack(config) {
    config.module
      .rule('ejs')
      .test(/\.tpl\.ejs$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  },

  devServer: {
    https: false,
    proxy: {
      "/media": {
        target: BASE_URL + "media",
        changeOrigin: true,
        pathRewrite: {
          "^/media": "/",
        },
        secure: false,
      },
    },
  }
}
