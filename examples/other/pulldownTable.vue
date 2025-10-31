<template>
  <div>
    <data-form ref="dataForm" :items="formItems" />
    <button @click="onShow">显示</button>
    <button @click="onGetFormData">获取表单数据</button>

    <modal v-model="show" :width="800">
      <!-- <pulldownTable
        :table="table"
        :searchBefore="onSearchBefore"
        searchField="key"
        v-model="value"
        style="width:300px"
        @inputChange="onInputChange"
        @change="onChange"
        textField="sex"
      /> -->
    </modal>
  </div>
</template>

<script>
function getData(arr) {
  console.log("arr", arr);
  return new Promise(resolve => {
    setTimeout(() => {
      const size = arr.pageSize ? arr.pageSize : 20;
      const pageIndex = arr.pageIndex ? arr.pageIndex : 1;
      const list = Array.from({ length: size }, (_, key) => ({
        id: key,
        keyName: `name_${pageIndex}_${key}`,
        sex: key < 3 ? 1 : 2,
        age: key,
      }));
      const json = {
        // data: [...list],
        // total: 100
        code: 0,
        data: {
          data: [...list],
          total: 100,
        },
      };
      console.log("json", json);
      resolve(json);
    }, 500);
  });
}
export default {
  data() {
    const that = this;
    return {
      table: {
        props: {
          proxyColumns: {
            params: {
              queryFlag: true,
            },
          },
          setcolumnsConfig: {
            modal: {
              props: {
                bodyStyle: { height: "500px" },
              },
            },
            proxyConfig: {
              props: {
                title: "title",
                width: "width",
                align: "align",
                show: "show",
                fixed: "fixed",
                field: "field",
              },
              on: {
                submitBefore: values => {
                  console.log(values);
                  // return false;
                },
              },
            },
            tableConfig: {
              columns: [
                {
                  width: 60,
                  align: "center",
                  slots: {
                    default: "btn_default",
                    header: () => {
                      return "排序";
                    },
                  },
                },
                {
                  field: "title",
                  title: "显示标题",
                  align: "center",
                  editRender: { name: "AInput" },
                },
                {
                  field: "width",
                  title: "列宽",
                  align: "center",
                  editRender: { name: "AInputNumber" },
                },
                {
                  field: "align",
                  title: "对齐方式",
                  align: "center",
                  editRender: {
                    name: "ASelect",
                    options: [
                      { label: "居左", value: "left" },
                      { label: "居中", value: "center" },
                      { label: "居右", value: "right" },
                    ],
                  },
                },
                {
                  field: "show",
                  title: "显示",
                  align: "center",
                  slots: { default: "show_default" },
                },
                {
                  field: "fixed",
                  title: "固定",
                  align: "center",
                  editRender: {
                    name: "ASelect",
                    options: [
                      { label: "不固定", value: "" },
                      { label: "靠左", value: "left" },
                      { label: "靠右", value: "right" },
                    ],
                  },
                },
              ],
            },
          },
          columns: [
            { type: "checkbox", width: 50 },
            { type: "seq", title: "Number", width: 80 },
            {
              field: "keyName",
              title: "Name",
              width: 200,
              align: "left",
            },
            {
              field: "sex",
              title: "Sex",
              width: 200,
            },
            {
              field: "age",
              title: "Age",
              width: 200,
            },
          ],
          //   headToolbar: {
          //     buttons: [
          //       {
          //         name: "添加用户",
          //         code: "add",
          //         icon: "file-add",
          //         type: "primary"
          //       }
          //     ],
          //     search: {
          //       layout: "inline",
          //       titleWidth: "auto",
          //       on: {
          //         submit: values => {
          //         }
          //       },
          //       items: [
          //         {
          //           field: "name",
          //           title: "名称",
          //           itemRender: {
          //             name: "a-input",
          //             props: { placeholder: "请输入名称" }
          //           }
          //         },
          //         {
          //           field: "sex",
          //           title: "性别",
          //           itemRender: {
          //             name: "a-select",
          //             props: {
          //               placeholder: "请选择性别",
          //               showSearch: true,
          //               defaultField: "isSelected",
          //               valueField: "id",
          //               labelField: "name",
          //               param: { code: "aa" }
          //             }
          //           }
          //         },
          //         {
          //           field: "age",
          //           title: "年龄",
          //           folding: true,
          //           itemRender: {
          //             name: "a-input-number",
          //             props: { placeholder: "请输入年龄" }
          //           }
          //         },
          //         {
          //           colon: false,
          //           titleWidth: 0,
          //           folding: false,
          //           itemRender: {
          //             name: "buttons",
          //             items: [
          //               {
          //                 props: {
          //                   action: "submit",
          //                   content: "查询",
          //                   type: "primary"
          //                 }
          //               }
          //             ]
          //           }
          //         }
          //       ]
          //     }
          //   },
          height: 300,
          highlightHoverRow: true,
          highlightCurrentRow: true,
          proxyConfig: {
            ajax: {
              query: getData,
            },
          },
        },
      },
      value: "",
      show: false,
      formItems: [
        {
          title: "物品",
          field: "goodsName",
          itemRender: {
            name: "pulldown-table",
            props: {
              valueField: "keyName",
              searchField: "keyword",
              allowInputValue: false,
              retainSearchValue: false,
              retainSearchKeyword: false,
              table: {
                props: {
                  sortable: true,
                  sortConfig: { remote: true },
                  columns: [
                    {
                      field: "id",
                      title: "ID",
                    },
                    {
                      field: "keyName",
                      title: "Name",
                      width: 200,
                      align: "left",
                    },

                    {
                      field: "sex",
                      title: "Sex",
                      width: 200,
                    },
                  ],
                  height: "400px",
                  highlightHoverRow: true,
                  highlightCurrentRow: true,
                  // proxyColumns: {
                  //   params: {
                  //     queryFlag: true,
                  //   },
                  // },
                  // setcolumnsConfig: {
                  //   proxyConfig: {
                  //     params: {
                  //       queryFlag: false
                  //     }
                  //   }
                  // },
                  proxyConfig: {
                    autoLoad: false,
                    props: {
                      result: "data.data",
                      total: "data.total",
                      list: "data.data",
                    },
                    ajax: {
                      query: getData,
                      // query: (params) => {
                      //   return new Promise((resolve) => {
                      //     console.log("请求数据", params);
                      //     if (params.keyword == 2) {
                      //       resolve({
                      //         code: 0,
                      //         data: {
                      //           datas: [],
                      //         },
                      //       });
                      //       return;
                      //     } else if (params.keyword == 1) {
                      //       resolve({
                      //         code: 0,
                      //         data: {
                      //           datas: [
                      //             {
                      //               id: 1,
                      //               name: "aaaa",
                      //               endingQuantity: "111",
                      //               endingAvgPrice: "22",
                      //             },
                      //           ],
                      //         },
                      //       });
                      //       return;
                      //     }
                      //     resolve({
                      //       code: 0,
                      //       data: {
                      //         datas: [
                      //           {
                      //             id: 1,
                      //             name: "aaaa",
                      //             endingQuantity: "111",
                      //             endingAvgPrice: "22",
                      //           },
                      //           {
                      //             id: 2,
                      //             endingQuantity: "aaa",
                      //             endingAvgPrice: "bbb",
                      //             name: "bbbb",
                      //           },
                      //         ],
                      //       },
                      //     });
                      //   });
                      // },
                    },
                  },
                },
                style: {
                  width: "calc(65vw)",
                },
              },
            },
            on: {
              change: (e, row) => {
                const arr = {
                  goodsId: row ? row.goodsId : "",
                  goodsName: row ? row.keyName : "",
                };
                console.log("change", e, row, arr);
                setTimeout(() => {
                  that.$refs.dataForm.setData(arr);
                }, 10);
              },
            },
          },
        },
      ],
    };
  },
  methods: {
    onInputChange(e) {
      const { value } = e.target;
      console.log("change", value);
    },
    onSearchBefore(values) {
      console.log(values);
      //   return { keyword: value };
    },
    onChange(e) {
      console.log(e);
    },
    onShow() {
      // this.show = true;
      this.$refs.dataForm.setData({
        goodsId: "123",
        goodsName: "123",
      });
    },
    onGetFormData() {
      console.log(this.$refs.dataForm.getData());
    },
  },
};
</script>
<style>
.ant-select-dropdown {
  z-index: 2010 !important;
}
</style>
