import dataForm from "./src/dataForm";
import setup from "./conf/setup";
dataForm.install = function(Vue) {
  Vue.component(dataForm.name, dataForm);
};
dataForm.setup = setup;
export const DataForm = dataForm;
export default dataForm;
