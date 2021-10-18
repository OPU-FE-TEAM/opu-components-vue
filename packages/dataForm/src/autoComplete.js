/**
 * 有下拉数据的输入组件
 */
import utils from "../../utils";

export default {
  name: "optionsComponent",
  components: {},
  props: {
    renderName: {
      type: String,
      default: "a-auto-complete"
    },
    value: [Number, String, Object, Array],
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
        optionsData,
        renderName,
        componentPropsData,
        value
      } = this;

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
          ...{ dataSource: optionsData },
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
      const { options } = this;
      if (options && options.length) {
        this.optionsData = options;
      }
    },
    updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },

    setOptionsData(data) {
      this.optionsData = data;
      return data;
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
