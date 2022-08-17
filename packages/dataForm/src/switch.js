import Switch from "ant-design-vue/lib/switch/index";
import utils from "../../utils";
export default {
  name: "OpuSwitch",
  components: {},
  props: {
    ...Switch.props,
    trueValue: {
      type: [String, Boolean, Number],
      default: true
    },
    falseValue: {
      type: [String, Boolean, Number],
      default: false
    },
    checked: [Number, String, Boolean]
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {};
  },
  computed: {
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
  created() {},
  methods: {
    updateValue(value) {
      const { trueValue, falseValue } = this;
      const val = value ? trueValue : falseValue;

      this.$emit("update", val);
      this.$emit("change", val);
    }
  },
  render(h) {
    const { componentProps, $scopedSlots, checked, trueValue } = this;
    return h(
      "a-switch",
      {
        ref: "inputComponent",
        props: {
          ...componentProps.props,
          checked: checked === trueValue ? true : false
        },
        on: {
          ...componentProps.on
        },
        scopedSlots: $scopedSlots
      },
      []
    );
  }
};
