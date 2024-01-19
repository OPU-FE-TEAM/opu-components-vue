import { SelectProps } from "ant-design-vue/lib/select/index";
import utils from "../../utils";
import config from "../conf";

// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, _vm, pValue = "") {
  const { vF, lF, childrenField, optionsFilter, value } = _vm;
  if (options && utils.isArray(options)) {
    const cloneOptions = utils.clone(options);
    return cloneOptions.map(item => {
      if (item.value && vF != "value" && !item[config.originalValueKey]) {
        item[config.originalValueKey] = item.value;
      }
      if (vF) {
        item.value = item[vF] + "";
      }
      if (lF) {
        item.label = item[lF];
      }
      if (pValue) {
        item._pValue = pValue;
      }
      if (item[childrenField] && item[childrenField].length) {
        item[childrenField] = handleItemPropsOptions(
          item[childrenField],
          _vm,
          item.value
        );
      }
      return item;
    });
  }
  if (optionsFilter) {
    options = optionsFilter(options, value);
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
    },
    childrenField: String,
    renderOptionLabel: Function,
    optionsFilter: Function
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      optionsData: [],
      hasGroup: false
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
          // getPopupContainer: triggerNode => triggerNode.parentNode
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
          let searchFieldList = [lF, ...searchFields];
          // vF,
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
  watch: {
    options() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { options } = this;
      if (options && options.length) {
        this.optionsData = handleItemPropsOptions(options, this);
      }
    },
    updateValue(value) {
      const { vF, optionsData, childrenField } = this;
      const optionsList = utils.treeTransArray(optionsData, childrenField);
      if (value instanceof Array) {
        let rows = [];
        for (let i = 0; i < value.length; i++) {
          let item = value[i];
          for (let j = 0; j < optionsList.length; j++) {
            if (optionsList[j][vF] == item) {
              rows.push(optionsList[j]);
              break;
            }
          }
        }
        this.$emit("update", value, rows);
        this.$emit("change", value, rows);
      } else {
        const row = optionsList.find(p => p[vF] == value);
        let pRow;
        if (row && row._pValue) {
          pRow = optionsList.find(p => p[vF] == row._pValue);
        }
        this.$emit("update", value, row, pRow);
        this.$emit("change", value, row, pRow);
      }
    },
    setOptionsData(data) {
      const options = handleItemPropsOptions(data, this);
      this.optionsData = options;
      return options;
    },
    getOptionsData() {
      return this.optionsData;
    },
    focus() {
      const input = this.$refs.inputComponent;
      if (input) {
        input.focus && input.focus();
        const el = input.$el;
        if (el) {
          // select获得输入焦点，弹出下拉面板
          const box = el.getElementsByClassName(
            "ant-select-selection__rendered"
          );
          if (box && box.length) {
            box[0].click();
          }
        }
      }
    },
    renderOptGroup(h) {
      const { childrenField, optionsData, renderOptionLabel } = this;
      if (this.childrenField) {
        return optionsData.map(group => {
          let options = "";
          if (group[childrenField] && group[childrenField].length) {
            options = group[childrenField].map(p => {
              const label = renderOptionLabel(p);
              return h(
                "a-select-option",
                { props: { value: p.value, disabled: p.disabled } },
                [label]
              );
            });
            return h(
              "a-select-opt-group",
              {
                props: {
                  label: group.label,
                  key: group.value,
                  disabled: group.disabled
                }
              },
              [options]
            );
          }
          return h(
            "a-select-option",
            { props: { value: group.value, disabled: group.disabled } },
            [group.label]
          );
        });
      }
      return "";
    },
    renderOptionItems(h) {
      const { optionsData, renderOptionLabel } = this;
      return optionsData.map(item => {
        const label = renderOptionLabel(item);
        return h(
          "a-select-option",
          { props: { value: item.value, disabled: item.disabled } },
          [label]
        );
      });
    }
  },
  render(h) {
    const {
      componentProps,
      renderOptGroup,
      renderOptionLabel,
      renderOptionItems
    } = this;
    const optGroup = renderOptGroup(h);
    let optionItems = "";
    if (optGroup) {
      componentProps.props.options = null;
    } else if (renderOptionLabel && utils.isFunction(renderOptionLabel)) {
      optionItems = renderOptionItems(h);
      componentProps.props.options = null;
    }

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
      [optGroup, optionItems]
    );
  }
};
