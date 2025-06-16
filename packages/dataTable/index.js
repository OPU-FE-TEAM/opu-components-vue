import Vue from "vue";
import dataTable from "./src/dataTable";
import VXETable from "vxe-table";
import setup from "./conf/setup";

import VXETablePluginAntd from "vxe-table-plugin-antd";
import "vxe-table-plugin-antd/dist/style.css";
VXETable.use(VXETablePluginAntd);
Vue.use(VXETable);
Vue.prototype.$modal = VXETable.modal;

// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
// Vue.use(Antd);

dataTable.setupConfig = setup;
dataTable.install = function(Vue) {
  Vue.component(dataTable.name, dataTable);
};
dataTable.use = VXETable.use;

export const DataTable = dataTable;
export default dataTable;
