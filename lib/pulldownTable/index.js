"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PulldownTable = void 0;

var _pulldownTable = _interopRequireDefault(require("./src/pulldownTable"));

_pulldownTable.default.install = function (Vue) {
  Vue.component(_pulldownTable.default.name, _pulldownTable.default);
};

var PulldownTable = _pulldownTable.default;
exports.PulldownTable = PulldownTable;
var _default = _pulldownTable.default;
exports.default = _default;