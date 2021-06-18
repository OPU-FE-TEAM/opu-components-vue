const GlobalConfig = {
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
      }
    }
  }
};

export default GlobalConfig;
