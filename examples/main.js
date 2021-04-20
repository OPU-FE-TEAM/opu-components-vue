import Vue from "vue";
import App from "./App.vue";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

import opuCompontents, { DataForm, DataTable, CrudTable } from "../index";

// Vue.use(DataForm);
import utils from "../packages/utils";

function getSelectData(arr) {
  console.log("getSelectData Param", arr);
  if (!arr) {
    arr = { code: "ab" };
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const json = {};
      if (utils.isArray(arr.code)) {
        arr.code.map(item => {
          const list = Array.from({ length: 5 }, (_, key) => ({
            id: key,
            default: key == 2 ? true : false,
            name: `${item}_${key}`
          }));
          json[item] = list;
        });
      } else if (arr.code) {
        const list = Array.from({ length: 5 }, (_, key) => ({
          id: key,
          default: key == 2 ? true : false,
          name: `${arr.code}_${key}_${Math.ceil(Math.random() * 10)}`,
          code: `code_${key}`
        }));
        json[arr.code] = list;
      }
      console.log(json);
      resolve(json);
    }, 500);
  });
}

DataForm.setup({
  titleColon: false,
  titleWidth: 220,
  layout: "flex",
  getSelectOptions: {
    api: getSelectData,
    valueField: "id",
    labelField: "name",
    // autoLoadOptionsData: true, //是否自动获取下拉数据
    loadOptionsIdField: "id",
    isPartRequest: true
  },
  props: {
    selfUpdate: true
  },
  defaultProps: {
    select: {
      showSearch: true,
      placeholder: "请选择",
      allowClear: true,
      searchFields: ["code"]
    }
  }
});
DataTable.setup({
  pagerConfig: {
    pageIndex: 0
  }
});

CrudTable.setup({
  // 操作代理配置
  proxyConfig: {
    // 新增
    add: {
      modalTitle: "新增", // 弹窗标题
      successMsgCode: 0,
      responseCodeField: "code",
      props: {
        name: "新增", // 按钮文字
        type: "primary"
        //... 可配置更多按钮属性
      }
    },
    // 编辑
    edit: {
      modalTitle: "编辑",
      props: {
        name: "编辑",
        size: "small",
        type: "link"
      }
    },
    // 删除
    del: {
      modalTitle: "删除",
      popconfirmTitle: "您确认删除吗", // 提示确认文本
      successMsgCode: 0,
      responseCodeField: "code",
      props: {
        name: "删除",
        size: "small",
        type: "link"
      }
    },
    view: {
      modalTitle: "查看",
      trigger: ["dblclick", "button"], //触发场景： click=单机行，dblclick=双击行，button 生成查看按钮
      props: {
        name: "查看",
        size: "small",
        type: "link"
      }
    }
  }
});

Vue.config.productionTip = false;
Vue.use(opuCompontents);

new Vue({
  render: h => h(App)
}).$mount("#app");
