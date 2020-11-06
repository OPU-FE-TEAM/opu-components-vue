const GlobalConfig = {
  layout: "grid", // 默认布局
  colspan: 1, // grid、flex 布局下默认列数
  titleWidth: 120, // 所有项的标题宽度
  titleAlign: "right", // 所有项的标题对齐方式，left,center,right
  titleColon: true, // 是否显示所有项标题后的冒号
  filterNullValues: true, //获取数据时是否清除空值字段值
  getSelectOptions: {
    // 可选数据的请求的配置
    api: null,
    valueField: "id",
    labelField: "name",
    dataField: "data",
    defaultField: "default"
  }
};

export default GlobalConfig;
