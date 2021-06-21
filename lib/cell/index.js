"use strict";

var _interopRequireDefault = require("E:/T/git/\u5965\u666ETeam/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Cell = void 0;

var _cell = _interopRequireDefault(require("./src/cell"));

var _cellGroup = _interopRequireDefault(require("./src/cellGroup"));

_cell.default.install = function (Vue) {
  Vue.component(_cell.default.name, _cell.default);
  Vue.component(_cellGroup.default.name, _cellGroup.default);
};

_cell.default.Group = _cellGroup.default;
var Cell = _cell.default;
exports.Cell = Cell;
var _default = _cell.default;
exports.default = _default;