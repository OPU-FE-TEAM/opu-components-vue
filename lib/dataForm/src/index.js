"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _buttons = _interopRequireDefault(require("./buttons"));

var _customRender = _interopRequireDefault(require("./customRender"));

var _scopedSlots = _interopRequireDefault(require("./scopedSlots"));

var _upload = _interopRequireDefault(require("./upload"));

var _rangePickerSplit = _interopRequireDefault(require("./rangePickerSplit"));

var _optionsComponent = _interopRequireDefault(require("./optionsComponent"));

var _datePicker = _interopRequireDefault(require("./datePicker"));

var _timePicker = _interopRequireDefault(require("./timePicker"));

var _select = _interopRequireDefault(require("./select"));

var _switch = _interopRequireDefault(require("./switch"));

var _checkbox = _interopRequireDefault(require("./checkbox"));

var _treeSelect = _interopRequireDefault(require("./treeSelect"));

// import ATest from "./test";
var _default = {
  Buttons: _buttons.default,
  ACustomRender: _customRender.default,
  AScopedSlots: _scopedSlots.default,
  AUpload: _upload.default,
  ARangePickerSplit: _rangePickerSplit.default,
  OpuSelect: _select.default,
  OptionsComponent: _optionsComponent.default,
  OpuDatePicker: _datePicker.default,
  OpuTimePicker: _timePicker.default,
  OpuSwitch: _switch.default,
  OpuCheckbox: _checkbox.default,
  OpuTreeSelect: _treeSelect.default
};
exports.default = _default;