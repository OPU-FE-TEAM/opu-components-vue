import dataForm from "./src/dataForm";
import selectGroup from "./src/selectGroup";
import select from "./src/select";
import upload from "./src/upload";
import rangePickerSplit from "./src/rangePickerSplit";

import setup from "./conf/setup";
dataForm.install = function(Vue) {
  Vue.component(dataForm.name, dataForm);
};
dataForm.setup = setup;
dataForm.selectGroup = selectGroup;
dataForm.select = select;
dataForm.upload = upload;
dataForm.rangePickerSplit = rangePickerSplit;

export const DataForm = dataForm;

export default dataForm;
