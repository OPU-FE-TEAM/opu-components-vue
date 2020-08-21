"use strict";

var _interopRequireDefault = require("D:/demo/vue-npm-template/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _input = _interopRequireDefault(require("ant-design-vue/es/input"));

require("ant-design-vue/lib/input/style/css");

var _select = _interopRequireDefault(require("ant-design-vue/lib/select"));

require("ant-design-vue/lib/select/style/css");

var _inputNumber = _interopRequireDefault(require("ant-design-vue/lib/input-number"));

require("ant-design-vue/lib/input-number/style/css");

var _checkbox = _interopRequireDefault(require("ant-design-vue/lib/checkbox"));

require("ant-design-vue/lib/checkbox/style/css");

var _radio = _interopRequireDefault(require("ant-design-vue/lib/radio"));

require("ant-design-vue/lib/radio/style/css");

var _datePicker = _interopRequireDefault(require("ant-design-vue/lib/date-picker"));

require("ant-design-vue/lib/date-picker/style/css");

var _switch = _interopRequireDefault(require("ant-design-vue/lib/switch"));

require("ant-design-vue/lib/switch/style/css");

var _rate = _interopRequireDefault(require("ant-design-vue/lib/rate"));

require("ant-design-vue/lib/rate/style/css");

var _slider = _interopRequireDefault(require("ant-design-vue/lib/slider"));

require("ant-design-vue/lib/slider/style/css");

var _cascader = _interopRequireDefault(require("ant-design-vue/lib/cascader"));

require("ant-design-vue/lib/cascader/style/css");

var _treeSelect = _interopRequireDefault(require("ant-design-vue/lib/tree-select"));

require("ant-design-vue/lib/tree-select/style/css");

var _upload = _interopRequireDefault(require("./upload"));

var _buttons = _interopRequireDefault(require("./buttons"));

var _customRender = _interopRequireDefault(require("./customRender"));

var _scopedSlots = _interopRequireDefault(require("./scopedSlots"));

// import "ant-design-vue/lib/upload/style/css";
var _default = {
  AButtons: _buttons.default,
  ACustomRender: _customRender.default,
  AScopedSlots: _scopedSlots.default,
  AInput: _input.default,
  APassword: _input.default.Password,
  ATextarea: _input.default.TextArea,
  ANumber: _inputNumber.default,
  ASelect: _select.default,
  ACheckbox: _checkbox.default,
  ACheckboxGroup: _checkbox.default.Group,
  ARadioGroup: _radio.default.Group,
  ADatePicker: _datePicker.default,
  AMonthPicker: _datePicker.default.MonthPicker,
  ARangePicker: _datePicker.default.RangePicker,
  AWeekPicker: _datePicker.default.WeekPicker,
  ASwitch: _switch.default,
  ARate: _rate.default,
  ASlider: _slider.default,
  ACascader: _cascader.default,
  ATreeSelect: _treeSelect.default,
  AUpload: _upload.default
};
exports.default = _default;