<template>
  <div>
    <DataForm
      ref="dataForm"
      layout="inline"
      :colspan="colspan"
      :readonly="readonly"
      :items="items"
      :onOptionsAllLoad="onOptionsAllLoad"
      :onOptionsLoadBefore="onOptionsLoadBefore"
      @buttonActionClick="onButtonClick"
      @submit="onSubmit"
      :foldingButtonProps="false"
      autoSetDefaultValue
      autoSetDefaultFirst
      :loading="loading"
      autoFocus="name3"
      loadOptionsIdField="id"
      titleWidth="auto"
    >
      <template slot="itemSlot" slot-scope="text, updateValue, field">
        全插槽内容:{{ text }}{{ field }}
        <a @click="updateValue('77777')">改变值</a>
      </template>
      <template slot="inputSlot" slot-scope="text, updateValue, field">
        {{ text }}{{ field }}
        <a @click="updateValue('77777')">改变值</a>
      </template>
      <template slot="addSlot" slot-scope="text">
        {{ text }}
        22222
      </template>
    </DataForm>
    <button @click="getData">提交</button>
    <button @click="validateFields">校验并获取值</button>
    <button @click="setItems">动态增加表单项</button>
    <button @click="setReadonly">切换只读</button>
    <button @click="setImageUploadData">设置图片上传默认数据</button>
    <button @click="setSelectData">更新select可选值</button>
    <button @click="setFieldsOptionsDefaultValues">
      设置表单下拉数据默认值
    </button>
    <button @click="setFormData">
      设置表单值
    </button>
    <button @click="setExpand">
      展开/收起
    </button>
    <button @click="setColspan">
      设置列数
    </button>
    <modelTable ref="modelTable" />
    <button @click="showModelTable">
      显示弹窗表格
    </button>
    <button @click="loadOptionsData">
      手动获取下拉数据
    </button>
    <button @click="getFieldsOptions">
      获取下拉数据
    </button>
  </div>
</template>

<script>
// import { DataForm } from "../../index";
// console.log(DataForm);
// import moment from "moment";
import modelTable from "../other/modelTable";
import { utils } from "../../index";
import moment from "moment";
moment();
// function getSelectData() {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             const data = Array.from({ length: 10 }, (_, key) => ({
//                 id:key,
//                 name:`name${key}`
//                 }));
//                 data[3].isSelected = true
//             resolve(data);
//         }, 500);
//     });
// }
function getData(arr) {
  if (arr) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(arr);
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
            data: [...list],
            total: 100
          }
        };
        console.log(json);
        resolve(json);
      }, 500);
    });
  }
}
getData();

function idTypeFunction() {
  let arr = [];
  for (let i = 0; i < parseFloat(Math.random() * 10) + 1; i++) {
    arr.push(i.toString());
  }
  return {
    data: arr
  };
}
idTypeFunction();

function getCheckboxData(values) {
  console.log("get:", values);
  return new Promise(resolve => {
    setTimeout(() => {
      const data = Array.from({ length: 5 }, (_, key) => ({
        id: key,
        name: `check${key}`
      }));
      data[3].isSelected = true;
      data[2].isSelected = true;
      resolve(data);
    }, 500);
  });
}
getCheckboxData;

function getSelectGroupData() {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = [
        {
          id: 1,
          text: "男",
          code: "boy",
          children: [
            { id: 11, text: "0-10岁", code: "b10" },
            { id: 12, text: "11-20岁", code: "b20" },
            { id: 13, text: "21-30岁", code: "b30" }
          ]
        },
        {
          id: 2,
          text: "女",
          isSelected: true,
          code: "girl",
          children: [
            { id: 21, text: "0-10岁", code: "g10" },
            { id: 22, text: "11-20岁", code: "g20" },
            { id: 23, text: "21-30岁", code: "g30" }
          ]
        },
        {
          id: 3,
          text: "未知"
        }
      ];
      resolve({
        data: data
      });
    }, 500);
  });
}
getSelectGroupData();

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
getTreeData();

