"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.includes");

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

    if (key && key.indexOf(".") > -1) {
      var keysArr = key.split(".");

      for (var i = 0; i < keysArr.length; i++) {
        var k = keysArr[i];

        if (value[k]) {
          value = value[k];
        } else {
          break;
        }
      }
    } else if (key) {
      value = value[key];
    }

    return value;
  },

  /**
   * 判断两个数组中是否存在相同值
   * @param {*} array
   * @param {*} array1
   */
  hasEquaValueArray: function hasEquaValueArray(array, array1) {
    if (_xeUtils.default.isArray(array) && _xeUtils.default.isArray(array1)) {
      var equaValues = array.filter(function (p) {
        return array1.includes(p);
      });

      if (equaValues.length) {
        return true;
      }
    }

    return false;
  }
});

var _default = _xeUtils.default;
exports.default = _default;