const path = require('path')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
    // 将entry指向examples
    pages: {
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    // 为packages目录添加babel-loader处理
    chainWebpack: config => {
        config.module
        .rule('js')
        .include
            .add(resolve('packages'))
            .end()
        .use('babel')
            .loader('babel-loader')
            .tap(options => {
                return options
            })
    },
    devServer: {
        port: 8866
    }
}