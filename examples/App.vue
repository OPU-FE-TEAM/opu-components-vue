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
      <setColumns v-else-if="tab == 8" />
      <dataTableBase1 v-else-if="tab == 9" />
      <modalDemo v-else-if="tab == 10" />
      <dataTableBase2 v-else-if="tab == 11" />
    </a-config-provider>
  </div>
</template>

<script>
import dataFormBase from "./dataForm/test";
// import dataFormBase from "./dataForm/base";
// import dataFormBase from "./dataForm/select";
import dataTableBase2 from "./dataTable/base";
import dataTableBase1 from "./dataTable/data";

// import dataTableBase from "./dataTable/Grid";
import dataTableBase from "./dataTable/editTable";
import dataTableJsx from "./dataTable/jsx";
import setColumns from "./dataTable/setColumns.vue";

import crudTableBase from "./crudTable/index1";
// import crudTableBase from "./crudTable/base";
import Cell from "./other/cell";
import pageWraper from "./other/pageWraper";
import pulldownTable from "./other/pulldownTable";
import modalDemo from "./other/modal";

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
    dataTableJsx,
    setColumns,
    dataTableBase1,
    modalDemo,
    dataTableBase2
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
