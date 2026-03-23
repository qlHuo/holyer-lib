module.exports = {
  devServer: {
    port: 8080
  },
  lintOnSave: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
};