export default {
  components: {
    // DataForm
    modelTable
    // SelectGroup: DataForm.selectGroup
  },
  data() {
    // const that = this;
    return {
      key: 1,
      readonly: false,
      loading: false,
      expand: false,
      colspan: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 4,
        xxl: 4
      },
      selectGroupOptions: [
        {
          id: 1,
          text: "男",
          code: "boy",
          children: [
            { id: 11, text: "0-10岁", code: "b10" },
            { id: 12, text: "11-20岁", code: "b20" },
            { id: 13, text: "21-30岁", code: "b30" },
            { id: 14, text: "辣鸡", code: "b40" },
            { id: 15, text: "草割肉", code: "cgr" },
            { id: 16, text: "牛扒", code: "cgr" }
          ]
        },
        {
          id: 2,
          text: "女",
          isSelected: true,
          code: "girl",
          children: [
            { id: 21, text: "0-10岁", code: "g10" },
            { id: 22, text: "11-20岁", code: "g20" },
            { id: 23, text: "21-30岁", code: "g30" }
          ]
        },
        {
          id: 3,
          text: "未知"
        }
      ],
      items: [
        // {
        //   field: "id",
        //   itemRender: {
        //     name: "hidden"
        //   }
        // },
        // {
        //   field: "sexName",
        //   itemRender: {
        //     name: "hidden"
        //   }
        // },
        // {
        //   field: "number",
        //   title: "数字",
        //   option: {
        //     rules: [{ required: true, message: "请输入代码!" }]
        //   },
        //   // width: "200px",
        //   itemRender: {
        //     name: "a-input-number",
        //     extend: val => {
        //       return <p>{val}</p>;
        //     }
        //   }
        // },
        {
          title: "证件类型",
          field: "idType111",
          itemRender: {
            name: "a-auto-complete",
            props: {
              // options: ["1", "2", "3"],
              api: idTypeFunction,
              param: { value: "idType" },
              dataField: "data",
              slots: {
                dataSource: e => {
                  console.log(e);
                  return e.map(p => {
                    return <a-select-option key={p}>{p}</a-select-option>;
                  });
                }
              }
            },
            scopedSlots: {
              dataSource: e => {
                return [
                  <span>
                    {e}-{e}
                  </span>
                ];
              }
            }
          },
          slots: {
            dataSource: e => {
              return [<span>{e}</span>];
            }
          }
        },
        // {
        //   field: "treeSelect",
        //   title: "树下啦",
        //   itemRender: {
        //     name: "a-tree-select",
        //     style: { width: "130px" },
        //     props: {
        //       showSearch: true,
        //       replaceFields: {
        //         children: "projectCategoryList",
        //         title: "name",
        //         key: "id",
        //         value: "id"
        //       },
        //       searchFields: ["simpleCode"],
        //       treeData: [
        //         {
        //           id: "874199840383303680",
        //           name: "卤味",
        //           isDeleted: false,
        //           simpleCode: "LW,HK",
        //           projectCategoryList: [
        //             {
        //               id: "874199879860092928",
        //               name: "肉类",
        //               isDeleted: false,
        //               simpleCode: "RL,MO",
        //               projectCategoryList: []
        //             },
        //             {
        //               id: "878177788215951360",
        //               name: "蔬菜",
        //               isDeleted: false,
        //               simpleCode: "SC,AA",
        //               projectCategoryList: []
        //             }
        //           ]
        //         },
        //         {
        //           id: "874205575305494528",
        //           name: "地方小炒",
        //           isDeleted: false,
        //           simpleCode: "DFXC,FYIO",
        //           projectCategoryList: [
        //             {
        //               id: "874205640732442624",
        //               name: "桂林",
        //               isDeleted: false,
        //               simpleCode: "GL,SS",
        //               projectCategoryList: []
        //             }
        //           ]
        //         },
        //         {
        //           id: "877722722224832512",
        //           name: "套餐类",
        //           isDeleted: false,
        //           simpleCode: "TCL,DHO",
        //           projectCategoryList: [
        //             {
        //               id: "877722834753814528",
        //               name: "地方小炒套餐",
        //               isDeleted: false,
        //               simpleCode: "DFXCTC,FYIODH",
        //               projectCategoryList: []
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   }
        // },
        // {
        //   field: "name11",
        //   title: "姓名1",
        //   itemRender: {
        //     name: "a-input",
        //     style: { width: "130px" },
        //     after: () => {
        //       return ["多少元"];
        //     },
        //     before: () => {
        //       return ["满"];
        //     }
        //   }
        // },
        // {
        //   field: "name22",
        //   title: "姓名2",
        //   itemRender: {
        //     name: "a-input"
        //   }
        // },
        // {
        //   field: "endTime",
        //   title: "时间",
        //   itemRender: {
        //     name: "a-time-picker",
        //     props: {
        //       format: "HH:mm"
        //     }
        //   }
        // },
        // // {
        // //   field: "sexName",
        // //   itemRender: {
        // //     name: "hidden"
        // //   }
        // // },
        // {
        //   field: "pulldown",
        //   title: "下拉面板",
        //   option: {
        //     // initialValue: "桂林"
        //   },
        //   itemRender: {
        //     name: "pulldown-table",
        //     props: {
        //       valueField: "name",
        //       textField: "sex",
        //       // allowInputValue: true,
        //       table: {
        //         props: {
        //           columns: [
        //             // { type: "checkbox", width: 50 },
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
        //           highlightHoverRow: true,
        //           highlightCurrentRow: true,
        //           proxyConfig: {
        //             autoLoad: false,
        //             ajax: {
        //               query: getData
        //             }
        //           }
        //         }
        //       }
        //       // inputProps: {
        //       // allowClear: true
        //       // size: "small"
        //       // disabled: true
        //       // }
        //     },
        //     on: {
        //       change(val, sel) {
        //         console.log("change", val, sel);
        //       },
        //       inputChange(sel) {
        //         console.log("inputChange", sel);
        //       }
        //       // showPanel(e) {
        //       //   if (e.target.value) {
        //       //     e.target.select();
        //       //   }
        //       // }
        //       // "hide-panel"() {
        //       //   debugger;
        //       // }
        //     }
        //   }
        // },
        // {
        //   field: "isDelete",
        //   title: "包含取消",
        //   tooltip: "是否包含已取消的订单",
        //   titleWidth: "85px",
        //   option: {
        //     initialValue: true
        //   },
        //   itemRender: {
        //     name: "a-switch",
        //     props: {
        //       trueValue: true,
        //       falseValue: false
        //     }
        //   }
        // },
        // {
        //   field: "name",
        //   title: "名称",
        //   extra: "aaa",
        //   option: { initialValue: "555666" },
        //   actions: [
        //     {
        //       button: {
        //         props: {
        //           icon: "plus"
        //         },
        //         on: {
        //           click: () => {
        //             console.log("plus click");
        //           }
        //         }
        //       },
        //       modal: {
        //         props: {
        //           title: "窗口"
        //         },
        //         content: () => {
        //           return 666;
        //         },
        //         form: {
        //           props: {
        //             items: [
        //               {
        //                 title: "姓名",
        //                 field: "name"
        //               },
        //               {
        //                 title: "年龄",
        //                 field: "age"
        //               },
        //               {
        //                 title: "插槽",
        //                 itemRender: {
        //                   slot: "addSlot"
        //                 }
        //               }
        //             ]
        //           },
        //           on: {
        //             submit: values => {
        //               console.log(values);
        //             }
        //           }
        //         }
        //       }
        //     }
        //   ],
        //   itemRender: {
        //     name: "a-input",

        //     props: {
        //       placeholder: "请输入名称"
        //       // disabled:true
        //     },
        //     on: {
        //       // change:(val)=>{
        //       //     const form=this.$refs.dataForm.getData();
        //       //     console.log(val,form);
        //       // }
        //     }
        //   }
        // },
        // // {
        // //   field: "price",
        // //   title: "金额",
        // //   itemRender: {
        // //     name: "a-input-number-split"
        // //   }
        // // },
        {
          field: "cprice",
          title: "时间",
          itemRender: {
            name: "a-range-picker-split",
            on: {
              startChange: () => {
                debugger;
              }
            }
          }
        },
        // // {
        // //   field: "name1",
        // //   title: "名称2",
        // //   option: { initialValue: 333 },
        // //   itemRender: {
        // //     name: "a-input",
        // //     props: {
        // //       placeholder: "请输入名称"
        // //     }
        // //   }
        // // },
        // // {
        // //   field: "name3",
        // //   title: "名称3",
        // //   class: "abcd"
        // // },
        // // {
        // //   field: "name66",
        // //   title: "名称66",
        // //   colspan: {
        // //     xs: 1,
        // //     sm: 2,
        // //     md: 3,
        // //     lg: 4,
        // //     xl: 5,
        // //     xxl: 6
        // //   },
        // //   itemRender: {
        // //     name: "a-textarea",
        // //     on: {
        // //       enter: () => {
        // //         return false;
        // //       }
        // //     }
        // //   }
        // // },
        // // {
        // //   field: "name4",
        // //   title: "名称4",
        // //   itemRender: {}
        // // },
        // // {
        // //   field: "mytitle",
        // //   title: () => {
        // //     return "自定义标题6";
        // //   },
        // //   titleWidth: "150px",
        // //   itemRender: {
        // //     name: "a-input",
        // //     before: () => {
        // //       return 555;
        // //     },
        // //     after: () => {
        // //       return 666;
        // //     }
        // //   }
        // // },
        // {
        //   field: "sex",
        //   title: "性别22",
        //   tooltip: "一个友好的提示",
        //   // hasFeedback: true,
        //   // option: {
        //   //   rules: [{ required: true, message: "请输入名称!" }]
        //   // },

        //   itemRender: {
        //     name: "a-select",
        //     props: {
        //       size: "small",
        //       // mode: "combobox",
        //       placeholder: "请选择性别",
        //       // showSearch: true,

        //       defaultField: "isSelected",
        //       valueField: "id",
        //       labelField: "text",
        //       linkage: { name22: "code" },
        //       // dataField: "aa",
        //       // labelInValue: true,
        //       // api:getSelectData,
        //       // param: {
        //       //   code: "aa"
        //       // }
        //       renderOptionLabel: item => {
        //         return <div>aaaa {item.label}</div>;
        //       },
        //       options: [
        //         {
        //           id: 1,
        //           text: "男",
        //           isSelected: true,
        //           code: 1245
        //         },
        //         {
        //           id: 2,
        //           text: "女",
        //           isSelected: true
        //         }
        //       ]
        //     },
        //     on: {
        //       change(val, row) {
        //         console.log(val, row);
        //         that.$refs.dataForm.setData({
        //           sexName: row.label
        //         });
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "selected",
        //   title: "下拉框-全局接口获取",
        //   itemRender: {
        //     name: "a-select",
        //     props: {
        //       // autoLoadOptionsId: false,
        //       valueField: "id",
        //       labelField: "name",
        //       mode: "multiple",
        //       dataField: "bb",
        //       param: {
        //         code: "bb"
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "selected3",
        //   title: "下拉框-全局接口获取3",
        //   actions: [
        //     {
        //       button: {
        //         props: {
        //           icon: "reload"
        //         },
        //         on: {
        //           click: () => {
        //             that.$refs.dataForm.loadItemOptionsData("selected3");
        //           }
        //         }
        //       }
        //     }
        //   ],
        //   itemRender: {
        //     name: "a-select",
        //     props: {
        //       // autoLoadOptionsId: false,
        //       valueField: "id",
        //       labelField: "name",
        //       mode: "multiple",
        //       dataField: "cc",
        //       param: {
        //         code: "cc"
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "selectGroup",
        //   title: "分组下拉",
        //   itemRender: {
        //     name: "a-select-group",
        //     props: {
        //       valueField: "id",
        //       labelField: "text",
        //       childrenField: "children",
        //       api: getSelectGroupData,
        //       dataField: "data"
        //     },
        //     on: {
        //       change(val, row, pRow) {
        //         console.log(val, row, pRow);
        //         that.$refs.dataForm.setData({
        //           sexName: row.label
        //         });
        //       }
        //     }
        //   }
        // },
        // // {
        // //   field: "password",
        // //   title: "密码框",
        // //   help: "请输入登录密码",
        // //   itemRender: {
        // //     name: "a-input-password"
        // //   }
        // // },
        // // {
        // //   field: "textarea",
        // //   title: "文本域",
        // //   // colspan:2,
        // //   itemRender: {
        // //     name: "a-textarea"
        // //   }
        // // },

        // // {
        // //   field: "checkbox",
        // //   title: "复选框",
        // //   width: "200px",
        // //   option: { valuePropName: "checked", initialValue: "on" },
        // //   itemRender: {
        // //     name: "a-checkbox",
        // //     props: {
        // //       trueValue: "on",
        // //       falseValue: "off"
        // //     }
        // //   }
        // // },
        // {
        //   field: "checkboxGroup",
        //   title: "复选框组",
        //   itemRender: {
        //     name: "a-checkbox-group",
        //     props: {
        //       api: getCheckboxData,
        //       valueField: "id",
        //       labelField: "name",
        //       dataField: "",
        //       defaultField: "isSelected",
        //       param: {
        //         code: "dda"
        //       }
        //       // options: [
        //       //   { label: "Apple", value: "Apple" },
        //       //   { label: "Pear", value: "Pear" },
        //       //   { label: "Orange", value: "Orange" }
        //       // ]
        //     }
        //   }
        // },
        // {
        //   field: "radioGroup",
        //   title: "单选框组",
        //   itemRender: {
        //     name: "a-radio-group",
        //     props: {
        //       api: getCheckboxData,
        //       dataField: "",
        //       defaultField: "isSelected",
        //       param: {
        //         code: "cc"
        //       }
        //       // options: ["Apple", "Pear", "Orange"]
        //       // options: [
        //       //   { id: "Apple", name: "Apple" },
        //       //   { id: "Pear", name: "Pear" },
        //       //   { id: "Orange", name: "Orange" }
        //       // ]
        //     },
        //     on: {
        //       change: this.onRadioChange
        //     }
        //   }
        // },
        // // {
        // //   field: "number",
        // //   title: "数字",
        // //   // width: "200px",
        // //   itemRender: {
        // //     name: "a-input-number"
        // //   }
        // // },
        // // {
        // //   field: "date",
        // //   title: "日期选择",
        // //   itemRender: {
        // //     name: "a-date-picker",
        // //     props: {
        // //       // min: moment(),
        // //       // max: moment().add(10, "day")
        // //       // showTime: true,
        // //       // format: "YYYY-MM-DD HH:mm:ss"
        // //       // api: getCheckboxData
        // //     }
        // //   }
        // // },
        // // {
        // //   field: "time",
        // //   title: "时间",
        // //   itemRender: {
        // //     name: "a-time-picker"
        // //   }
        // // },
        // // {
        // //   field: "number2",
        // //   title: "数字2",
        // //   folding: true,
        // //   // width: "200px",
        // //   itemRender: {
        // //     name: "a-input-number"
        // //   }
        // // },
        // // {
        // //   field: "month",
        // //   title: "月份选择",
        // //   itemRender: {
        // //     name: "a-month-picker"
        // //   }
        // // },
        // // {
        // //   field: "weekPicker",
        // //   title: "星期选择",
        // //   itemRender: {
        // //     name: "a-week-picker"
        // //   }
        // // },
        // // {
        // //   field: "rangePicker",
        // //   title: "日期范围选择",
        // //   itemRender: {
        // //     name: "a-range-picker",
        // //     props: {
        // //       showTime: { format: "HH:mm" }
        // //     }
        // //   }
        // // },
        {
          field: "ARangePickerSplit",
          title: "日期范围拆分",
          itemRender: {
            name: "a-range-picker-split",
            props: {
              // hasLimit: true,
              // separator: () => {
              //   return <div style="color:red;width:70px">结束日期：</div>;
              // },
              // min: moment(),
              // max: moment().add(5, "day"),
              endDisabledDate: () => {
                console.log("第二个时间");
                return true;
              },
              startDisabled: true
              // showTime: { format: "HH:mm" }
            }
          }
        }
        // {
        //   field: "checkInDate",
        //   title: "入住日期",
        //   itemRender: {
        //     name: "a-date-picker",
        //     props: {
        //       format: "YYYY-MM-DD",
        //       allowClear: false,
        //       showToday: false,
        //       disabledDate: () => {
        //         console.log("开启成功");
        //         return true;
        //       }
        //     }
        //   }
        // }

        // // {
        // //   field: "number3",
        // //   title: "数字3",
        // //   folding: true,
        // //   // width: "200px",
        // //   itemRender: {
        // //     name: "a-input-number"
        // //   }
        // // },
        // // {
        // //   field: "switch",
        // //   title: "开关",
        // //   option: { valuePropName: "checked" },
        // //   folding: true,
        // //   itemRender: {
        // //     name: "a-switch",
        // //     props: {
        // //       // size: "small"
        // //       trueValue: 1,
        // //       falseValue: 0
        // //     }
        // //   }
        // // },
        // // {
        // //   field: "rate",
        // //   title: "评分",
        // //   itemRender: {
        // //     name: "a-rate"
        // //   }
        // // },
        // // {
        // //   field: "slider",
        // //   title: "滑动输入",
        // //   option: { initialValue: [20, 50] },
        // //   itemRender: {
        // //     name: "a-slider",
        // //     props: {
        // //       range: true
        // //     }
        // //   }
        // // },
        // {
        //   field: "cascader",
        //   title: "级联选择",
        //   itemRender: {
        //     name: "a-cascader",
        //     props: {
        //       api: getTreeData,
        //       valueField: "value",
        //       labelField: "label"
        //     }
        //   }
        // },
        // // {
        // //   field: "treeelect",
        // //   title: "树形选择器",
        // //   itemRender: {
        // //     name: "a-tree-select",
        // //     props: {
        // //       api: getTreeData
        // //       // treeData: [
        // //       //   {
        // //       //     title: "Node1",
        // //       //     value: "0-0",
        // //       //     key: "0-0",
        // //       //     children: [
        // //       //       {
        // //       //         value: "0-0-1",
        // //       //         key: "0-0-1",
        // //       //         scopedSlots: {
        // //       //           // custom title
        // //       //           title: "title"
        // //       //         }
        // //       //       },
        // //       //       {
        // //       //         title: "Child Node2",
        // //       //         value: "0-0-2",
        // //       //         key: "0-0-2"
        // //       //       }
        // //       //     ]
        // //       //   },
        // //       //   {
        // //       //     title: "Node2",
        // //       //     value: "0-1",
        // //       //     key: "0-1"
        // //       //   }
        // //       // ]
        // //     }
        // //   }
        // // },
        // // {
        // //   field: "upload",
        // //   title: "单选上传",
        // //   itemRender: {
        // //     name: "a-upload",
        // //     props: {
        // //       name: "file",
        // //       action: "http://www.vote.com/api/upload/image",
        // //       multiple: true,
        // //       listType: "text",
        // //       accept: ".doc"
        // //     },
        // //     on: {
        // //       change: e => {
        // //         console.log(e);
        // //       }
        // //     }
        // //   }
        // // },
        // // {
        // //   field: "imageUpload",
        // //   title: "图片上传",
        // //   itemRender: {
        // //     name: "a-upload",
        // //     props: {
        // //       name: "file",
        // //       action:
        // //         "http://www.opu.com.cn:17025/api/Admin/AdminCommon/UploadImage",
        // //       listType: "picture-card",
        // //       multiple: true,
        // //       buttonText: "+选择图片",
        // //       responseUrlField: "data.url",
        // //       // maxSize: 300,
        // //       headers: {
        // //         Authorization: "a4f32e99de2b481ba91117b805b910aa"
        // //       }
        // //     },
        // //     on: {
        // //       change: e => {
        // //         console.log(e);
        // //       }
        // //     }
        // //   }
        // // },
        // // {
        // //   field: "imageUpload1",
        // //   title: "拖拽上传",
        // //   itemRender: {
        // //     name: "a-upload",

        // //     props: {
        // //       name: "file",
        // //       action: "http://www.vote.com/api/upload/image",
        // //       listType: "picture-card",
        // //       multiple: true,
        // //       dragger: true,
        // //       buttonText: () => {
        // //         return (
        // //           <div>
        // //             <div>
        // //               <a-icon type="inbox" />
        // //             </div>
        // //             <div>Click or drag file to this area to upload</div>
        // //           </div>
        // //         );
        // //       }
        // //     }
        // //   }
        // // },

        // // {
        // //   field: "slot",
        // //   title: "item插槽",
        // //   option: {
        // //     initialValue: 555
        // //   },
        // //   slot: "itemSlot"
        // // },
        // // {
        // //   field: "inputslot",
        // //   title: "input插槽",
        // //   itemRender: {
        // //     slot: "inputSlot"
        // //   }
        // // }
        // // {
        // //   field: "renderContent",
        // //   title: "自定义内容",
        // //   itemRender: {
        // //     customRender: value => {
        // //       return "6666-" + value;
        // //     }
        // //   }
        // // },
        // {
        //   align: "left",
        //   colspan: 2,
        //   colon: false,
        //   // titleWidth:0,
        //   itemRender: {
        //     name: "buttons",
        //     items: [
        //       {
        //         props: {
        //           // 'html-type': 'submit',
        //           action: "submit",
        //           content: "提交",
        //           type: "primary"
        //         }
        //       },
        //       {
        //         props: {
        //           // 'html-type': 'reset',
        //           action: "reset",
        //           content: "重置"
        //         },
        //         on: {
        //           click: () => {
        //             console.log("click");
        //             return false;
        //           }
        //         }
        //       },
        //       {
        //         props: {
        //           action: "gaoji",
        //           content: "自定义action"
        //         }
        //       },
        //       {
        //         props: {
        //           content: "设置表单值"
        //         },
        //         on: {
        //           click: this.setFormData
        //         }
        //       }
        //     ]
        //   }
        // }
      ]
    };
  },
  created() {},
  mounted() {
    // this.setFieldsOptionsDefaultValues();
    this.$refs.dataForm.setData({
      checkboxGroup: [2, 3],
      idType: "1"
    });
  },
  methods: {
    getData() {
      const values = this.$refs.dataForm.getData();
      console.log(values);
      console.log(utils.isObject(values));
    },
    async validateFields() {
      try {
        const values = await this.$refs.dataForm.validateFields();
        console.log(values);
      } catch (error) {
        console.log(error);
      }
    },
    onSubmit(values) {
      console.log(values);
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        // this.$refs.dataForm.setLoading(false);
      }, 3000);
    },
    setFormData() {
      this.$refs.dataForm.setData({
        name: "aaaa",
        renderContent: "888",
        inputslot: "669888",
        id: 66,
        aaabbbccc: "aaa666",
        pulldown: {
          id: 5,
          name: "name_1_5"
        },
        number: 0,
        selected: 2,
        sex: "1",
        radioGroup: 3,
        switch: 1,
        price: [11111, 22222],
        selectGroup: 12
      });
    },
    setItems() {
      const items = this.items.push({
        title: "动态项" + this.key,
        field: "key" + this.key,
        itemRender: {
          name: "a-input",
          props: {
            placeholder: "请输入名称"
          }
        }
      });
      this.items[6].itemRender.props.dataField = "yy";
      this.items[6].itemRender.props.param = {
        code: "yy"
      };
      console.log(items);
      this.key = this.key + 1;
    },
    setReadonly() {
      this.readonly = !this.readonly;
    },
    setImageUploadData() {
      this.$refs.dataForm.setData({
        // imageUpload:"http://www.vote.com/storage/images/20200806/cb27652f13eeff8ecd3e4793e0d5a4f5.jpg"
        imageUpload: [
          "http://www.vote.com/storage/images/20200806/cb27652f13eeff8ecd3e4793e0d5a4f5.jpg",
          "http://www.vote.com/storage/images/20200806/cb27652f13eeff8ecd3e4793e0d5a4f5.jpg"
        ]
      });
    },
    setSelectData() {
      this.$refs.dataForm.setFieldsOptions({
        sex: [
          {
            id: 5,
            name: "boy"
          },
          {
            id: 6,
            name: "girl"
          }
        ],
        idType: ["a", "b", "c"]
      });
    },
    setFieldsOptionsDefaultValues() {
      this.$refs.dataForm.setFieldsOptionsDefaultValues();
    },
    getSelectData() {
      return new Promise(resolve => {
        setTimeout(() => {
          const data = Array.from({ length: 10 }, (_, key) => ({
            id: key,
            name: `name${key}`
          }));
          resolve(data);
        }, 500);
      });
    },
    onOptionsAllLoad(json) {
      console.log("所有api请求完成", json);
      this.$nextTick(() => {
        // this.setFormData();
      });
    },
    onOptionsLoadBefore(list) {
      console.log("请求前回调", list);
    },
    onButtonClick(action) {
      console.log(666, action);
    },
    onRadioChange(e) {
      console.log(e);
      // this.setItems();
    },
    setExpand() {
      this.expand = !this.expand;
      this.$refs.dataForm.setExpand(this.expand);
    },
    setColspan() {
      this.colspan = 3;
    },
    showModelTable() {
      this.$refs.modelTable.show();
    },
    loadOptionsData() {
      this.$refs.dataForm.loadOptionsData(
        {
          selected: 123456,
          checkboxGroup: 666
        },
        () => {
          console.log("set");
          this.setFormData();
        }
      );
    },
    getFieldsOptions() {
      console.log(this.$refs.dataForm.getFieldsOptions());
      console.log(this.$refs.dataForm.getFieldsOptions(["checkboxGroup"]));
    }
  }
};
</script>
