"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var GlobalConfig = {
  layout: "grid",
  // 默认布局
  colspan: 1,
  // grid、flex 布局下默认列数
  titleWidth: 120,
  // 所有项的标题宽度
  titleAlign: "right",
  // 所有项的标题对齐方式，left,center,right
  titleColon: true,
  // 是否显示所有项标题后的冒号
  fieldsOptionsApi: null,
  // 可选数据的请求api
  filterNullValues: true //获取数据时是否清除空值字段值

};
var _default = GlobalConfig;
exports.default = _default;