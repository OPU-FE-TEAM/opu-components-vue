"use strict";

var _interopRequireDefault = require("E:/T/git/\u5965\u666ETeam/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DataForm = void 0;

var _dataForm = _interopRequireDefault(require("./src/dataForm"));

var _selectGroup = _interopRequireDefault(require("./src/selectGroup"));

var _select = _interopRequireDefault(require("./src/select"));

var _upload = _interopRequireDefault(require("./src/upload"));

var _rangePickerSplit = _interopRequireDefault(require("./src/rangePickerSplit"));

var _inputNumberSplit = _interopRequireDefault(require("./src/inputNumberSplit"));

var _datePicker = _interopRequireDefault(require("./src/datePicker"));

var _timePicker = _interopRequireDefault(require("./src/timePicker"));

var _checkbox = _interopRequireDefault(require("./src/checkbox"));

var _treeSelect = _interopRequireDefault(require("./src/treeSelect"));

var _setup = _interopRequireDefault(require("./conf/setup"));

_dataForm.default.install = function (Vue) {
  Vue.component(_dataForm.default.name, _dataForm.default);
};

_dataForm.default.setup = _setup.default;
_dataForm.default.selectGroup = _selectGroup.default;
_dataForm.default.select = _select.default;
_dataForm.default.upload = _upload.default;
_dataForm.default.rangePickerSplit = _rangePickerSplit.default;
_dataForm.default.inputNumberSplit = _inputNumberSplit.default;
_dataForm.default.datePicker = _datePicker.default;
_dataForm.default.timePicker = _timePicker.default;
_dataForm.default.checkbox = _checkbox.default;
_dataForm.default.treeSelect = _treeSelect.default;
var DataForm = _dataForm.default;
exports.DataForm = DataForm;
var _default = _dataForm.default;
exports.default = _default;