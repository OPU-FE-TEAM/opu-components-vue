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
          list[1].isSelected = true;
          json[item] = list;
        });
      } else if (arr.code) {
        const list = Array.from({ length: 5 }, (_, key) => ({
          id: key,
          default: key == 2 ? true : false,
          name: `${arr.code}_${key}_${Math.ceil(Math.random() * 10)}`,
          code: `code_${key}`
        }));
        list[1].isSelected = true;
        json[arr.code] = list;
      }
      console.log(json);
      resolve(json);
    }, 500);
  });
}

function getColumns(arr) {
  return new Promise(resolve => {
    console.log(arr);
    setTimeout(() => {
      // const code = arr && arr.code ? arr.code : "";
      const list = [
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "HIS编码",
          drag: true,
          freeze: null,
          isHide: false,
          name: "hisId",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 2,
          sysColumnName: "HIS编码",
          width: 120
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品编码",
          drag: true,
          freeze: null,
          isHide: false,
          name: "code",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 3,
          sysColumnName: "物品编码",
          width: 180
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品名称",
          drag: true,
          freeze: null,
          isHide: false,
          name: "name",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 4,
          sysColumnName: "物品名称",
          width: 180
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品名称1",
          drag: true,
          freeze: null,
          isHide: false,
          name: "name",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 4,
          sysColumnName: "物品名称1",
          width: 180
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品名称2",
          drag: true,
          freeze: null,
          isHide: false,
          name: "name",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 4,
          sysColumnName: "物品名称2",
          width: 180
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品名称3",
          drag: true,
          freeze: null,
          isHide: false,
          name: "name",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 4,
          sysColumnName: "物品名称3",
          width: 180
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品名称4",
          drag: true,
          freeze: null,
          isHide: false,
          name: "name",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 4,
          sysColumnName: "物品名称4",
          width: 180
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品名称5",
          drag: true,
          freeze: null,
          isHide: false,
          name: "name",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 4,
          sysColumnName: "物品名称5",
          width: 180
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品名称6",
          drag: true,
          freeze: null,
          isHide: false,
          name: "name",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 4,
          sysColumnName: "物品名称6",
          width: 180
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品名称7",
          drag: true,
          freeze: null,
          isHide: false,
          name: "name",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 4,
          sysColumnName: "物品名称7",
          width: 180
        },
        {
          align: "left",
          children: [],
          colSpan: null,
          customName: "物品名称8",
          drag: true,
          freeze: null,
          isHide: false,
          name: "name",
          parentCode: "",
          rowSpan: null,
          show: true,
          sort: 4,
          sysColumnName: "物品名称8",
          width: 180
        }
      ];
      const json = {
        // data: [...list],
        // total: 100
        code: 0,
        data: list
      };
      resolve(json);
    }, 500);
  });
}

function saveColumns(arr) {
  return new Promise(resolve => {
    console.log(arr);
    setTimeout(() => {
      const json = {
        code: 0,
        data: []
      };
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
    isPartRequest: true,
    defaultField: "isSelected"
  },
  props: {
    selfUpdate: true
  },
  defaultProps: {
    select: {
      showSearch: true,
      placeholder: "请选择",
      allowClear: true,
      searchFields: ["code"],
      defaultField: "isSelected"
    },
    selectGroup: {
      showSearch: true,
      placeholder: "请选择",
      allowClear: true,
      searchFields: ["code"]
    },
    rangePickerSplit: {
      allowClear: true,
      placeholder: "请选择1"
    },
    pulldownTable: {
      inputProps: {
        allowClear: true
      }
    }
  }
});
DataTable.setup({
  pagerConfig: {
    pageIndex: 0
  },
  proxyColumns: {
    props: {
      list: "data",
      show: "show",
      align: "align",
      fixed: "freeze",
      title: "customName",
      field: "name"
    },
    defaultAjax: {
      query: getColumns
    }
  },
  setColumns: {
    modal: {
      props: {
        bodyStyle: { height: "600px" }
      }
    },
    proxyConfig: {
      props: {
        list: "data",
        show: "show",
        align: "align",
        fixed: "freeze",
        title: "customName",
        field: "name",
        defaultTitle: "sysColumnName"
      },
      defaultAjax: {
        query: getColumns,
        submit: saveColumns
      },
      on: {
        submitBefore: values => {
          console.log(values);
          return {
            code: values.code,
            list: values.data
          };
        }
      }
    }
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
