<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <dataFormBase v-if="tab == 1" />
      <dataTableBase v-else-if="tab == 2" />
    </a-config-provider>
  </div>
</template>

<script>
import dataFormBase from "./dataForm/base";
import dataTableBase from "./dataTable/base";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
// import enUS from "ant-design-vue/es/locale/en_US";
export default {
  name: "App",
  components: {
    dataFormBase,
    dataTableBase
  },
  data() {
    return {
      tab: 1,
      locale: zh_CN
    };
  }
};
</script>

<style></style>
