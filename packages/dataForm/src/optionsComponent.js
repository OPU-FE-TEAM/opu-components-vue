/**
 * 有下拉数据的输入组件
 */
import utils from "../../utils";
import config from "../conf";

// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(
  options,
  valueField,
  labelField,
  childrenField = "children"
) {
  const vF = valueField ? valueField : config.getSelectOptions.valueField;
  const lF = labelField ? labelField : config.getSelectOptions.labelField;
  if (options && utils.isArray(options)) {
    const cloneOptions = utils.clone(options);
    return cloneOptions.map(item => {
      if (!utils.isObject(item)) {
        return item;
      }
      if (vF) {
        item.value = item[vF] + "";
      }
      if (lF) {
        item.label = item[lF];
      }
      if (item[childrenField] && item[childrenField].length) {
        item.children = handleItemPropsOptions(
          item[childrenField],
          vF,
          lF,
          childrenField
        );
      }
      return item;
    });
  }
  return options;
}

export default {
  name: "optionsComponent",
  components: {},
  props: {
    renderName: {
      type: String,
      default: "a-input"
    },
    value: [Number, String, Object, Array],
    valueField: String,
    labelField: String,
    childrenField: String,
    dataField: String,
    options: Array,
    componentPropsData: Object
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
    componentProps() {
      const {
        $listeners,
        $options,
        optionsData,
        renderName,
        componentPropsData,
        value
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
          ...componentPropsData,
          ...propsData,
          value: currentValue
        },
        on: {
          ...ons,
          change: this.updateValue
        }
      };
      if (renderName === "a-tree-select") {
        props.props.treeData = optionsData;
      } else {
        props.props.options = optionsData;
      }
      return props;
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { valueField, labelField, options, childrenField } = this;
      if (options && options.length) {
        this.optionsData = handleItemPropsOptions(
          options,
          valueField,
          labelField,
          childrenField
        );
      }
    },
    updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },

    setOptionsData(data) {
      const { valueField, labelField, childrenField } = this;
      const options = handleItemPropsOptions(
        data,
        valueField,
        labelField,
        childrenField
      );
      this.optionsData = options;
      return options;
    },
    getOptionsData() {
      return this.optionsData;
    },
    focus() {
      // const that = this;
      const input = this.$refs.inputComponent;
      input.focus();
      // const el = input.$el;
      // // select获得输入焦点，弹出下拉面板
      // const box = el.getElementsByClassName("ant-select-selection__rendered");
      // if (box && box.length) {
      //   box[0].click();
      // }
    }
  },
  render(h) {
    const { renderName, componentProps } = this;
    return h(
      renderName,
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
