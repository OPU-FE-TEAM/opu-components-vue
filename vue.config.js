const path = require("path");
function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  // 将entry指向examples
  pages: {
    index: {
      entry: "examples/main.js",
      template: "public/index.html",
      filename: "index.html"
    }
  },
  devServer: {
    port: 3001
  }
  // 为packages目录添加babel-loader处理
  //   chainWebpack: config => {
  //     config.module
  //       .rule("js")
  //       .include.add(resolve("packages"))
  //       .end()
  //       .use("babel")
  //       .loader("babel-loader")
  //       .tap(options => {
  //         return options;
  //       });
  //   }
};
