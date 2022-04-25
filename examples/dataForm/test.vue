<template>
  <div>
    <div style="width:300px">
      <DataForm
        ref="dataForm"
        :items="items"
        :foldingButtonProps="false"
        autoSetDefaultValue
        autoSetDefaultFirst
        autoFocus="name3"
        loadOptionsIdField="id"
        titleWidth="auto"
      >
      </DataForm>
    </div>
  </div>
</template>

<script>
// import test1 from "./test1";

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

export default {
  components: {
    // test1
  },
  data() {
    return {
      items: [
        {
          title: "出库去向",
          field: "trackId",
          itemRender: {
            name: "a-cascader",
            props: {
              placeholder: "请选择",
              options: data,
              labelField: "label",
              valueField: "value",
              fieldNames: {
                label: "label",
                value: "value",
                children: "children"
              }
            },
            on: {
              change: this.onChangeTrackId
            }
          }
        }
      ]
      // selectGroupOptions: [
      //   {
      //     id: 1,
      //     text: "男",
      //     code: "boy",
      //     children: [
      //       { id: 11, text: "0-10岁", code: "b10" },
      //       { id: 12, text: "11-20岁", code: "b20" },
      //       { id: 13, text: "21-30岁", code: "b30" },
      //       { id: 14, text: "辣鸡", code: "b40" },
      //       { id: 15, text: "草割肉", code: "cgr" },
      //       { id: 16, text: "牛扒", code: "np" }
      //     ]
      //   },
      //   {
      //     id: 2,
      //     text: "女",
      //     code: "girl",
      //     children: [
      //       { id: 21, text: "0-10岁", code: "g10" },
      //       { id: 22, text: "11-20岁", code: "g20" },
      //       { id: 23, text: "21-30岁", code: "g30" }
      //     ]
      //   },
      //   {
      //     id: 3,
      //     text: "未知",
      //     children: [
      //       { id: 31, text: "0-10岁", code: "g10" },
      //       { id: 32, text: "11-20岁", code: "g20" },
      //       { id: 33, text: "21-30岁", code: "g30" }
      //     ]
      //   }
      // ]
    };
  },
  methods: {
    onChangeTrackId(a, b, c, d) {
      console.log(a);
      console.log(b);
      console.log(c);
      console.log(d);
      debugger;
    }
  }
};
</script>
