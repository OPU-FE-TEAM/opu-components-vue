<template>
  <div>
    {{ data }}
    <DataTable
      border
      resizable
      show-overflow
      ref="dataTable"
      :data="data"
      :columns="columns"
      :pager-config="false"
      height="600px"
      highlight-current-row
      :keyboard-config="{ isArrow: false }"
    >
      <!-- editLine -->
      <template #name_edit="{ row }">
        <vxe-input v-model="row.name" ref="input"></vxe-input>
      </template>
      <template v-slot:operate="{ row }">
        <a-button @click="editRow(row)">删除</a-button>
      </template>
    </DataTable>
    <a-date-picker />
    <a-button @click="onAdd">新增</a-button>
    <a-button @click="onChange">改变</a-button>
    <a-button @click="onChangeSelect">改变VIP下拉数据</a-button>
    <a-button @click="getData">获取数据</a-button>
    <!-- <a-button @click="updateDate">赋值</a-button> -->
    <a-button @click="onChangeColumns">改变表格列</a-button>
    <a-button @click="onFocusEditRow">选中行</a-button>
    <!-- <p>{{ data }}</p> -->
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
import moment from "moment";

const getTableSelectData = (param, i = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let data = {
        data: {}
      };
      let code = param.code;
      data.data[code] = initTableFieldData(code, i);
      resolve(data);
    }, 2000);
  });
};

const initTableFieldData = (field, num = 0) => {
  let data = [];
  for (let i = num; i < num + 10; i++) {
    data.push({
      id: i + "",
      name: field + i + "",
      code: i + 1 + "code",
      text: field + i + ""
    });
  }
  return data;
};

function getData(arr = {}) {
  return new Promise(resolve => {
    setTimeout(() => {
      const size = arr.pageSize ? arr.pageSize : 20;
      const pageIndex = arr.pageIndex ? arr.pageIndex : 1;
      let list = Array.from({ length: size }, (_, key) => ({
        id: key,
        name: `name_${pageIndex}_${key}`,
        sex: key < 3 ? 1 : 2,
        age: key
      }));
      if (arr && arr.keyword == "123") {
        list = [];
      }
      const json = {
        // data: [...list],
        // total: 100
        code: 0,
        data: {
          datas: [...list],
          total: 100
        }
      };
      resolve(json);
    }, 500);
  });
}
getData;

let defaultRow = {
  type1: "",
  switch: false,
  switch1: "1",
  checkbox: false,
  checkbox1: "1",
  name: "123",
  number: "333",
  orderType: { id: "1", text: "6661" },
  vip: undefined,
  input: "",
  market: "",
  apiSelect: "",
  apiSelect1: "",
  date: moment(),
  oneSelect: [{ id: "1", text: "666" }],
  oneSelect1: "",
  oneSelectList: [
    { value: 11, label: "广西" },
    { value: 22, label: "广东" }
  ],
  oneSelectList1: [
    { value: 11, label: "广西1" },
    { value: 22, label: "广东1" }
  ],
  time: moment("12:08:23", "HH:mm:ss"),
  time1: undefined
};

