"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/toConsumableArray"));

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
  },

  /**
   * 将字符串复制到剪切板
   * @param {*} text
   */
  copyTextToClipboard: function copyTextToClipboard(text) {
    var element = document.createElement("textarea");
    var previouslyFocusedElement = document.activeElement;
    element.value = text;
    element.setAttribute("readonly", "");
    element.style.contain = "strict";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.fontSize = "12pt";
    var selection = document.getSelection();
    var originalRange;

    if (selection && selection.rangeCount > 0) {
      originalRange = selection.getRangeAt(0);
    }

    document.body.append(element);
    element.select();
    element.selectionStart = 0;
    element.selectionEnd = text.length;
    var isSuccess = false;

    try {
      isSuccess = document.execCommand("copy");
    } catch (e) {
      throw new Error(e);
    }

    element.remove();

    if (originalRange && selection) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }

    return isSuccess;
  },
  // 将指定字符（下划线）转换为首字母小写驼峰
  lineToUpperCase: function lineToUpperCase(str) {
    var sign = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "_";
    var arr = str.split(sign);
    var newStr = "";

    if (arr && arr.length) {
      for (var i = 0; i < arr.length; i++) {
        var p = arr[i];
        newStr += i > 0 ? p.replace(p[0], p[0].toUpperCase()) : p;
      }
    } else {
      newStr = str;
    }

    return newStr;
  },
  // 树形结构转为数组
  treeTransArray: function treeTransArray(tree) {
    var _ref;

    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "children";
    return (_ref = []).concat.apply(_ref, (0, _toConsumableArray2.default)(tree.map(function (item) {
      if (item[key] && item[key].length) {
        var currentItem = _xeUtils.default.clone(item, true);

        delete currentItem[key];
        return [].concat(currentItem, _xeUtils.default.treeTransArray(item[key], key));
      } else {
        return item;
      }
    })));
  }
});

var _default = _xeUtils.default;
exports.default = _default;