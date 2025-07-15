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
  </div>
</template>

<script>
import { DataForm } from "../../index";

export default {
  components: {
    DataForm,
  },
  data() {
    return {
      loading: true,
      items: [
        {
          field: "aa",
          title: "单位",
          itemRender: {
            name: "a-auto-complete",
            props: {
              allowClear: true,
              options: [
                {
                  id: "1",
                  name: "盒",
                  simpleCode: "H",
                  wubiCode: "W",
                },
                {
                  id: "2",
                  name: "片",
                  simpleCode: "P",
                  wubiCode: "T",
                },
                {
                  id: "3",
                  name: "袋",
                  simpleCode: "D",
                  wubiCode: "W",
                },
                {
                  id: "4",
                  name: "支",
                  simpleCode: "Z",
                  wubiCode: "F",
                },
              ],
              valueField: "name",
            },
          },
        },
      ],
    };
  },

  created() {},
  mounted() {},
  methods: {},
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
