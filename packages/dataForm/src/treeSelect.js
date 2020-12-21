import { TreeSelectProps } from "ant-design-vue/lib/tree-select/interface";
import utils from "../../utils";

export default {
  name: "optionsComponent",
  components: {},
  props: {
    ...TreeSelectProps()
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
      const { $listeners, $options, optionsData } = this;
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
      props.props.treeData = optionsData;
      return props;
    }
  },
  created() {
    this.optionsData = this.treeData;
  },
  methods: {
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
      const input = this.$refs.inputComponent;
      input.focus();
    }
  },
  render(h) {
    const { componentProps } = this;
    return h(
      "a-tree-select",
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
