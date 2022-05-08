module.exports = {
  // 去掉map文件
  productionSourceMap: false,
  // 关闭Eslint
  lintOnSave: false,
  // 代理跨域
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://39.98.123.211'
        target: 'http://gmall-h5-api.atguigu.cn',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}