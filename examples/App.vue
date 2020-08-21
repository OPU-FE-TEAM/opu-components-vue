<template>
  <div id="app">
    <dataFormBase v-if="tab == 1" />
    <dataTableBase v-else-if="tab == 2" />
  </div>
</template>

<script>
import dataFormBase from "./dataForm/base";
import dataTableBase from "./dataTable/base";

export default {
  name: "App",
  components: {
    dataFormBase,
    dataTableBase
  },
  data() {
    return {
      tab: 2
    };
  }
};
</script>

<style></style>
