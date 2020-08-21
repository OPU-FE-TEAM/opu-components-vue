"use strict";

var _interopRequireDefault = require("D:/demo/vue-npm-template/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

_xeUtils.default.mixin({
  // 获取对象中指定key的值
  getObjData: function getObjData(key, obj) {
    var value = obj;

    if (key.indexOf(".") > -1) {
      var keysArr = key.split(".");

      for (var i = 0; i < keysArr.length; i++) {
        var k = keysArr[i];
        value = value[k];
      }
    } else {
      value = value[key];
    }

    return value;
  }
});

var _default = _xeUtils.default;
exports.default = _default;