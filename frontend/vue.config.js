const path = require('path');  
const project = require('./package.json');
const _ = require('lodash');

module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  filenameHashing: true,
  devServer: {
    disableHostCheck: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    proxy: {
      '^/socket.io|^/api': {
        target: 'http://localhost:9292',
        changeOrigin: true
      }
    }
  },
  pwa: {
    name: project.title,
    themeColor: "#f9f9f9",
    workboxOptions: {
      skipWaiting: true
    }
  },
  css:{
    loaderOptions: {
      scss: {
        prependData: `
          @import "@styles/_variables.scss";
          @import "~bulma";
          @import "~buefy/src/scss/buefy";
        `
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
        .tap(args => {
            args[0] = { ...args[0], ..._.pick(project, ['title', 'name', 'version']) }
            return args;
        })
    config
      .module
        .rules.delete('svg');
  },
  configureWebpack: {  
    resolve: {  
      alias: {  
        '~': path.resolve(__dirname, './node_modules/'),
        '~@':'./src/',
        '@components': path.resolve(__dirname, './src/components/'),
        '@helpers': path.resolve(__dirname, './src/helpers/'),
        '@services': path.resolve(__dirname, './src/services/'),
        '@styles': path.resolve(__dirname, './src/styles/'),
        '@assets': path.resolve(__dirname, './src/assets/')
      } 
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['babel-loader', 'vue-svg-loader'],
        },
      ]
    }
  }
}