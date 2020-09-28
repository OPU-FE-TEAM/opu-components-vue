<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <dataFormBase v-if="tab == 1" />
      <dataTableBase v-else-if="tab == 2" />
      <crudTableBase v-else-if="tab == 3" />
    </a-config-provider>
  </div>
</template>

<script>
import dataFormBase from "./dataForm/base";
import dataTableBase from "./dataTable/base";
import crudTableBase from "./crudTable/base";

import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
// import enUS from "ant-design-vue/es/locale/en_US";
export default {
  name: "App",
  components: {
    dataFormBase,
    dataTableBase,
    crudTableBase
  },
  data() {
    return {
      tab: 3,
      locale: zh_CN
    };
  }
};
</script>

<style></style>
