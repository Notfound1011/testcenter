const path = require('path');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const webpack = require('webpack');
const productionGzipExtensions = ["js", "css"];

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 8080,
    proxy: {
      //1.8需求：增加分享功能，不登陆即可看到文档页面。所以代理设置增加了(?!/document)文档页面的相关信息
      // ['^(?!/login)']: {
      // ['^((?!/login)(?!/document))']: {
      //   target: 'https://localhost:8443',
      //   ws: true,
      // },
      '/api/tc/naguri': {
        target: "http://3.1.250.199:7001",
        // target: "http://0.0.0.0:7001",
        changeOrigin: true,
        pathRewrite: {
          '^/api/tc/naguri': '/'
        }
      },
      '/api/tc/pyServer': {
        // target: "http://3.1.250.199:6200",
        // target: "http://172.24.0.97:6200",
        target: "http://127.0.0.1:6200",
        changeOrigin: true,
        pathRewrite: {
          '^/api/tc/pyServer': '/'
        }
      },
      '/api/tc/codeCoverage': {
        target: "http://3.1.250.199:8080",
        // target: "http://172.24.0.204:8080",
        changeOrigin: true,
        pathRewrite: {
          '^/api/tc/codeCoverage': '/'
        }
      },
      '/api/tc/jenkins': {
        target: "http://3.1.250.199:6001",
        changeOrigin: true,
        pathRewrite: {
          '^/api/tc/jenkins': '/',
        }
      },
      '/api/tc/jira': {
        target: "http://jira.cmexpro.com",
        changeOrigin: true,
        pathRewrite: {
          '^/api/tc/jira': '/',
        }
      },
      '/api/tc/dataFactory': {
        target: 'http://3.1.250.199:8084',
        // target: 'http://localhost:8084',
        changeOrigin: true,
        pathRewrite: {'^/api/tc/dataFactory': '/'},
      },
      '/api/tc': {
        target: 'http://3.1.250.199:8081',
        // target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {'^/api/tc': '/'},
      },
      ['^((?!/login)(?!/document))']: {
        target: 'http://3.1.250.199:8081',
        // target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  },
  pages: {
    business: {
      entry: "src/business/main.js",
      template: "src/business/index.html",
      filename: "index.html"
    },
    login: {
      entry: "src/login/login.js",
      template: "src/login/login.html",
      filename: "login.html"
    },
    document: {
      entry: "src/document/document.js",
      template: "src/document/document.html",
      filename: "document.html",
    },
    sharePlanReport: {
      entry: "src/template/report/plan/share/share-plan-report.js",
      template: "src/template/report/plan/share/share-plan-report.html",
      filename: "share-plan-report.html",
    },
    sharePerformanceReport: {
      entry: "src/template/report/performance/share/share-performance-report.js",
      template: "src/template/report/performance/share/share-performance-report.html",
      filename: "share-performance-report.html",
    },
    shareApiReport: {
      entry: "src/template/report/api/share/share-api-report.js",
      template: "src/template/report/api/share/share-api-report.html",
      filename: "share-api-report.html",
    },
    enterpriseReport: {
      entry: "src/template/enterprise/share/share-enterprise-report.js",
      template: "src/template/enterprise/share/share-enterprise-report.html",
      filename: "share-enterprise-report.html",
    },
    planReport: { //这个配置要放最后，不然会导致测试计划导出报告没有将css和js引入html，原因没具体研究
      entry: "src/template/report/plan/plan-report.js",
      template: "src/template/report/plan/plan-report.html",
      filename: "plan-report.html",
    }
  },
  configureWebpack: {
    devtool: 'cheap-module-source-map',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240,
        minRatio: 0.8
      }),
      // maxChunks：使用大于或等于 1 的值，来限制 chunk 的最大数量。使用 1 防止添加任何其他额外的 chunk，这是因为 entry/main chunk 也会包含在计数之中。
      //minChunkSize: 设置 chunk 的最小大小。
      // 限制打包的个数(减少打包生成的js文件和css文件)
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 10,
        minChunkSize: 100
      })
    ],
  },
  chainWebpack: config => {
    // 报告模板打包成一个html
    config.plugin('html-planReport')
      .tap(args => {
        args[0].inlineSource = '.(js|css)$';
        return args;
      });
    config.plugin('inline-source-html-planReport')
      .after('html-planReport')
      .use(HtmlWebpackInlineSourcePlugin);
    config.plugins.delete('prefetch');
  }
};
