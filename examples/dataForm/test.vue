<template>
  <div>
    <div style="width:500px">
      <DataForm
        ref="dataForm"
        :items="items"
        :foldingButtonProps="false"
        titleColon
        autoSetDefaultValue
        autoSetDefaultFirst
        autoEnterSelectInput
        autoFocus="name3"
        loadOptionsIdField="id"
        titleWidth="120"
      >
      </DataForm>
      <a-button @click="onSetData">赋值</a-button>
      <a-button @click="onGetData">获取</a-button>
      <a-button @click="onValidateFields">验证</a-button>
      <div>
        <a-input v-model="dateValue" @change="onDateValueChange"></a-input>
        <a-button @click="onFormatDate">格式化</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { formatInputDate } from "../../packages/utils/dateFormat";
moment;
let data = [
  {
    value: "1",
    label: "仓库",
    children: [
      {
        value: "768392799702745088",
        code: "mzxyf",
        label: "门诊西药房",
        text: "门诊西药房",
        data: null
      },
      {
        value: "768392799870517248",
        code: "mzzyf",
        label: "门诊中药房",
        text: "门诊中药房",
        data: null
      },
      {
        value: "768392799870517249",
        code: "zxyf",
        label: "中心药房",
        text: "中心药房",
        data: null
      }
    ]
  },
  {
    value: "0",
    label: "部门",
    children: [
      {
        value: "770127326884139008",
        code: "89632656",
        label: "消毒供应室",
        text: "消毒供应室",
        data: null
      }
    ]
  }
];
console.log(data);
getData;
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
      console.log(json);
      resolve(json);
    }, 500);
  });
}
getSelectGroupData;
function getSelectGroupData() {
  return new Promise(resolve => {
    setTimeout(() => {
      const data1 = [
        {
          Id: 2,
          Text: "男",
          code: "boy"
        },
        {
          Id: 3,
          Text: "女",
          isSelected: true,
          code: "girl"
        },
        {
          Id: 4,
          Text: "未知"
        }
      ];
      resolve({
        data: data1
      });
    }, 500);
  });
}

function getTreeData() {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = [
        {
          value: "zhejiang",
          label: "Zhejiang",
          children: [
            {
              value: "hangzhou",
              label: "Hangzhou",
              children: [
                {
                  value: "xihu",
                  label: "West Lake"
                }
              ]
            }
          ]
        },
        {
          value: "jiangsu",
          label: "Jiangsu",
          children: [
            {
              value: "nanjing",
              label: "Nanjing",
              children: [
                {
                  value: "zhonghuamen",
                  label: "Zhong Hua Men"
                }
              ]
            }
          ]
        }
      ];
      resolve({
        code: 0,
        data: data
      });
    }, 500);
  });
}

console.log(getTreeData);

function getSelectData() {
  return new Promise(resolve => {
    setTimeout(() => {
      let data = [];
      for (let i = 0; i < 50; i++) {
        data.push({
          id: i + 99 + "",
          text: "补全" + i,
          name: "补全" + i,
          value: i + 99 + "",
          code: (i % 2 == 0 ? "双" : "单") + i
        });
      }
      resolve({ data });
    }, 3000);
  });
}
getSelectData;
function getSelectTextData() {
  return new Promise(resolve => {
    setTimeout(() => {
      let data = [];
      for (let i = 0; i < 50; i++) {
        data.push("补全" + i);
      }
      resolve({ data });
    }, 3000);
  });
}
getSelectTextData;

