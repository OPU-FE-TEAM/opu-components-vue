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

var _test = _interopRequireDefault(require("./test"));

var _optionsComponent = _interopRequireDefault(require("./optionsComponent"));

var _baseComponent = _interopRequireDefault(require("./baseComponent"));

var _default = {
  Buttons: _buttons.default,
  ACustomRender: _customRender.default,
  AScopedSlots: _scopedSlots.default,
  AUpload: _upload.default,
  ARangePickerSplit: _rangePickerSplit.default,
  ATest: _test.default,
  OptionsComponent: _optionsComponent.default,
  BaseComponent: _baseComponent.default
};
exports.default = _default;