<template>
  <div style="background:#ddd;">
    <page-wraper
      :tabs="tabs"
      :updateUrl="true"
      :defaultTab="currentTab"
      @tabChange="onTabsChange"
    >
      <div v-if="currentTab == 'tab1'">tab1</div>
      <div v-else-if="currentTab == 'tab2'">tab2</div>
    </page-wraper>

    <page-wraper>
      <div>页面内容</div>
    </page-wraper>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: {
        items: [
          {
            key: "tab1",
            tab: "页签1"
            // scopedSlots: { tab: 'customRender' },
          },
          {
            key: "tab2",
            tab: "页签2"
          }
        ],
        change: this.onTabsChange
      },
      currentTab: "tab1"
    };
  },
  created() {},
  methods: {
    onTabsChange(tab) {
      console.log(tab);
      this.currentTab = tab;
    }
  }
};
</script>
