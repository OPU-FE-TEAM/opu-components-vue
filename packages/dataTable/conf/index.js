const GlobalConfig = {
  editSize: "default",
  props: {
    border: true,
    resizable: true
  },
  pagerConfig: {
    pageIndex: 1, //分页初始值
    pageSize: 20,
    layouts: [
      "PrevJump",
      "PrevPage",
      "Number",
      "NextPage",
      "NextJump",
      "Sizes",
      "FullJump",
      "Total"
    ],
    perfect: true,
    props: {
      pageSize: "pageSize",
      currentPage: "pageIndex"
    }
  },
  getSelectOptions: {
    api: null,
    valueField: "value",
    labelField: "label",
    childrenField: "children",
    dataField: "data",
    defaultField: "default",
    originalValueKey: "originalValue",
    isPartRequest: false //是否将统一api分别发送请求
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
    select: {
      showSearch: true,
      placeholder: "请选择",
      allowClear: true
    }
  },
  // 接口代理
  proxyConfig: {
    seq: true, // 启用动态序号代理
    props: {
      result: "data.data",
      total: "data.total",
      list: "data.data"
    }
  },
  // 表头代理
  proxyColumns: {
    props: {
      list: "data.data",
      show: "show" //显示列的字段
      // align: "align",
      // fixed: "freeze"
    }
  },
  // 设置表头
  setColumns: {
    modal: {
      props: {
        title: "设置表头",
        width: 800
      }
    },
    proxyConfig: {
      props: {
        list: "data.data"
      },
      on: {}
    }
  }
};

export default GlobalConfig;
