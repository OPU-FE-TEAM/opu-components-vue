import dataForm from "./src/dataForm";
import selectGroup from "./src/selectGroup";
import select from "./src/select";
import upload from "./src/upload";
import rangePickerSplit from "./src/rangePickerSplit";
import inputNumberSplit from "./src/inputNumberSplit";
import datePicker from "./src/datePicker";
import timePicker from "./src/timePicker";
import checkbox from "./src/checkbox";
import treeSelect from "./src/treeSelect";

import setup from "./conf/setup";
dataForm.install = function(Vue) {
  Vue.component(dataForm.name, dataForm);
};
dataForm.setup = setup;
dataForm.selectGroup = selectGroup;
dataForm.select = select;
dataForm.upload = upload;
dataForm.rangePickerSplit = rangePickerSplit;
dataForm.inputNumberSplit = inputNumberSplit;
dataForm.datePicker = datePicker;
dataForm.timePicker = timePicker;
dataForm.checkbox = checkbox;
dataForm.treeSelect = treeSelect;

export const DataForm = dataForm;

export default dataForm;