export default {
  components: {},
  data() {
    const longColumns = [];
    for (let i = 0; i < 30; i++) {
      let row = {
        field: "name" + i,
        align: "left",
        title: "名称" + i,
        width: 100,
        editRender: {},
        slots: {
          edit: "name_edit",
          default: ({ row }) => {
            return [<div class="aa">{row.name0}</div>];
          }
        }
        // itemRender: {
        //   name: "AInput"
        //   // props: {
        //   //   disabled: row => {
        //   //     return row.orderType == 1;
        //   //   }
        //   // }
        // }
      };
      longColumns.push(row);
    }
    let data = [];
    for (let i = 0; i < 1; i++) {
      data.push(cloneDeep(defaultRow));
    }
    return {
      longColumns,
      columns: [
        { type: "checkbox", colIndex: 0, width: 60, fixed: "left" },
        // {
        //   field: "date",
        //   title: "日期111",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "a-date-picker",
        //     props: {
        //       format: "YYYY-MM-DD"
        //       // format: "YYYY-MM-DD HH:mm:ss",
        //       // showTime: true,
        //     },
        //     on: {
        //       change: e => {
        //         console.log(e);
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "bind",
        //   title: "合并列",
        //   children: [
        //     {
        //       field: "market",
        //       align: "left",
        //       title: "市场",
        //       minWidth: 150,
        //       itemRender: {
        //         name: "ASelect",
        //         props: {
        //           param: { code: "Market" },
        //           dataField: "data.Market",
        //           default: ({ row }) => {
        //             return [<span style="color:red;">{row.market}</span>];
        //           }
        //         },
        //         on: {
        //           // keyup: () => {
        //           //   this.onFocusEditRow();
        //           //   return false;
        //           // }
        //         }
        //       }
        //     },
        //     {
        //       field: "pulldown",
        //       title: "下拉面板",
        //       minWidth: 150,
        //       itemRender: {
        //         name: "pulldown-table",
        //         props: {
        //           valueField: "name",
        //           textField: "age",
        //           table: {
        //             props: {
        //               columns: [
        //                 { type: "checkbox", width: 50 },
        //                 { type: "seq", title: "Number", width: 80 },
        //                 {
        //                   field: "name",
        //                   title: "Name",
        //                   width: 200
        //                 },
        //                 {
        //                   field: "sex",
        //                   title: "Sex",
        //                   width: 200
        //                 },
        //                 {
        //                   field: "age",
        //                   title: "Age",
        //                   width: 200
        //                 }
        //               ],
        //               size: "mini",
        //               height: 300,
        //               proxyConfig: {
        //                 autoLoad: false,
        //                 ajax: {
        //                   query: getData
        //                 }
        //               }
        //             }
        //           }
        //         },
        //         on: {
        //           change(val, sel) {
        //             console.log("change", val, sel);
        //           },
        //           inputChange(sel) {
        //             console.log("inputChange", sel);
        //           }
        //         }
        //       }
        //     }
        //   ]
        // },

        // {
        //   field: "type1",
        //   align: "left",
        //   title: "搜索输入",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "AAutoComplete",
        //     props: {
        //       labelField: "label",
        //       valueField: "label",
        //       options: [
        //         { value: "1", label: "省份" },
        //         { value: "2", label: "省份1" },
        //         { value: "21", label: "省份2" },
        //         { value: "22", label: "省份3" },
        //         { value: "3", label: "区域" },
        //         { value: "4", label: "123" }
        //       ]
        //     },
        //     on: {
        //       select: (e, option) => {
        //         console.log(e);
        //         console.log(option);
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "bind1",
        //   title: "合1111",
        //   children: [
        //     {
        //       field: "input",
        //       align: "left",
        //       title: "输入框",
        //       minWidth: 100,
        //       itemRender: {
        //         name: "a-input"
        //       }
        //     },
        //     {
        //       field: "bind1-1",
        //       title: "合2222",
        //       children: [
        //         {
        //           field: "number",
        //           align: "right",
        //           title: "数量",
        //           minWidth: 150,
        //           itemRender: {
        //             name: "AInputNumber",
        //             props: {
        //               disabled: row => {
        //                 return row.orderType == 2;
        //               },
        //               min: 0
        //             },
        //             after: () => {
        //               return [<a-button style="padding:0 5px;">每日</a-button>];
        //             }
        //           }
        //         },
        //         {
        //           field: "apiSelect",
        //           align: "left",
        //           title: "请求下拉",
        //           minWidth: 150,
        //           itemRender: {
        //             name: "ASelect",
        //             props: {
        //               api: getTableSelectData,
        //               param: { code: "apiSelect" },
        //               dataField: "data.apiSelect",
        //               // optionsField: "oneSelectList1",
        //               // valueField: "value",
        //               // labelField: "label",
        //               disabled: row => {
        //                 return row.orderType == 3;
        //               }
        //             }
        //           }
        //         }
        //       ]
        //     },
        //     {
        //       field: "sex",
        //       title: "Sex",
        //       editRender: {},
        //       minWidth: 150,
        //       slots: {
        //         default: ({ columnIndex }) => {
        //           columnIndex;
        //           return [<div>222222</div>];
        //         }
        //       }
        //     },
        //     {
        //       field: "type12",
        //       align: "left",
        //       title: "搜索输入",
        //       minWidth: 150,
        //       itemRender: {
        //         name: "AAutoComplete",
        //         props: {
        //           options: [
        //             "1456",
        //             "12342",
        //             "453213",
        //             "4563464",
        //             "453645",
        //             "1345356",
        //             "745345"
        //           ]
        //         },
        //         on: {
        //           select: (e, option) => {
        //             console.log(e);
        //             console.log(option);
        //           }
        //         }
        //       }
        //     },
        //     {
        //       field: "sex6",
        //       title: "性别插槽",
        //       editRender: {},
        //       minWidth: 150,
        //       slots: {
        //         default: ({ columnIndex }) => {
        //           columnIndex;
        //           return [<div>性别3</div>];
        //         }
        //       }
        //     }
        //   ]
        // },
        // {
        //   field: "sex61",
        //   title: "性别插槽",
        //   editRender: {},
        //   minWidth: 150,
        //   slots: {
        //     default: ({ columnIndex }) => {
        //       columnIndex;
        //       return [<div>性别3</div>];
        //     }
        //   }
        // },
        // {
        //   field: "orderType",
        //   align: "left",
        //   fixed: "left",
        //   title: "下拉框666666",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ASelect",
        //     props: {
        //       dataField: "data.commissioncode",
        //       valueField: "id",
        //       labelField: "text",
        //       labelInValue: true,
        //       searchApi: () => {
        //         return getTableSelectData({ code: "commissioncode" });
        //       }
        //       // api:getTableSelectData,
        //       // param: { code: "commissioncode" },
        //     },
        //     on: {
        //       change: (a, b, c, d) => {
        //         console.log(a, "a");
        //         console.log(b, "b");
        //         console.log(c, "c");
        //         console.log(d, "d");
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "oneSelect",
        //   align: "left",
        //   title: "行1内数据下拉",
        //   minWidth: 200,
        //   fixed: "left",
        //   itemRender: {
        //     name: "ASearchSelect",
        //     props: {
        //       mode: "multiple",
        //       valueField: "id",
        //       labelField: "text",
        //       labelInValue: true,
        //       dataField: "data.oneSelect",
        //       searchApi: () => {
        //         return getTableSelectData({ code: "oneSelect" });
        //       },
        //       // optionsField: "oneSelectList",
        //       // valueField: "value",
        //       // labelField: "label",
        //       default: ({ row }) => {
        //         return [
        //           <span style="background:red;color:#fff">
        //             {row.oneSelectName}
        //           </span>
        //         ];
        //       }
        //     },
        //     on: {
        //       // change: (value, option, { row, rowIndex }) => {
        //       // console.log(row);
        //       // console.log(rowIndex);
        //       // let that = this;
        //       // let data = {};
        //       // for (let i = 0; i < 30; i++) {
        //       //   data["input-" + i] = i + "" + i;
        //       // }
        //       // that.data.splice(rowIndex, 1, {
        //       //   ...row,
        //       //   ...data
        //       // });
        //       // row.oneSelectName = option.label;
        //       // },
        //       keyup: (e, { row }) => {
        //         console.log(e, "页面进入");
        //         if (e.keyCode == 13 && row.oneSelect.length < 2) {
        //           // return false;
        //         }
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "vip",
        //   align: "left",
        //   title: "vip",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ASelect",
        //     props: {
        //       param: { code: "vip" },
        //       dataField: "data.vip"
        //     }
        //   }
        // },
        // {
        //   field: "switch",
        //   align: "left",
        //   title: "开关",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ASwitch",
        //     props: {
        //       hidden: row => {
        //         return row.orderType == 1;
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "time",
        //   title: "时间",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "a-time-picker",
        //     props: {
        //       format: "HH:mm"
        //     },
        //     on: {
        //       change: e => {
        //         console.log(e);
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "switch1",
        //   align: "left",
        //   title: "开关1",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ASwitch",
        //     props: {
        //       disabled: row => {
        //         return row.orderType == 1;
        //       },
        //       trueValue: "1",
        //       falseValue: "0"
        //     }
        //   }
        // },
        // {
        //   field: "checkbox",
        //   align: "left",
        //   title: "选中",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ACheckbox",
        //     props: {
        //       disabled: row => {
        //         return row.orderType == 1;
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "checkbox1",
        //   align: "left",
        //   title: "选中1",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "a-checkbox",
        //     props: {
        //       disabled: row => {
        //         return row.orderType == 1;
        //       },
        //       trueValue: "1",
        //       falseValue: "0"
        //     }
        //   }
        // },
        // {
        //   field: "name",
        //   align: "left",
        //   title: "名称",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "AInput",
        //     props: {
        //       disabled: row => {
        //         return row.orderType == 1;
        //       }
        //     }
        //   }
        // }
        // {
        //   field: "apiSelect1",
        //   align: "left",
        //   title: "请求下拉1",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ASelect",
        //     props: {
        //       optionsField: "oneSelectList1",
        //       valueField: "value",
        //       labelField: "label",
        //       disabled: row => {
        //         return row.orderType == 3;
        //       }
        //     }
        //   }
        // }
        {
          field: "market11",
          align: "left",
          title: "市场11",
          minWidth: 150,
          itemRender: {
            name: "ASelect",
            props: {
              param: { code: "Market" },
              dataField: "data.Market"
            },
            on: {
              change: (e, option, { row }) => {
                row.oneSelectList1 = [];
                // row.oneSelectList1 = [{ label: "广南", value: -1 }];
                console.log(row);
              }
            }
          }
        },
        {
          field: "oneSelect1",
          align: "left",
          title: "行内数据下拉1",
          minWidth: 150,
          fixed: "right",
          itemRender: {
            name: "a-select",
            props: {
              optionsField: "oneSelectList1",
              valueField: "value",
              labelField: "label"
            }
          }
        }
        // {
        //   field: "number1",
        //   align: "right",
        //   title: "数量1",
        //   fixed: "right",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "AInputNumber",
        //     props: {
        //       disabled: row => {
        //         return row.orderType == 2;
        //       },
        //       min: 0
        //     },
        //     after: () => {
        //       return [<a-button style="padding:0 5px;">每日</a-button>];
        //     }
        //   }
        // },
        // {
        //   field: "time1",
        //   align: "left",
        //   title: "时间3333",
        //   minWidth: 150,
        //   fixed: "right",
        //   itemRender: {
        //     name: "a-time-picker",
        //     props: {
        //       format: "HH:mm",
        //       showTime: true,
        //       disabled: row => {
        //         return row.orderType == 3;
        //       }
        //     },
        //     on: {
        //       change: () => {},
        //       blur: (a, b, c, d) => {
        //         console.log(a);
        //         console.log(b);
        //         console.log(c);
        //         console.log(d);
        //       }
        //     }
        //   }
        // }
      ],
      data: data
    };
  },
  created() {
    // let columns = cloneDeep(this.columns);
    // for (let i = 0; i < 1; i++) {
    //   let row = {
    //     field: "input-" + i,
    //     align: "left",
    //     title: "输入框-" + i,
    //     minWidth: 100,
    //     itemRender: {
    //       name: "a-input-number"
    //     }
    //   };
    //   // if (i % 2 == 0) {
    //   //   delete row.itemRender;
    //   // }
    //   columns.unshift(row);
    //   defaultRow["input-" + i] = i;
    // }
    // columns.unshift({
    //   type: "seq",
    //   title: "序",
    //   width: 100
    // });
    this.columns;
  },
  mounted() {
    // let data = [];
    // for (let i = 0; i < 5; i++) {
    //   data.push(cloneDeep(defaultRow));
    // }
    // this.data = data;
  },
  methods: {
    onAdd() {
      let that = this;

      that.data.push({
        type1: "",
        switch: false,
        switch1: "1",
        checkbox: false,
        checkbox1: "1",
        name: "123",
        number: "333",
        orderType: "",
        vip: undefined,
        input: "",
        market: "",
        market11: "",
        apiSelect: "",
        apiSelect1: "",
        date: moment(),
        oneSelect: "",
        oneSelect1: "",
        oneSelectList: [
          { value: 11, label: "广西" },
          { value: 22, label: "广东" }
        ],
        oneSelectList1: [
          { value: 11, label: "广西1" },
          { value: 22, label: "广东1" }
        ],
        time: moment("12:08:23", "HH:mm:ss")
      });
      that.$nextTick(() => {
        setTimeout(() => {
          that.$refs.dataTable.scrollToRow(that.data[that.data.length - 1]);
        }, 0);
      });
      // setTimeout(() => {
      // }, 1000);

      // let tableWrapper = that.$refs.dataTable.$el.querySelector(
      //   ".vxe-table--body-wrapper.body--wrapper"
      // );
      // let tableWrapperH = tableWrapper.offsetHeight;
      // console.log(
      //   that.$refs.dataTable.$el.querySelectorAll(
      //     ".vxe-table--body-wrapper.body--wrapper table tr"
      //   )
      // );
      // setTimeout(() => {
      //   let scrollTop = tableWrapperH;
      //   tableWrapper.scrollTop = scrollTop;
      // }, 3000);
      // console.log();
      // let el = that.$refs.dataTable.$el.querySelector(
      //   "vxe-table--body-wrapper"
      // );
      // console.log(el);
      // that.$refs.dataTable.scrollToRow(that.data[that.data.length - 1]);
    },
    onChange() {},
    onChangeSelect() {
      getTableSelectData({ code: "vip" }, 50).then(res => {
        let data = res.data;
        this.$refs.dataTable.setFieldsOptions({ vip: data.vip });
      });
    },
    setData() {},
    getData() {
      console.log(this.data);
    },
    onActived(e) {
      console.log(e);
      this.$nextTick(() => {
        this.$refs.input.focus();
        console.log(this.$refs.input);
      });
    },
    onChangeColumns() {
      this.columns = [
        {
          field: "orderType1",
          align: "left",
          title: "固定框"
        },
        {
          field: "sex",
          title: "Sex",
          editRender: {},
          slots: {
            default: ({ columnIndex }) => {
              console.log(columnIndex, "编辑index");
              return [<div>3333</div>];
            }
          }
        }
      ];
    },
    onFocusEditRow() {
      this.$refs.dataTable.itemFieldFocus({
        rowIndex: 0,
        field: "type1"
      });
      // this.$refs.dataTable.focusEditRow(0);
    },
    onFocus() {
      console.log("onFocus");
    },
    onBlur() {
      console.log("onBlur");
    }
  }
};
</script>

<style lang="css"></style>
