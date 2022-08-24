import DataTable from "./dataTable";
import DataForm from "./dataForm";
import CrudTable from "./crudTable";
import Cell from "./cell";
import PageWraper from "./pageWraper";
import PulldownTable from "./pulldownTable";
import CascaderEx from "./dataForm/src/extend/cascader";
import Modal from "./modal";

const cellGroup = Cell.Group;
// 按需加载的组件
const components = [
  DataForm,
  DataTable,
  CrudTable,
  Cell,
  cellGroup,
  PageWraper,
  PulldownTable,
  CascaderEx,
  Modal
];

// 默认安装
function install(Vue) {
  // 判断是否安装
  if (install.installed) return;
  // 遍历注册全局组件
  components.map(component => Vue.component(component.name, component));
}

if (typeof window !== "undefined" && window.Vue && window.Vue.use) {
  install(window.Vue);
}

export * from "./dataForm";
export * from "./dataTable";
export * from "./dataTable/src/setColumns";
export * from "./crudTable";
export * from "./cell";
export * from "./pageWraper";
export * from "./pulldownTable";
export * from "./modal";

export { default as utils } from "./utils";
export default {
  install
};
