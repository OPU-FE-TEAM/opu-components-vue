<template>
  <div>
    <DataForm
      ref="dataForm"
      layout="inline"
      :items="items"
      :loading="loading"
      isClearUndefinedValue
      autoSetDefaultValue
    >
    </DataForm>
    <a-button @click="onSetFormData">赋值</a-button>
    <a-button @click="onGetFormData">获取表单值</a-button>
  </div>
</template>

<script>
import { DataForm } from "../../index";
// import { utils } from "../../index";

var a = { id: 1, name: 10 };

function getSelectGroupData() {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = [
        {
          Id: 1,
          Text: "男",
          code: "boy"
        },
        {
          Id: 2,
          Text: "女",
          isSelected: true,
          code: "girl"
        },
        {
          Id: 3,
          Text: "未知"
        }
      ];
      resolve({
        data: data
      });
    }, 500);
  });
}

export default {
  components: {
    DataForm
  },
  data() {
    return {
      a,
      loading: true,
      items: [
        // {
        //   field: "ordinary",
        //   title: "options下拉",
        //   // hasFeedback: true,
        //   // option: {
        //   //   rules: [{ required: true, message: "请输入名称!" }]
        //   // },

        //   itemRender: {
        //     name: "a-select",
        //     props: {
        //       size: "small",
        //       defaultField: "isSelected",
        //       valueField: "id",
        //       labelField: "text",
        //       options: [
        //         {
        //           id: 1,
        //           text: "广西",
        //           code: 1245
        //         },
        //         {
        //           id: 2,
        //           text: "淅川"
        //         },
        //         {
        //           id: 3,
        //           text: "釜山",
        //           isSelected: true
        //         }
        //       ]
        //     }
        //   }
        // },
        {
          field: "ordinary1",
          title: "请求下拉",
          // hasFeedback: true,
          // option: {
          //   rules: [{ required: true, message: "请输入名称!" }]
          // },

          itemRender: {
            name: "a-select",
            props: {
              size: "small",
              defaultField: "isSelected",
              valueField: "Id",
              labelField: "Text",
              api: getSelectGroupData
            }
          }
        },
        {
          field: "ordinaryMultiple",
          title: "请求多选下拉",
          itemRender: {
            name: "a-select",
            props: {
              mode: "multiple",
              size: "small",
              defaultField: "isSelected",
              valueField: "Id",
              labelField: "Text",
              api: getSelectGroupData
            }
          }
        },
        // {
        //   field: "optionTreeSelect",
        //   title: "option树下拉",
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
        //           isDeleted: true,
        //           simpleCode: "LW,HK",
        //           disabled: true,
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
        //               disabled: true,
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
        //   field: "optionMultipleTreeSelect",
        //   title: "多选options树下拉",
        //   itemRender: {
        //     name: "a-tree-select",
        //     style: { width: "130px" },
        //     props: {
        //       showSearch: true,
        //       treeCheckable: true,
        //       multiple: true,
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
        //           isDeleted: true,
        //           simpleCode: "LW,HK",
        //           disabled: true,
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
        //               disabled: true,
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
        // }
        {
          field: "sex",
          title: "单选框组",
          itemRender: {
            name: "a-radio-group",
            props: {
              options: [
                { name: "男", id: "man" },
                { name: "女", id: "woman" }
              ]
            }
          }
        },
        {
          field: "checkboxGroup",
          title: "复选框组",
          itemRender: {
            name: "a-checkbox-group",
            props: {
              options: [
                { label: "Apple", value: "Apple" },
                { label: "Pear", value: "Pear" },
                { label: "Orange", value: "Orange" }
              ],
              valueField: "value",
              labelField: "label"
            }
          }
        }
      ]
    };
  },
  computed: {
    dataValue() {
      return a;
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSetFormData() {
      this.$refs.dataForm.setData({
        ordinary: 0,
        ordinary1: 1,
        ordinaryMultiple: [2, 3],
        optionTreeSelect: "874199879860092928",
        optionMultipleTreeSelect: ["874199879860092928", "874205640732442624"],
        sex: "woman",
        checkboxGroup: ["Orange", "Pear"]
      });
    },
    onGetFormData() {
      console.log(this.$refs.dataForm.getData());
      this.$refs.dataForm
        .validateFields()
        .then(values => {
          console.log(values);
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
/deep/.data-form .ant-form-item .data-form-item-title {
  line-height: 40px;
}

.ant-btn + .ant-btn {
  margin-left: 10px;
}
</style>
