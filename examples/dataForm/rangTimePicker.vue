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

export default {
  components: {
    DataForm
  },
  data() {
    return {
      loading: true,
      items: [
        {
          field: "a1",
          title: "虚拟"
        },
        {
          field: "a5",
          title: "虚拟",
          itemRender: {
            name: "a-time-picker"
          }
        },
        {
          field: "a4",
          title: "虚拟"
        },
        {
          field: "a3",
          title: "虚拟",
          itemRender: {
            name: "a-time-picker"
          }
        },
        {
          field: "checkOutDate1",
          title: "日期范围",
          itemRender: {
            name: "a-range-time-picker-split",
            props: {
              format: "HH:mm:ss"
              // hasLimit: false
            }
          }
        },
        {
          field: "a2",
          title: "虚拟"
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onSetFormData() {
      this.$refs.dataForm.setData({});
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
<style scoped></style>
