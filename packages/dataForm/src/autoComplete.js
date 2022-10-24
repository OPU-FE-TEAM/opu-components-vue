import { AutoCompleteProps } from "ant-design-vue/lib/auto-complete";
import utils from "../../utils";
import config from "../conf";

// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, _vm, pValue = "") {
  const { vF, lF, optionsFilter, value } = _vm;
  if (options && utils.isArray(options)) {
    const cloneOptions = utils.clone(options);
    return cloneOptions.map(item => {
      if (Object.prototype.toString.call(item) === "[object Object]") {
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
  name: "optionsComponent",
  components: {},
  props: {
    ...AutoCompleteProps,
    renderName: {
      type: String,
      default: "a-auto-complete"
    },
    valueField: String,
    labelField: String,
    value: [Number, String, Object, Array],
    options: Array,
    renderOptionLabel: Function
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
      const { $listeners, $options } = this;
      const propsData = $options.propsData;

      const ons = {};
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          this.$emit(type, ...args);
        };
      });
      const props = {
        props: {
          ...propsData
        },
        on: {
          ...ons,
          change: this.updateValue
        }
      };
      return props;
    }
  },
  watch: {
    options(value) {
      this.setOptionsData(value);
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
      this.$emit("update", value);
      this.$emit("change", value);
    },
    setOptionsData(data) {
      this.optionsData = handleItemPropsOptions(data, this);
      return data;
    },
    getOptionsData() {
      return this.optionsData;
    },
    focus() {
      const that = this;
      const inputComponent = this.$refs.inputComponent;
      const el = inputComponent.$el;

      // select获得输入焦点，弹出下拉面板
      const inputDom = el.getElementsByClassName("ant-select-search__field")[0];
      if (inputDom) {
        inputDom.focus && inputDom.focus();
        inputDom.click && inputDom.click();
        inputDom.removeEventListener("keyup", that.onKeyUpEnter);
        inputDom.addEventListener("keyup", that.onKeyUpEnter);
      }
      // if (box && box.length) {
      //   box[0].click();
      // }
    },
    onKeyUpEnter(e) {
      if (e.key === "Enter") {
        e.stopPropagation();
        this.$emit("inputPressEnter", e);
      }
    },
    autoCompleteFilterRender(props) {
      let { vF, lF, optionsData, value, renderOptionLabel } = this;
      let dataSource = [];
      if (props.search) {
        dataSource = props.search(value, optionsData);
      } else {
        const searchFields = props.searchFields || [];
        dataSource = optionsData.filter(p => {
          if (!value) return true;
          let is = false;
          if (Object.prototype.toString.call(p) === "[object Object]") {
            let searchFieldList = [lF, ...searchFields];
            for (let i = 0; i < searchFieldList.length; i++) {
              const key = searchFieldList[i];
              let optionValue = p[key] || p;
              if (value) {
                if (
                  optionValue
                    .toString()
                    .toLowerCase()
                    .indexOf(value.toLowerCase()) >= 0
                ) {
                  is = true;
                  break;
                }
              }
            }
          } else if (
            p
              .toString()
              .toLowerCase()
              .indexOf(value.toLowerCase()) >= 0
          ) {
            is = true;
          }
          return is;
        });
      }

      const selectOptions = dataSource.map(p => {
        return (
          <a-select-option key={p[vF] || p}>
            {(renderOptionLabel && renderOptionLabel(p)) || p[lF] || p}
          </a-select-option>
        );
      });
      return { selectOptions, dataSource };
    }
  },
  render(h) {
    const { componentProps, value, $slots } = this;

    let { selectOptions, dataSource } = this.autoCompleteFilterRender(
      componentProps
    );

    let slots = Object.keys($slots).map(name => (
      <template slot={name}>{$slots[name]}</template>
    ));
    if (!$slots.dataSource) {
      slots.push(<template slot="dataSource">{selectOptions}</template>);
    }
    return h(
      "a-auto-complete",
      {
        ref: "inputComponent",
        props: {
          ...componentProps.props,
          value
        },
        on: {
          ...componentProps.on,
          focus: () => {
            this.focus();
            if (componentProps.on && componentProps.on.focus) {
              componentProps.on.focus();
            }
          },
          select: value => {
            if (componentProps.on && componentProps.on.select) {
              let { vF } = this;
              let row = dataSource.find(p => {
                if (Object.prototype.toString.call(p) === "[object Object]") {
                  return p[vF] == value;
                } else {
                  p == value;
                }
              });
              componentProps.on.select(value, row);
            }
          }
        }
      },
      [slots]
    );
  }
};
