<template>
  <div>
    <a-button type="primary" @click="open">打开</a-button>
    <a-button type="primary" @click="open1">打开1</a-button>
    <a-button type="primary" @click="open2">打开2</a-button>
    <modal title="" v-model="visible" :width="700">
      <div>
        <a-checkbox-group :options="options"> </a-checkbox-group>
        <BaseForm />
      </div>
    </modal>
    <modal title="modal1" v-model="visible1" :width="700">
      <div>
        <DataTable />
      </div>
    </modal>
    <modal title="modal2" v-model="visible2" :width="700">
      <div>
        <pulldownTable />
      </div>
    </modal>
  </div>
</template>

<script>
import BaseForm from "../dataForm/base.vue";
import DataTable from "../dataTable/data.vue";
import pulldownTable from "../other/pulldownTable.vue";

export default {
  components: {
    BaseForm,
    DataTable,
    pulldownTable
  },
  data() {
    return {
      visible: false,
      visible1: false,
      visible2: false,

      options: [
        { label: "公共", value: "messageCommonIsPop" },
        { label: "我提交的", value: "messageSubmitIsPop" },
        { label: "审核弹出", value: "messageAuditIsPop" },
        { label: "其他", value: "messageNoticeIsPop" }
      ],
      value: []
    };
  },

  created() {},
  methods: {
    open() {
      this.visible = true;
    },
    open1() {
      this.visible1 = true;
    },
    open2() {
      this.visible2 = true;
    }
  }
};
</script>
