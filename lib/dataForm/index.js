"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DataForm = void 0;

var _dataForm = _interopRequireDefault(require("./src/dataForm"));

var _setup = _interopRequireDefault(require("./conf/setup"));

_dataForm.default.install = function (Vue) {
  Vue.component(_dataForm.default.name, _dataForm.default);
};

_dataForm.default.setup = _setup.default;
var DataForm = _dataForm.default;
exports.DataForm = DataForm;
var _default = _dataForm.default;
exports.default = _default;