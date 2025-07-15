// const path = require("path");
// // eslint-disable-next-line no-unused-vars
// function resolve(dir) {
//   return path.join(__dirname, "..", dir);
// }

module.exports = {
  productionSourceMap: false,
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
};
