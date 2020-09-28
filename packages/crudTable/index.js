import crudTable from "./src/crudTable";
import setup from "./conf/setup";
crudTable.install = function(Vue) {
  Vue.component(crudTable.name, crudTable);
};
crudTable.setup = setup;
export const CrudTable = crudTable;
export default crudTable;