export default {
  components: {
    // test1
  },
  data() {
    return {
      items: [
        {
          field: "dateTime111",
          title: "时间",
          colspan: 2,
          option: {
            rules: [
              {
                required: true,
                message: "请选择时间"
              }
            ]
          },
          itemRender: {
            name: "a-range-picker-split",
            props: {
              format: "YYYY-MM-DD"
            }
          }
        },
        // {
        //   field: "cascader",
        //   title: "级联选择",
        //   itemRender: {
        //     name: "a-cascader",
        //     props: {
        //       api: getTreeData,
        //       valueField: "value",
        //       labelField: "label",
        //       showSearch: {
        //         filter: e => {
        //           console.log(e);
        //           return true;
        //         }
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "input1111",
        //   title: "shur",
        //   itemRender: {}
        // },
        {
          title: "证件类型",
          field: "idType",
          itemRender: {
            name: "a-date-picker",
            props: {}
          }
        }
        // {
        //   field: "input",
        //   title: "输入框"
        // },
        // {
        //   field: "autoComplete",
        //   title: "补全",
        //   itemRender: {
        //     name: "a-auto-complete",
        //     props: {
        //       api: getSelectData,
        //       valueField: "text",
        //       textField: "text"
        //     }
        //   }
        // },
        // {
        //   field: "autoCompleteText",
        //   title: "补全文字",
        //   itemRender: {
        //     name: "a-auto-complete",
        //     props: {
        //       api: getSelectTextData
        //     }
        //   }
        // },
        // {
        //   field: "cascader11",
        //   title: "半选",
        //   itemRender: {
        //     name: "a-cascader-ex",
        //     props: {
        //       api: getTreeData,
        //       valueField: "value",
        //       labelField: "label",
        //       changeOnSelect: true,
        //       showSearch: {
        //         filter: e => {
        //           console.log(e);
        //           return true;
        //         }
        //       }
        //     }
        //   }
        // }
        // {
        //   field: "cascader1666",
        //   title: "全选",
        //   itemRender: {
        //     name: "a-cascader-ex",
        //     props: {
        //       api: getTreeData,
        //       valueField: "value",
        //       labelField: "label",
        //       showSearch: {
        //         filter: e => {
        //           console.log(e);
        //           return true;
        //         }
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "input",
        //   title: "shur",
        //   itemRender: {}
        // },
        // {
        //   title: "年份",
        //   field: "year",
        //   itemRender: {
        //     name: "a-date-picker",
        //     // YearPicker
        //     // name: "a-date-picker",
        //     props: {
        //       mode: "year",
        //       format: "YYYY"
        //     }
        //   }
        // },
        // {
        //   title: "月份",
        //   field: "month",
        //   itemRender: {
        //     name: "a-date-picker",
        //     // YearPicker
        //     // name: "a-date-picker",
        //     props: {
        //       mode: "month",
        //       format: "MM"
        //     }
        //   }
        // },
        // {
        //   title: "日期111111111",
        //   field: "date",
        //   itemRender: {
        //     name: "a-date-picker",
        //     // YearPicker
        //     // name: "a-date-picker",
        //     props: {
        //       format: "YYYY-MM-DD",
        //       // inputFormat: "YYYY-MM-DD",
        //       showTime: true
        //       // formatInputReplace: e => {
        //       //   let value = e.target.value;
        //       //   let newValue = e.target.value.replace(/.?\((.*)\)/, "");
        //       //   if (value == newValue) {
        //       //     return false;
        //       //   } else {
        //       //     return newValue;
        //       //   }
        //       // },
        //       // formatInputBefore: ({ e, updateValue }) => {
        //       //   const { value } = e.target;
        //       //   if (value.length > 18) {
        //       //     let newValue = value.substring(0, 19);
        //       //     updateValue(moment(newValue));
        //       //     return false;
        //       //   }
        //       // }
        //     }
        //   }
        // }
        // {
        //   title: "时间",
        //   field: "dateTime",
        //   itemRender: {
        //     name: "a-date-picker",
        //     // YearPicker
        //     // name: "a-date-picker",
        //     props: {
        //       showTime: true,
        //       format: "YYYY-MM-DD HH:mm"
        //     }
        //   }
        // },
        // {
        //   title: "数字",
        //   field: "number",
        //   option: {
        //     initialValue: "0"
        //   },
        //   itemRender: {
        //     name: "a-input-number",
        //     props: {
        //       formatter: value => {
        //         return value + "%";
        //       }
        //     },
        //     on: {
        //       change: e => {
        //         console.log(e);
        //       },
        //       blur: e => {
        //         console.log("blur", e);
        //       }
        //     }
        //   }
        // },
        // {
        //   title: "数字",
        //   field: "a-textarea",
        //   option: {
        //     initialValue: "0"
        //   },
        //   itemRender: {
        //     name: "a-textarea",
        //     props: {
        //       formatter: value => {
        //         return value + "%";
        //       }
        //     },
        //     on: {
        //       change: e => {
        //         console.log(e);
        //       },
        //       blur: e => {
        //         console.log("blur", e);
        //       }
        //     }
        //   }
        // },
        // {
        //   title: "数字",
        //   field: "a-textarea1",
        //   option: {
        //     initialValue: "0"
        //   },
        //   itemRender: {
        //     name: "a-textarea",
        //     props: {
        //       formatter: value => {
        //         return value + "%";
        //       }
        //     },
        //     on: {
        //       change: e => {
        //         console.log(e);
        //       },
        //       blur: e => {
        //         console.log("blur", e);
        //       }
        //     }
        //   }
        // }
        // {
        //   field: "pulldown",
        //   title: "下拉面板",
        //   option: {
        //     initialValue: "桂林"
        //   },
        //   itemRender: {
        //     name: "pulldown-table",
        //     props: {
        //       valueField: "name",
        //       textField: "age",
        //       otherSlot: () => {
        //         return <div style="width:200px;float:left;">123</div>;
        //       },
        //       table: {
        //         props: {
        //           columns: [
        //             { type: "checkbox", width: 50 },
        //             { type: "seq", title: "Number", width: 80 },
        //             {
        //               field: "name",
        //               title: "Name",
        //               width: 200
        //             },
        //             {
        //               field: "sex",
        //               title: "Sex",
        //               width: 200
        //             },
        //             {
        //               field: "age",
        //               title: "Age",
        //               width: 200
        //             }
        //           ],
        //           size: "mini",
        //           height: 300,
        //           proxyConfig: {
        //             autoLoad: false,
        //             ajax: {
        //               query: getData
        //             }
        //           }
        //         }
        //       }
        //     },
        //     on: {
        //       change(val, sel) {
        //         console.log("change", val, sel);
        //       },
        //       inputChange(sel) {
        //         console.log("inputChange", sel);
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "ordinary1",
        //   title: "请求下拉123",
        //   itemRender: {
        //     name: "a-select",
        //     props: {}
        //   }
        // },
        // {
        //   field: "ordinary12",
        //   title: "请求下拉123",
        //   itemRender: {
        //     name: "a-select",
        //     props: {}
        //   }
        // },
        // {
        //   field: "ordinary13",
        //   title: "请求下拉123",
        //   itemRender: {
        //     name: "a-select",
        //     props: {
        //       defaultField: "isSelected",
        //       valueField: "Id",
        //       labelField: "Text",
        //       api: getSelectGroupData
        //     }
        //   }
        // }
        //   {
        //     field: "pulldown1",
        //     title: "下拉面板1",
        //     option: {
        //       initialValue: "桂林1"
        //     },
        //     itemRender: {
        //       name: "pulldown-table",
        //       props: {
        //         valueField: "name",
        //         textField: "age",
        //         table: {
        //           props: {
        //             columns: [
        //               { type: "checkbox", width: 50 },
        //               { type: "seq", title: "Number", width: 80 },
        //               {
        //                 field: "name",
        //                 title: "Name",
        //                 width: 200
        //               },
        //               {
        //                 field: "sex",
        //                 title: "Sex",
        //                 width: 200
        //               },
        //               {
        //                 field: "age",
        //                 title: "Age",
        //                 width: 200
        //               }
        //             ],
        //             size: "mini",
        //             height: 300,
        //             proxyConfig: {
        //               autoLoad: false,
        //               ajax: {
        //                 query: getData
        //               }
        //             }
        //           }
        //         }
        //       },
        //       on: {
        //         change(val, sel) {
        //           console.log("change", val, sel);
        //         },
        //         inputChange(sel) {
        //           console.log("inputChange", sel);
        //         }
        //       }
        //     }
        //   },
        //   // {
        //   //   title: "出库去向",
        //   //   field: "trackId",
        //   //   itemRender: {
        //   //     name: "a-cascader",
        //   //     props: {
        //   //       placeholder: "请选择",
        //   //       options: data,
        //   //       labelField: "label",
        //   //       valueField: "value",
        //   //       fieldNames: {
        //   //         label: "label",
        //   //         value: "value",
        //   //         children: "children"
        //   //       }
        //   //     },
        //   //     on: {
        //   //       change: this.onChangeTrackId
        //   //     }
        //   //   }
        //   // },
        //   {
        //     title: "输入框1",
        //     field: "input1"
        //   },

        //   {
        //     title: "输入框2",
        //     field: "input2"
        //   }
        // ]
        // // selectGroupOptions: [
        // //   {
        // //     id: 1,
        // //     text: "男",
        // //     code: "boy",
        // //     children: [
        // //       { id: 11, text: "0-10岁", code: "b10" },
        // //       { id: 12, text: "11-20岁", code: "b20" },
        // //       { id: 13, text: "21-30岁", code: "b30" },
        // //       { id: 14, text: "辣鸡", code: "b40" },
        // //       { id: 15, text: "草割肉", code: "cgr" },
        // //       { id: 16, text: "牛扒", code: "np" }
        // //     ]
        // //   },
        // //   {
        // //     id: 2,
        // //     text: "女",
        // //     code: "girl",
        // //     children: [
        // //       { id: 21, text: "0-10岁", code: "g10" },
        // //       { id: 22, text: "11-20岁", code: "g20" },
        // //       { id: 23, text: "21-30岁", code: "g30" }
        // //     ]
        // //   },
        // //   {
        // //     id: 3,
        // //     text: "未知",
        // //     children: [
        // //       { id: 31, text: "0-10岁", code: "g10" },
        // //       { id: 32, text: "11-20岁", code: "g20" },
        // //       { id: 33, text: "21-30岁", code: "g30" }
        // //     ]
        // //   }
      ],
      dateValue: ""
    };
  },
  mounted() {
    // this.updateDate();
    // let that = this;
    // setTimeout(() => {
    //   let index = this.items.findIndex(p => p.field == "date");
    //   let row = that.items[index];
    //   row.itemRender.props.format = "YYYY-MM";
    //   that.items.splice(index, 1, row);
    // }, 3000);
    // let that = this;
    // setTimeout(() => {
    //   that.$refs.dataForm.setFieldFocus("pulldown");
    // }, 1000);
  },
  methods: {
    onChange(e) {
      console.log(e);
    },
    onpanelChange(e) {
      console.log(e.format("YYYY"));
    },
    onChangeTrackId(a, b, c, d) {
      console.log(a);
      console.log(b);
      console.log(c);
      console.log(d);
    },
    onSetData() {
      debugger;
      this.$refs.dataForm.setData({
        pulldown: "6666下拉"
      });
    },
    onGetData() {
      console.log(this.$refs.dataForm.getData());
    },
    onValidateFields() {
      this.$refs.dataForm.validateFields().then(res => {
        console.log(res);
      });
    },
    onFormatDate() {
      // const res = dateFormat("20220726083056", "YYYY-MM-DD HH:mm:ss");
    },
    onDateValueChange(e) {
      const { value } = e.target;
      const res = formatInputDate(value, "YYYY-MM-DD HH:mm:ss");
      console.log(res);
    }
  }
};
</script>
