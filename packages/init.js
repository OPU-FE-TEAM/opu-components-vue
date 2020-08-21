import DataTable from "./dataTable";
import DataForm from "./dataForm";

// 按需加载的组件
const components = [DataForm, DataTable];

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
export { default as utils } from "./utils";

export default {
  install
};
