import { SelectProps } from "ant-design-vue/lib/select/index";
import utils from "../../utils";
import config from "../conf";

// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, _vm) {
  const { vF, lF } = _vm;
  if (options && utils.isArray(options)) {
    const cloneOptions = utils.clone(options);
    return cloneOptions.map(item => {
      if (vF) {
        item.value = item[vF] + "";
      }
      if (lF) {
        item.label = item[lF];
      }
      if (item.children && item.children.length) {
        item.children = handleItemPropsOptions(item.children, _vm);
      }
      return item;
    });
  }
  return options;
}

export default {
  name: "OpuSelect",
  components: {},
  props: {
    ...SelectProps,
    value: [Number, String, Object, Array],
    valueField: String,
    labelField: String,
    dataField: String,
    options: Array,
    searchFields: {
      type: Array,
      default: () => []
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      optionsData: []
    };
  },
  computed: {
    vF() {
      return this.valueField
        ? this.valueField
        : config.getSelectOptions.valueField;
    },
    lF() {
      return this.labelField
        ? this.labelField
        : config.getSelectOptions.labelField;
    },
    componentProps() {
      const {
        $listeners,
        $options,
        optionsData,
        value,
        searchFields,
        vF,
        lF
      } = this;
      const propsData = $options.propsData;

      const ons = {};
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          this.$emit(type, ...args);
        };
      });
      let currentValue = value;
      if (value && utils.isNumber(value)) {
        currentValue = value + "";
      } else if (value && utils.isArray(value)) {
        currentValue = value.map(p => p + "");
      }
      const props = {
        props: {
          ...propsData,
          value: currentValue
        },
        on: {
          ...ons,
          change: this.updateValue
        }
      };

      if (props.props.showSearch && !props.props.filterOption) {
        props.props.filterOption = (input, option) => {
          const value = option.componentOptions.propsData.value;
          const objIndex = optionsData.findIndex(
            item => item[vF].toString() === value
          );
          const obj = optionsData[objIndex];
          let is = false;
          const searchFieldList = [vF, lF, ...searchFields];
          for (let i = 0; i < searchFieldList.length; i++) {
            const key = searchFieldList[i];
            if (obj[key]) {
              if (
                obj[key]
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              ) {
                is = true;
                break;
              }
            }
          }
          return is;
        };
      }

      props.props.options = optionsData;

      return props;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { valueField, labelField, options } = this;
      if (options && options.length) {
        this.optionsData = handleItemPropsOptions(
          options,
          valueField,
          labelField
        );
      }
    },
    updateValue(value) {
      const { vF, optionsData } = this;
      // const vF = valueField ? valueField : config.getSelectOptions.valueField;
      const row = optionsData.find(p => p[vF] == value);
      this.$emit("update", value, row);
      this.$emit("change", value, row);
    },

    setOptionsData(data) {
      // const { valueField, labelField } = this;
      const options = handleItemPropsOptions(data, this);
      this.optionsData = options;
      return options;
    },
    getOptionsData() {
      return this.optionsData;
    },
    focus() {
      const input = this.$refs.inputComponent;
      input.focus();
      const el = input.$el;
      // select获得输入焦点，弹出下拉面板
      const box = el.getElementsByClassName("ant-select-selection__rendered");
      if (box && box.length) {
        box[0].click();
      }
    }
  },
  render(h) {
    const { componentProps } = this;
    return h(
      "a-select",
      {
        ref: "inputComponent",
        props: {
          ...componentProps.props
        },
        on: {
          ...componentProps.on
        }
      },
      []
    );
  }
};
