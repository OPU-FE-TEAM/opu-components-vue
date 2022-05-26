<template>
  <div>
    <vxe-grid ref="xGrid" v-bind="gridOptions"> </vxe-grid>
    <a-date-picker />
    <a-button @click="onAdd">新增</a-button>
    <a-button @click="onChange">改变</a-button>
    <a-button @click="getData">获取数据</a-button>
    <a-button @click="updateDate">赋值</a-button>
    <a-button @click="onChangeColumns">改变表格列</a-button>
    <!-- <p>{{ data }}</p> -->
  </div>
</template>

<script>
import moment from "moment";

let step = 0;
const updateDate = () => {
  let data = [];
  for (let i = 0; i < 90; i++) {
    let row = {};
    for (let j = 0; j < 30; j++) {
      row["name" + j] = i + "_" + step;
    }
    data.push(row);
  }
  step++;
  return data;
};

// function getData() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       let arr = [];
//       for (let i = 0; i < 10; i++) {
//         arr.push({
//           label: i + " " + i,
//           value: i,
//           id: i + 1,
//           text: i + 1 + "-" + i + 1
//         });
//       }
//       resolve(arr);
//     }, 5000);
//   });
// }

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
    return {
      gridOptions: {
        columns: [
          {
            field: "sex6",
            title: "性别插槽",
            editRender: {},
            slots: {
              default: ({ columnIndex }) => {
                console.log(columnIndex, "编辑index");
                return [<div>性别3</div>];
              }
            }
          },
          {
            field: "sex",
            title: "Sex",
            editRender: {},
            slots: {
              default: ({ columnIndex }) => {
                console.log(columnIndex, "编辑index");
                return [<div>222222</div>];
              }
            }
          }
        ],
        data: [{ sex: 1111, sex6: 6566666 }]
      },
      longColumns,
      columns: [
        // {
        //   field: "type1",
        //   align: "left",
        //   title: "搜索输入",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "AAutoComplete",
        //     props: {
        //       labelField: "label",
        //       valueField: "value",
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
        //         debugger;
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "type1",
        //   align: "left",
        //   title: "搜索输入",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "AAutoComplete",
        //     props: {
        //       options: [
        //         "1456",
        //         "12342",
        //         "453213",
        //         "4563464",
        //         "453645",
        //         "1345356",
        //         "745345"
        //       ]
        //     },
        //     on: {
        //       select: (e, option) => {
        //         console.log(e);
        //         console.log(option);
        //         debugger;
        //       }
        //     }
        //   }
        // },
        {
          field: "orderType",
          align: "left",
          title: "下拉框",
          minWidth: 150,
          itemRender: {
            name: "ASelect",
            props: {
              options: [
                { value: "1", label: "省份" },
                { value: "2", label: "城市" },
                { value: "3", label: "区域" }
              ]
            },
            on: {
              change: (value, row, pRow) => {
                console.log(value);
                console.log(row);
                console.log(pRow);
              }
            }
          }
        },
        {
          field: "switch",
          align: "left",
          title: "开关",
          minWidth: 150,
          itemRender: {
            name: "ASwitch",
            props: {
              hidden: row => {
                return row.orderType == 1;
              }
            }
          }
        }
        // {
        //   field: "date",
        //   title: "日期",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ADatePicker",
        //     props: {
        //       format: "YYYY-MM-DD",
        //       // format: "YYYY-MM-DD HH:mm:ss",
        //       // showTime: true,
        //       disabled: row => {
        //         return [row.date.format("YYYY-MM-DD")];
        //       }
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
        // },
        // {
        //   field: "number",
        //   align: "left",
        //   title: "数量",
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
        //   field: "apiSelect",
        //   align: "left",
        //   title: "请求下拉",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ASelect",
        //     props: {
        //       api: getData,
        //       valueField: "id",
        //       labelField: "text",
        //       disabled: row => {
        //         return row.orderType == 3;
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "apiSelect1",
        //   align: "left",
        //   title: "请求下拉",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ASelect",
        //     props: {
        //       api: getData,
        //       disabled: row => {
        //         return row.orderType == 3;
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "oneSelect",
        //   align: "left",
        //   title: "行内数据下拉",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ASelect",
        //     props: {
        //       optionsField: "oneSelectList",
        //       valueField: "id",
        //       labelField: "text"
        //     }
        //   }
        // },
        // {
        //   field: "oneSelect1",
        //   align: "left",
        //   title: "行内数据下拉1",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ASelect",
        //     props: {
        //       optionsField: "oneSelectList1",
        //       valueField: "id",
        //       labelField: "text"
        //     }
        //   }
        // },
        // {
        //   field: "time",
        //   align: "left",
        //   title: "时间",
        //   minWidth: 150,
        //   itemRender: {
        //     name: "ATimePicker",
        //     props: {
        //       format: "HH:mm",
        //       showTime: true,
        //       disabled: row => {
        //         return row.orderType == 3;
        //       }
        //     },
        //     on: {
        //       change: () => {
        //         debugger;
        //       }
        //     }
        //   }
        // }
      ],
      data: [
        {
          type1: "",
          switch: false,
          switch1: "1",
          checkbox: false,
          checkbox1: "1",
          name: "123",
          number: "333",
          orderType: "",
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
        }
      ]
    };
  },
  created() {
    // this.updateDate();
  },
  methods: {
    onAdd() {
      this.data.push({
        switch: false,
        switch1: "0",
        checkbox: true,
        checkbox1: "0",
        name: "123",
        number: "333",
        orderType: "",
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
    },
    onChange() {},
    setData() {},
    getData() {
      console.log(
        this.data.map(p => {
          return {
            time: p.time.format("HH:mm")
          };
        })
      );
    },
    updateDate() {
      let data = updateDate();
      console.log("生成data完成" + moment().format("HH:mm:ss"));
      setTimeout(() => {
        console.log("开始赋值" + moment().format("HH:mm:ss"));
        this.data = data;
        this.$nextTick(() => {
          console.log("赋值完成", moment().format("HH:mm:ss"));
        });
      }, 3000);
    },
    onActived(e) {
      console.log(e);
      this.$nextTick(() => {
        this.$refs.input.focus();
        console.log(this.$refs.input);
      });
    },
    onChangeColumns() {
      this.gridOptions.columns = [
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
    }
  }
};
</script>

<style lang="css"></style>
