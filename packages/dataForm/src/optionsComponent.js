import utils from "../../utils";
import config from "../conf";
// const valueArrayTypes = ["a-checkbox-group", "a-radio-group", "a-select"];

// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, valueField, labelField) {
  // const { options, valueField, labelField } = props;
  if ((valueField || labelField) && options && utils.isArray(options)) {
    const cloneOptions = utils.clone(options);
    return cloneOptions.map(item => {
      if (valueField) {
        item.value = item[valueField];
      }
      // debugger;
      if (labelField) {
        item.label = item[labelField];
      }
      if (item.children && item.children.length) {
        item.children = handleItemPropsOptions(
          item.children,
          valueField,
          labelField
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
    api: Function,
    param: {
      type: Object,
      default: () => {}
    },
    value: [Number, String, Object, Array],
    valueField: String,
    labelField: String,
    dataField: String
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
      const { $listeners, $options, optionsData, renderName } = this;
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
      if (renderName === "a-tree-select") {
        props.props.treeData = optionsData;
      } else {
        props.props.options = optionsData;
      }
      console.log(renderName, optionsData);
      return props;
    }
  },
  created() {
    // console.log(this.api, this.param, this.renderName);
    if (this.api || this.param) {
      this.fetchOptionsData();
    }
  },
  methods: {
    updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    fetchOptionsData() {
      const { dataField, valueField, labelField, param, api } = this;
      const fetchApi = api ? api : config.getSelectOptions.api;
      fetchApi(param).then(res => {
        const vF = valueField ? valueField : config.getSelectOptions.valueField;
        const lF = labelField ? labelField : config.getSelectOptions.labelField;
        const dF = dataField ? dataField : config.getSelectOptions.dataField;
        const data = utils.getObjData(dF, res);
        const options = handleItemPropsOptions(data, vF, lF);
        this.optionsData = options;
      });
    },
    setOptionsData(data) {
      this.optionsData = data;
    }
  },
  render(h) {
    const { renderName, componentProps } = this;
    // console.log(componentProps);
    // const props = {};
    // const contentDom = [customRender(value, this.updateValue)];
    return h(
      renderName,
      {
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
