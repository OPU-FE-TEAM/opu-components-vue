<template>
  <div>
    <!-- layout="inline" -->
    <DataForm
      ref="dataForm"
      :items="items"
      :loading="loading"
      isClearUndefinedValue
      autoSetDefaultValue
      titleWidth="80"
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
getSelectGroupData();

export default {
  components: {
    DataForm
  },
  data() {
    return {
      a,
      loading: true,
      items: [
        {
          field: "checkOutDate1",
          title: "日期范围",
          itemRender: {
            name: "a-range-picker-split",
            props: {
              allowClear: true,
              showTime: { format: "HH:mm:ss" }
            }
          }
        }
        // {
        //   field: "ordinary1",
        //   title: "请求下拉123",
        //   itemRender: {
        //     name: "a-select",
        //     props: {
        //       size: "small",
        //       defaultField: "isSelected",
        //       dataField: "data",
        //       valueField: "Id",
        //       labelField: "Text",
        //       // api: getSelectGroupData,
        //       searchApi: getSelectGroupData,
        //       mode: "multiple"
        //     },
        //     on: {
        //       change: (e, rows) => {
        //         console.log(e, "e");
        //         console.log(rows, "rows");
        //       }
        //     }
        //   }
        // }
        // {
        //   title: "部门",
        //   field: "departId123",
        //   itemRender: {
        //     name: "a-tree-select",
        //     props: {
        //       treeData: [
        //         {
        //           key: "874199840383303680",
        //           title: "卤味",
        //           isDeleted: true,
        //           simpleCode: "LW,HK",
        //           disabled: true,
        //           children: [
        //             {
        //               key: "874199879860092928",
        //               title: "肉类",
        //               isDeleted: false,
        //               simpleCode: "RL,MO",
        //               children: []
        //             },
        //             {
        //               key: "878177788215951360",
        //               title: "蔬菜",
        //               isDeleted: false,
        //               simpleCode: "SC,AA",
        //               children: []
        //             }
        //           ]
        //         },
        //         {
        //           key: "874205575305494528",
        //           title: "地方小炒",
        //           isDeleted: false,
        //           simpleCode: "DFXC,FYIO",
        //           children: [
        //             {
        //               key: "874205640732442624",
        //               title: "桂林",
        //               isDeleted: false,
        //               simpleCode: "GL,SS",
        //               disabled: true,
        //               children: []
        //             }
        //           ]
        //         }
        //       ]
        //     },
        //     treeDefaultExpandAll: true
        //   }
        // }
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
.data-form .ant-form-item .data-form-item-title {
  line-height: 40px;
}

.ant-btn + .ant-btn {
  margin-left: 10px;
}
</style>
