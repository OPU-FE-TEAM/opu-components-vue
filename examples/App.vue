<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <dataFormBase v-if="tab == 1" />
      <dataTableBase v-else-if="tab == 2" />
      <crudTableBase v-else-if="tab == 3" />
      <Cell v-else-if="tab == 4" />
      <pageWraper v-else-if="tab == 5" />
      <pulldownTable v-else-if="tab == 6" />
      <dataTableJsx v-else-if="tab == 7" />
    </a-config-provider>
  </div>
</template>

<script>
import dataFormBase from "./dataForm/base";
import dataTableBase from "./dataTable/base";
import dataTableJsx from "./dataTable/jsx";

import crudTableBase from "./crudTable/base";
import Cell from "./other/cell";
import pageWraper from "./other/pageWraper";
import pulldownTable from "./other/pulldownTable";

import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
// import enUS from "ant-design-vue/es/locale/en_US";
export default {
  name: "App",
  components: {
    dataFormBase,
    dataTableBase,
    crudTableBase,
    Cell,
    pageWraper,
    pulldownTable,
    dataTableJsx
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
