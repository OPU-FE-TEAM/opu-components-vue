import pulldownTable from "./src/pulldownTable";

pulldownTable.install = function(Vue) {
  Vue.component(pulldownTable.name, pulldownTable);
};
export const PulldownTable = pulldownTable;
export default pulldownTable;
