<template>
  <div>
    <a-button type="primary" @click="open">打开</a-button>
    <modal title="" v-model="visible" :width="700">
      <div>
        <a-checkbox-group :options="options"> </a-checkbox-group>
        <BaseForm />
      </div>
      <template #footer>
        8888
      </template>
    </modal>
  </div>
</template>

<script>
import BaseForm from "../dataForm/base.vue";
export default {
  components: {
    BaseForm
  },
  data() {
    return {
      visible: false,
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
    }
  }
};
</script>
