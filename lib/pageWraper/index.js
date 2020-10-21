"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PageWraper = void 0;

var _pageWraper = _interopRequireDefault(require("./src/pageWraper"));

_pageWraper.default.install = function (Vue) {
  Vue.component(_pageWraper.default.name, _pageWraper.default);
};

var PageWraper = _pageWraper.default;
exports.PageWraper = PageWraper;
var _default = _pageWraper.default;
exports.default = _default;