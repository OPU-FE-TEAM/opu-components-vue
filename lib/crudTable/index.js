"use strict";

var _interopRequireDefault = require("E:/T/git/\u5965\u666ETeam/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CrudTable = void 0;

var _crudTable = _interopRequireDefault(require("./src/crudTable"));

var _setup = _interopRequireDefault(require("./conf/setup"));

_crudTable.default.install = function (Vue) {
  Vue.component(_crudTable.default.name, _crudTable.default);
};

_crudTable.default.setup = _setup.default;
var CrudTable = _crudTable.default;
exports.CrudTable = CrudTable;
var _default = _crudTable.default;
exports.default = _default;