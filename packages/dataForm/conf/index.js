const GlobalConfig = {
  props: {},
  layout: "grid", // 默认布局
  colspan: 1, // grid、flex 布局下默认列数
  titleWidth: 120, // 所有项的标题宽度
  titleAlign: "right", // 所有项的标题对齐方式，left,center,right
  titleColon: true, // 是否显示所有项标题后的冒号
  filterNullValues: true, //获取数据时是否清除空值字段值
  // 提交按钮的props参数
  submitButtonProps: {
    type: "primary",
    content: "提交"
  },
  // 重置按钮的props参数
  cancelButtonProps: {
    content: "重置"
  },
  // 展开/收起按钮的props参数
  foldingButtonProps: {
    openText: "展开",
    hideText: "收起",
    openIcon: "down",
    hideIcon: "up",
    type: "link"
  },
  // 可选数据的请求的配置
  getSelectOptions: {
    api: null,
    valueField: "value",
    labelField: "label",
    dataField: "data",
    defaultField: "default"
  },
  // 各个表单项默认的props
  defaultProps: {
    // input: {
    //   placeholder: "请输入",
    //   allowClear: true
    // },
    // inputNumber: {
    //   placeholder: "请输入数字",
    //   allowClear: true
    // },
    // select: {
    //   showSearch: true,
    //   placeholder: "请选择",
    //   allowClear: true
    // }
  }
};

export default GlobalConfig;
