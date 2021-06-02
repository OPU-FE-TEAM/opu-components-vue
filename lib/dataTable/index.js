"use strict";

var _interopRequireDefault = require("E:/T/git/\u5965\u666ETeam/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DataTable = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _dataTable = _interopRequireDefault(require("./src/dataTable"));

var _vxeTable = _interopRequireDefault(require("vxe-table"));

var _setup = _interopRequireDefault(require("./conf/setup"));

var _vxeTablePluginAntd = _interopRequireDefault(require("vxe-table-plugin-antd"));

require("vxe-table-plugin-antd/dist/style.css");

_vxeTable.default.use(_vxeTablePluginAntd.default);

_vue.default.use(_vxeTable.default);

_vue.default.prototype.$modal = _vxeTable.default.modal; // import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
// Vue.use(Antd);

_dataTable.default.setup = _setup.default;

_dataTable.default.install = function (Vue) {
  Vue.component(_dataTable.default.name, _dataTable.default);
};

var DataTable = _dataTable.default;
exports.DataTable = DataTable;
var _default = _dataTable.default;
exports.default = _default;