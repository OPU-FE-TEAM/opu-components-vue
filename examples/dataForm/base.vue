<template>
  <div>
    <DataForm
      ref="dataForm"
      layout="grid"
      :colspan="2"
      :readonly="readonly"
      :items="items"
      :onOptionsAllLoad="onOptionsAllLoad"
      :onOptionsLoadBefore="onOptionsLoadBefore"
      :cancelButtonProps="false"
      @buttonActionClick="onButtonClick"
      @submit="onSubmit"
      :loading="loading"
    >
      <template slot="itemSlot" slot-scope="text, updateValue, field">
        全插槽内容:{{ text }}{{ field }}
        <a @click="updateValue('77777')">改变值</a>
      </template>
      <template slot="inputSlot" slot-scope="text, updateValue, field">
        {{ text }}{{ field }}
        <a @click="updateValue('77777')">改变值</a>
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
  </div>
</template>

<script>
// import {DataForm} from '../../packages/index'
// console.log(DataForm);
import { utils } from "../../index";

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
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(arr);
      const size = arr.pageSize ? arr.pageSize : 20;
      const pageIndex = arr.pageIndex ? arr.pageIndex : 1;
      const list = Array.from({ length: size }, (_, key) => ({
        id: key,
        name: `name_${pageIndex}_${key}`,
        sex: key < 3 ? 1 : 2,
        age: key
      }));
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

