import { SelectProps } from "ant-design-vue/lib/select/index";
import utils from "../../utils";
import config from "../conf";

// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, _vm, pValue = "") {
  const { vF, lF, childrenField } = _vm;
  if (options && utils.isArray(options)) {
    const cloneOptions = utils.clone(options);
    return cloneOptions.map(item => {
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
  return options;
}

export default {
  name: "OpuSelectGroup",
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
    childrenField: String
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      optionsData: [],
      hasGroup: false,
      cloneOptionsData: []
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
        value
        // searchFields,
        // vF,
        // lF,
        // childrenField
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
      console.log(propsData);
      const props = {
        props: {
          ...propsData,
          value: currentValue
        },
        on: {
          ...ons,
          change: this.updateValue,
          search: this.onSearch
        }
      };

      if (props.props.showSearch) {
        props.props.filterOption = false;
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
      const { options } = this;
      if (options && options.length) {
        this.optionsData = handleItemPropsOptions(options, this);
        this.cloneOptionsData = this.optionsData;
      }
    },
    updateValue(value) {
      const { vF, optionsData, childrenField } = this;
      const optionsList = utils.treeTransArray(optionsData, childrenField);
      const row = optionsList.find(p => p[vF] == value);
      let pRow = "";
      if (row && row._pValue) {
        pRow = optionsList.find(p => p[vF] == row._pValue);
      }
      this.$emit("update", value, row, pRow);
      this.$emit("change", value, row, pRow);
    },

    setOptionsData(data) {
      const options = handleItemPropsOptions(data, this);
      this.optionsData = options;
      this.cloneOptionsData = this.optionsData;
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
    },
    renderOptGroup(h) {
      const { childrenField, optionsData } = this;
      if (this.childrenField) {
        return optionsData.map(group => {
          let options = "";
          if (group[childrenField] && group[childrenField].length) {
            options = group[childrenField].map(p => {
              return h("a-select-option", { props: { value: p.value } }, [
                p.label
              ]);
            });
            return h(
              "a-select-opt-group",
              { props: { label: group.label, key: group.value } },
              [options]
            );
          }
          return h("a-select-option", { props: { value: group.value } }, [
            group.label
          ]);
        });
      }
      return "";
    },
    onSearch(value) {
      const { cloneOptionsData, vF, lF, searchFields, childrenField } = this;
      const newData = utils.clone(cloneOptionsData, true);
      if (value) {
        const keyword = value.toLowerCase();
        const searchFieldList = [vF, lF, ...searchFields];

        const data = newData
          .map(item => {
            if (item[childrenField] && item[childrenField].length) {
              const children = item[childrenField].filter(p => {
                let is = false;
                for (let i = 0; i < searchFieldList.length; i++) {
                  const key = searchFieldList[i];
                  if (p[key]) {
                    if (
                      p[key]
                        .toString()
                        .toLowerCase()
                        .indexOf(keyword) >= 0
                    ) {
                      is = true;
                      break;
                    }
                  }
                }
                return is;
              });
              if (children && children.length) {
                item[childrenField] = children;
                return item;
              }
            }
            let is = false;
            for (let i = 0; i < searchFieldList.length; i++) {
              const key = searchFieldList[i];
              if (item[key]) {
                if (
                  item[key]
                    .toString()
                    .toLowerCase()
                    .indexOf(keyword) >= 0
                ) {
                  is = true;
                  break;
                }
              }
            }
            if (is) {
              return item;
            } else {
              return "";
            }
          })
          .filter(p => p !== "");
        this.optionsData = data;
      } else {
        this.optionsData = newData;
      }
    }
  },
  render(h) {
    const { componentProps, renderOptGroup } = this;
    const optGroup = renderOptGroup(h);
    if (optGroup) {
      componentProps.props.options = null;
    }
    console.log(this.optionsData);
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
      [optGroup]
    );
  }
};
