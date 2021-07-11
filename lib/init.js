"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireWildcard");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  utils: true
};
Object.defineProperty(exports, "utils", {
  enumerable: true,
  get: function get() {
    return _utils.default;
  }
});
exports.default = void 0;

var _dataTable = _interopRequireWildcard(require("./dataTable"));

Object.keys(_dataTable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dataTable[key];
    }
  });
});

var _dataForm = _interopRequireWildcard(require("./dataForm"));

Object.keys(_dataForm).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dataForm[key];
    }
  });
});

var _crudTable = _interopRequireWildcard(require("./crudTable"));

Object.keys(_crudTable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _crudTable[key];
    }
  });
});

var _cell = _interopRequireWildcard(require("./cell"));

Object.keys(_cell).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _cell[key];
    }
  });
});

var _pageWraper = _interopRequireWildcard(require("./pageWraper"));

Object.keys(_pageWraper).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _pageWraper[key];
    }
  });
});

var _pulldownTable = _interopRequireWildcard(require("./pulldownTable"));

Object.keys(_pulldownTable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _pulldownTable[key];
    }
  });
});

var _utils = _interopRequireDefault(require("./utils"));

var cellGroup = _cell.default.Group; // 按需加载的组件

var components = [_dataForm.default, _dataTable.default, _crudTable.default, _cell.default, cellGroup, _pageWraper.default, _pulldownTable.default]; // 默认安装

function install(Vue) {
  // 判断是否安装
  if (install.installed) return; // 遍历注册全局组件

  components.map(function (component) {
    return Vue.component(component.name, component);
  });
}

if (typeof window !== "undefined" && window.Vue && window.Vue.use) {
  install(window.Vue);
}

var _default = {
  install: install
};
exports.default = _default;