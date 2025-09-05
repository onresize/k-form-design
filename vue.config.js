const { codeInspectorPlugin } = require('code-inspector-plugin')
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  publicPath: isDev ? '/' : '/form_design',
  devServer: {
    host: '0.0.0.0',
    port: 2777, // vue启动的端口
    proxy: {
      '/api-mes': {
        target: process.env.VUE_APP_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          '/api-mes': '/api-mes',
        },
      },
    },
  },
  pages: {
    index: {
      // 页面入口
      entry: 'examples/main.js',
      // 模板来源
      template: 'pubilc/index.html',
      // 输出文件名
      filename: 'index.html',
    },
  },
  lintOnSave: isDev ? false : true,
  productionSourceMap: false,
  // devServer: {
  //   host: '0.0.0.0',
  //   port: 2888,
  //   open: false, //运行后自动打开浏览器
  //   client: {
  //     overlay: false, // 编译错误时，取消全屏覆盖
  //   },
  //   proxy: {
  //     '/api-mes': {
  //       target: process.env.VUE_APP_BASE_URL,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '/api-mes': '/api-mes',
  //       },
  //     },
  //   },
  // },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#409EFF',
          'layout-color': '#FFFFFF',
          // "primary-color": "#9867f7",
          // "layout-color": "#ee88aa"
        },
        javascriptEnabled: true,
      },
    },
  },
  configureWebpack: (config) => {
    config.devtool = isDev ? 'source-map' : false

    // dom跳转vscode源码插件
    config.plugins.push(
      codeInspectorPlugin({
        bundler: 'webpack',
      })
    )

    //性能提示
    config.performance = {
      hints: false,
    }
  },
}
