"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var GlobalConfig = {
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
  table: {},
  proxyConfig: {
    add: {
      modalTitle: "新增",
      props: {
        name: "新增"
      }
    },
    edit: {
      modalTitle: "编辑",
      props: {
        name: "编辑",
        size: "small"
      }
    },
    del: {
      modalTitle: "删除",
      popconfirmTitle: "您确认删除吗?",
      props: {
        name: "删除",
        size: "small",
        type: "danger"
      }
    },
    view: {
      modalTitle: "查看",
      trigger: ["dblclick", "button"],
      // click=单机行，dblclick=双击行，button 生成查看按钮
      props: {
        name: "查看",
        size: "small"
      }
    }
  },
  permissions: []
};
var _default = GlobalConfig;
exports.default = _default;