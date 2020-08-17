
import AInput from "ant-design-vue/es/input";
import "ant-design-vue/lib/input/style/css";

import ASelect from "ant-design-vue/lib/select";
import "ant-design-vue/lib/select/style/css";

import ANumber from "ant-design-vue/lib/input-number";
import "ant-design-vue/lib/input-number/style/css";

import ACheckbox from "ant-design-vue/lib/checkbox";
import "ant-design-vue/lib/checkbox/style/css";

import ARadio from "ant-design-vue/lib/radio";
import "ant-design-vue/lib/radio/style/css";

import ADatePicker from "ant-design-vue/lib/date-picker";
import "ant-design-vue/lib/date-picker/style/css";

import ASwitch from "ant-design-vue/lib/switch";
import "ant-design-vue/lib/switch/style/css";

import ARate from "ant-design-vue/lib/rate";
import "ant-design-vue/lib/rate/style/css";

import ASlider from "ant-design-vue/lib/slider";
import "ant-design-vue/lib/slider/style/css";

import ACascader from "ant-design-vue/lib/cascader";
import "ant-design-vue/lib/cascader/style/css";

import ATreeSelect from "ant-design-vue/lib/tree-select";
import "ant-design-vue/lib/tree-select/style/css";

import AUpload from "./upload";
// import "ant-design-vue/lib/upload/style/css";

import AButtons from './buttons'
import ACustomRender from './customRender'
import AScopedSlots from './scopedSlots'


export default {
    AButtons,
    ACustomRender,
    AScopedSlots,
    AInput,
    APassword:AInput.Password,
    ATextarea:AInput.TextArea,
    ANumber,
    ASelect,
    ACheckbox,
    ACheckboxGroup:ACheckbox.Group,
    ARadioGroup:ARadio.Group,
    ADatePicker,
    AMonthPicker:ADatePicker.MonthPicker,
    ARangePicker:ADatePicker.RangePicker,
    AWeekPicker:ADatePicker.WeekPicker,
    ASwitch,
    ARate,
    ASlider,
    ACascader,
    ATreeSelect,
    AUpload


    
};
