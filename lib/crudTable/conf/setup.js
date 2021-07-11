"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./index"));

var _utils = _interopRequireDefault(require("../../utils"));

function mergeOpts(data1, data2) {
  if (data1 && _utils.default.isObject(data2)) {
    _utils.default.objectEach(data2, function (val, key) {
      data1[key] = data1[key] && val ? mergeOpts(data1[key], val) : val;
    });

    return data1;
  }

  return data2;
}
/**
 * 全局参数设置
 */


function setup() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  mergeOpts(_index.default, options);
  return _index.default;
}

var _default = setup;
exports.default = _default;