import crudTable from "./src/crudTable";
import setup from "./conf/setup";
crudTable.install = function(Vue) {
  Vue.component(crudTable.name, crudTable);
};
crudTable.setupConfig = setup;
export const CrudTable = crudTable;
export default crudTable;
