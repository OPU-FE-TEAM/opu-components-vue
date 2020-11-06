import utils from "../../utils";
import config from "../conf";
// const valueArrayTypes = ["a-checkbox-group", "a-radio-group", "a-select"];

// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, valueField, labelField) {
  const vF = valueField ? valueField : config.getSelectOptions.valueField;
  const lF = labelField ? labelField : config.getSelectOptions.labelField;
  if (options && utils.isArray(options)) {
    const cloneOptions = utils.clone(options);
    return cloneOptions.map(item => {
      if (vF) {
        item.value = item[vF];
      }
      if (lF) {
        item.label = item[lF];
      }
      if (item.children && item.children.length) {
        item.children = handleItemPropsOptions(item.children, vF, lF);
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
    dataField: String,
    options: Array
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
      return props;
    }
  },
  // watch: {
  //   api() {
  //     this.init();
  //   },
  //   param() {
  //     this.init();
  //   }
  // },
  created() {
    this.init();
  },
  methods: {
    init() {
      const {
        api,
        param,
        valueField,
        labelField,
        // fetchOptionsData,
        options
      } = this;
      if (api || param) {
        // fetchOptionsData();
      } else if (options && options.length) {
        this.optionsData = handleItemPropsOptions(
          options,
          valueField,
          labelField
        );
      }
    },
    updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    fetchOptionsData() {
      const { dataField, valueField, labelField, param, api } = this;
      const fetchApi = api ? api : config.getSelectOptions.api;
      fetchApi(param).then(res => {
        const dF = dataField ? dataField : config.getSelectOptions.dataField;
        const data = utils.getObjData(dF, res);
        const options = handleItemPropsOptions(data, valueField, labelField);
        this.optionsData = options;
      });
    },
    setOptionsData(data) {
      const { valueField, labelField } = this;
      const options = handleItemPropsOptions(data, valueField, labelField);
      this.optionsData = options;
      return options;
    },
    getOptionsData() {
      return this.optionsData;
    }
  },
  render(h) {
    const { renderName, componentProps } = this;
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
