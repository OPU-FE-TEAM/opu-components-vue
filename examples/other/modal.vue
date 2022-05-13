<template>
  <div>
    <a-button type="primary" @click="open">打开</a-button>
    <modal title="" v-model="visible" showFooter :width="700">
      666
      <template #footer>
        8888
      </template>
    </modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
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
