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
    console.log("获取表头", arr);
    setTimeout(() => {
      // const code = arr && arr.code ? arr.code : "";
      const list = [
        {
          name: "name",
          sort: 0,
          show: true,
          width: 180,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "物品名称",
          freeze: null,
          children: [],
          sysColumnName: "物品名称",
          isHide: false,
          rowSpan: null,
          colSpan: null
        },
        {
          name: "goodsCode",
          sort: 1,
          width: 180,
          drag: true,
          align: "left",
          parentCode: "",
          customName: "物品编码",
          freeze: null,
          children: [],
          sysColumnName: "物品编码",
          isHide: false,
          rowSpan: null,
          colSpan: null
          // sortable: false
        },
        {
          name: "ending",
          sort: 26,
          show: true,
          width: 80,
          drag: true,
          align: "left",
          parentCode: null,
          customName: "期末",
          freeze: null,
          children: [
            {
              name: "endingQuantity",
              sort: 60,
              show: true,
              width: 100,
              drag: true,
              align: "right",
              parentCode: "ending",
              customName: "期末数量",
              freeze: "",
              children: [],
              sysColumnName: "期末数量",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "endingAvgPrice",
              sort: 61,
              show: true,
              width: 160,
              drag: true,
              align: "right",
              parentCode: "ending",
              customName: "期末进货均价",
              freeze: null,
              children: [],
              sysColumnName: "期末进货均价",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "endingTotalPrice",
              sort: 62,
              show: true,
              width: 160,
              drag: true,
              align: "right",
              parentCode: "ending",
              customName: "期末进货金额",
              freeze: null,
              children: [],
              sysColumnName: "期末进货金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            },
            {
              name: "endingRetailPrice",
              sort: 63,
              show: true,
              width: 160,
              drag: true,
              align: "right",
              parentCode: "ending",
              customName: "期末售价金额",
              freeze: null,
              children: [],
              sysColumnName: "期末售价金额",
              isHide: false,
              rowSpan: null,
              colSpan: null
            }
          ],
          sysColumnName: "期末",
          isHide: false,
          rowSpan: null,
          colSpan: 4
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

// function saveColumns(arr) {
//   return new Promise(resolve => {
//     console.log(arr);
//     setTimeout(() => {
//       const json = {
//         code: 0,
//         data: []
//       };
//       resolve(json);
//     }, 500);
//   });
// }
function handleTableSetColumnsData(data) {
  return data.map((item, index) => {
    item.sort = index;
    item.customName = item.title;
    item.freeze = item.fixed ? item.fixed : "";
    if (item.children && item.children.length) {
      item.children = handleTableSetColumnsData(item.children);
    }
    return item;
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
    pageIndex: 0,
    pageSize: 30, //默认每页条数
    slots: {
      left: grid => {
        const vm = new Vue();
        const h = vm.$createElement;
        let setColumnsButton = "";
        if (
          grid.$grid.$parent &&
          grid.$grid.$parent.$options.propsData &&
          grid.$grid.$parent.$options.propsData.setcolumnsConfig
        ) {
          setColumnsButton = h(
            "a-button",
            {
              props: {
                icon: "setting",
                size: "small"
              },
              style: { marginLeft: "8px" },
              on: {
                click: () => {
                  grid.$grid.$parent.showSetColumns &&
                    grid.$grid.$parent.showSetColumns();
                }
              }
            },
            []
          );
        }
        return [
          h(
            "a-button",
            {
              props: {
                icon: "reload",
                size: "small"
              },
              on: {
                click: () => {
                  grid.$grid.commitProxy("reload");
                }
              }
            },
            []
          ),
          setColumnsButton
        ];
      }
    }
  },
  proxyConfig: {
    seq: true, // 启用动态序号代理
    props: {
      result: "data.datas",
      total: "data.total",
      list: "data.datas"
    }
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
        submit: json => {
          console.log(json);
          debugger;
        }
      },
      on: {
        submitBefore: values => {
          return {
            checkType: values.typeCode,
            configList: handleTableSetColumnsData(values.data)
          };
        }
      }
    },
    tableConfig: {
      onCellEditChange: (e, event) => {
        console.log(e, event);
        if (
          event.field == "show" &&
          event.row.children &&
          event.row.children.length
        ) {
          for (let i = 0; i < event.row.children.length; i++) {
            let item = event.row.children[i];
            item.show = event.row[event.field];
          }
        }
        if (event.row.parentCode) {
          const parentFind = event.data.find(
            p => p.name == event.row.parentCode
          );
          if (parentFind && parentFind.children && parentFind.children.length) {
            const parentShow = parentFind.children.some(p => p.show === true);
            parentFind.show = parentShow;
          }
        }
      }
      // columns: [
      //   {
      //     width: 60,
      //     align: "center",
      //     slots: {
      //       default: "btn_default",
      //       header: () => {
      //         return "排序";
      //       }
      //     }
      //   },
      //   {
      //     field: "defaultTitle",
      //     title: "666",
      //     itemRender: {
      //       name: "a-input"
      //     }
      //   }
      // ]
    }
  },
  sortConfig: {
    handleServerSortParams: e => {
      console.log(e);
      return { aaaa: 123 };
    },
    notSortableFields: ["goodsCode"]
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