function getCheckboxData() {
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

// function getTreeData() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       const data = [
//         {
//           value: "zhejiang",
//           label: "Zhejiang",
//           children: [
//             {
//               value: "hangzhou",
//               label: "Hangzhou",
//               children: [
//                 {
//                   value: "xihu",
//                   label: "West Lake"
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           value: "jiangsu",
//           label: "Jiangsu",
//           children: [
//             {
//               value: "nanjing",
//               label: "Nanjing",
//               children: [
//                 {
//                   value: "zhonghuamen",
//                   label: "Zhong Hua Men"
//                 }
//               ]
//             }
//           ]
//         }
//       ];
//       resolve({
//         code: 0,
//         data: data
//       });
//     }, 500);
//   });
// }

export default {
  components: {
    // DataForm
  },
  data() {
    return {
      key: 1,
      readonly: false,
      loading: false,
      items: [
        {
          field: "id",
          itemRender: {
            name: "hidden"
          }
        },
        {
          field: "pulldown",
          title: "下拉面板",
          itemRender: {
            name: "pulldown-table",
            props: {
              table: {
                props: {
                  columns: [
                    { type: "checkbox", width: 50 },
                    { type: "seq", title: "Number", width: 80 },
                    {
                      field: "name",
                      title: "Name",
                      width: 200
                    },
                    {
                      field: "sex",
                      title: "Sex",
                      width: 200
                    },
                    {
                      field: "age",
                      title: "Age",
                      width: 200
                    }
                  ],
                  height: 300,
                  highlightHoverRow: true,
                  highlightCurrentRow: true,
                  proxyConfig: {
                    ajax: {
                      query: getData
                    }
                  }
                }
              }
            }
          }
        },
        {
          field: "name",
          title: "名称",
          extra: "aaa",
          option: { initialValue: "555666" },
          itemRender: {
            name: "a-input",

            props: {
              readonly: true,
              placeholder: "请输入名称"
              // disabled:true
            },
            on: {
              // change:(val)=>{
              //     const form=this.$refs.dataForm.getData();
              //     console.log(val,form);
              // }
            }
          }
        },
        {
          field: "name1",
          title: "名称2",
          option: { initialValue: 333 },
          itemRender: {
            name: "a-input",
            props: {
              placeholder: "请输入名称"
            }
          }
        },
        {
          field: "name3",
          title: "名称3",
          itemRender: {
            name: "a-input"
          }
        },
        {
          field: "mytitle",
          title: () => {
            return "自定义标题6";
          },
          titleWidth: "150px",
          itemRender: {
            name: "a-input",
            before: () => {
              return 555;
            },
            after: () => {
              return 666;
            }
          }
        },
        {
          field: "sex",
          title: "性别",
          hasFeedback: true,
          // option: {
          //   rules: [{ required: true, message: "请输入名称!" }]
          // },

          itemRender: {
            name: "a-select",
            props: {
              placeholder: "请选择性别",
              showSearch: true,
              defaultField: "isSelected",
              // valueField: "id",
              // labelField: "name",
              dataField: "aa",
              // api:getSelectData,
              param: {
                code: "aa"
              }
              // options:[
              //     {
              //         id:1,
              //         name:"男"
              //     },
              //     {
              //         id:2,
              //         name:"女",
              //         isSelected:true
              //     }
              // ]
            }
          }
        },
        {
          field: "selected",
          title: "下拉框-全局接口获取",
          itemRender: {
            name: "a-select",
            props: {
              // valueField: "id",
              // labelField: "name",
              mode: "multiple",
              dataField: "bb",
              param: {
                code: "bb"
              }
            }
          }
        },
        // {
        //   field: "password",
        //   title: "密码框",
        //   help: "请输入登录密码",
        //   itemRender: {
        //     name: "a-input-password"
        //   }
        // },
        // {
        //   field: "textarea",
        //   title: "文本域",
        //   // colspan:2,
        //   itemRender: {
        //     name: "a-textarea"
        //   }
        // },

        // {
        //   field: "checkbox",
        //   title: "复选框",
        //   width: "200px",
        //   option: { valuePropName: "checked" },
        //   itemRender: {
        //     name: "a-checkbox"
        //   }
        // },
        {
          field: "checkboxGroup",
          title: "复选框组",
          itemRender: {
            name: "a-checkbox-group",
            props: {
              api: getCheckboxData,
              valueField: "id",
              labelField: "name",
              dataField: "",
              defaultField: "isSelected",
              param: {
                code: "dd"
              }
              // options: [
              //   { label: "Apple", value: "Apple" },
              //   { label: "Pear", value: "Pear" },
              //   { label: "Orange", value: "Orange" }
              // ]
            }
          }
        },
        {
          field: "radioGroup",
          title: "单选框组",
          itemRender: {
            name: "a-radio-group",
            props: {
              api: getCheckboxData,
              dataField: "",
              param: {
                code: "cc"
              }
              // options: [
              //   { id: "Apple", name: "Apple" },
              //   { id: "Pear", name: "Pear" },
              //   { id: "Orange", name: "Orange" }
              // ]
            },
            on: {
              change: this.onRadioChange
            }
          }
        },
        {
          field: "number",
          title: "数字",
          // width: "200px",
          itemRender: {
            name: "a-input-number"
          }
        },
        {
          field: "date",
          title: "日期选择",
          itemRender: {
            name: "a-date-picker",
            props: {
              showTime: true,
              format: "YYYY/MM/DD HH:mm:ss"
              // api: getCheckboxData
            }
          }
        },
        {
          field: "time",
          title: "时间",
          itemRender: {
            name: "a-time-picker"
          }
        },
        {
          field: "number2",
          title: "数字2",
          // width: "200px",
          itemRender: {
            name: "a-input-number"
          }
        },
        // {
        //   field: "month",
        //   title: "月份选择",
        //   itemRender: {
        //     name: "a-month-picker"
        //   }
        // },
        // {
        //   field: "weekPicker",
        //   title: "星期选择",
        //   itemRender: {
        //     name: "a-week-picker"
        //   }
        // },
        // {
        //   field: "rangePicker",
        //   title: "日期范围选择",
        //   itemRender: {
        //     name: "a-range-picker",
        //     props: {
        //       showTime: { format: "HH:mm" }
        //     }
        //   }
        // },
        {
          field: "ARangePickerSplit",
          title: "日期范围拆分",
          itemRender: {
            name: "a-range-picker-split",
            props: {
              // showTime: { format: "HH:mm" }
            }
          }
        }
        // {
        //   field: "switch",
        //   title: "开关",
        //   option: { valuePropName: "checked" },
        //   itemRender: {
        //     name: "a-switch"
        //   }
        // },
        // {
        //   field: "rate",
        //   title: "评分",
        //   itemRender: {
        //     name: "a-rate"
        //   }
        // },
        // {
        //   field: "slider",
        //   title: "滑动输入",
        //   option: { initialValue: [20, 50] },
        //   itemRender: {
        //     name: "a-slider",
        //     props: {
        //       range: true
        //     }
        //   }
        // },
        // // {
        // //   field: "cascader",
        // //   title: "级联选择",
        // //   itemRender: {
        // //     name: "a-cascader",
        // //     props: {
        // //       api: getTreeData,
        // //       valueField: "value",
        // //       labelField: "label"
        // //     }
        // //   }
        // // },
        // {
        //   field: "treeelect",
        //   title: "树形选择器",
        //   itemRender: {
        //     name: "a-tree-select",
        //     props: {
        //       treeData: [
        //         {
        //           title: "Node1",
        //           value: "0-0",
        //           key: "0-0",
        //           children: [
        //             {
        //               value: "0-0-1",
        //               key: "0-0-1",
        //               scopedSlots: {
        //                 // custom title
        //                 title: "title"
        //               }
        //             },
        //             {
        //               title: "Child Node2",
        //               value: "0-0-2",
        //               key: "0-0-2"
        //             }
        //           ]
        //         },
        //         {
        //           title: "Node2",
        //           value: "0-1",
        //           key: "0-1"
        //         }
        //       ]
        //     }
        //   }
        // },
        // {
        //   field: "upload",
        //   title: "单选上传",
        //   itemRender: {
        //     name: "a-upload",
        //     props: {
        //       name: "file",
        //       action: "http://www.vote.com/api/upload/image",
        //       multiple: true,
        //       listType: "text",
        //       accept: ".doc"
        //     },
        //     on: {
        //       change: e => {
        //         console.log(e);
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "imageUpload",
        //   title: "图片上传",
        //   itemRender: {
        //     name: "a-upload",

        //     props: {
        //       name: "file",
        //       action: "http://www.vote.com/api/upload/image",
        //       listType: "picture-card",
        //       multiple: true,
        //       buttonText: "+选择图片",
        //       responseUrlField: "data.url",
        //       maxSize: 300
        //     },
        //     on: {
        //       change: e => {
        //         console.log(e);
        //       }
        //     }
        //   }
        // },
        // {
        //   field: "imageUpload1",
        //   title: "拖拽上传",
        //   itemRender: {
        //     name: "a-upload",

        //     props: {
        //       name: "file",
        //       action: "http://www.vote.com/api/upload/image",
        //       listType: "picture-card",
        //       multiple: true,
        //       dragger: true,
        //       buttonText: () => {
        //         return (
        //           <div>
        //             <div>
        //               <a-icon type="inbox" />
        //             </div>
        //             <div>Click or drag file to this area to upload</div>
        //           </div>
        //         );
        //       }
        //     }
        //   }
        // },

        // {
        //   field: "slot",
        //   title: "item插槽",
        //   option: {
        //     initialValue: 555
        //   },
        //   slot: "itemSlot"
        // },
        // {
        //   field: "inputslot",
        //   title: "input插槽",
        //   itemRender: {
        //     slot: "inputSlot"
        //   }
        // },
        // {
        //   field: "renderContent",
        //   title: "自定义内容",
        //   itemRender: {
        //     customRender: value => {
        //       return "6666-" + value;
        //     }
        //   }
        // },
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
      checkboxGroup: [2, 3]
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
        radioGroup: 3
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
        ]
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
    }
  }
};
</script>
