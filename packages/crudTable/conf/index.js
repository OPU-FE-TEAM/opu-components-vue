const GlobalConfig = {
  modal: {
    props: {
      destroyOnClose: true,
      maskClosable: false
    }
  },
  form: {
    props: {
      colspan: 2,
      titleWidth: 100
    }
  },
  table: {
    border: true,
    resizable: true
  },
  proxyConfig: {
    add: {
      modalTitle: "新增",
      responseMsgField: "message",
      successMsgCode: "",
      responseCodeField: "",
      props: {
        name: "新增"
      }
    },
    edit: {
      modalTitle: "编辑",
      queryDataField: "",
      responseMsgField: "message",
      props: {
        name: "编辑"
        // size: "small"
      }
    },
    del: {
      modalTitle: "删除",
      popconfirmTitle: "您确认删除吗?",
      responseMsgField: "message",
      props: {
        name: "删除",
        // size: "small",
        type: "danger"
      }
    },
    view: {
      modalTitle: "查看",
      queryDataField: "",
      trigger: ["dblclick", "button"], // click=单机行，dblclick=双击行，button 生成查看按钮
      props: {
        name: "查看"
        // size: "small"
      }
    }
  },
  permissions: [],
  showPermissionsTip: false,
  showPermissionsTipText: "没有权限"
};

export default GlobalConfig;
