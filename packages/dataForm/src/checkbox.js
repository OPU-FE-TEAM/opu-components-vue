import Checkbox from "ant-design-vue/lib/checkbox/index";
import utils from "../../utils";
export default {
  name: "OpuCheckbox",
  components: {},
  props: {
    ...Checkbox.props,
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
  methods: {
    updateValue(e) {
      const { checked } = e.target;
      const { trueValue, falseValue } = this;
      const val = checked ? trueValue : falseValue;
      this.$emit("update", val);
      this.$emit("change", val);
    }
  },
  render(h) {
    const { componentProps, $scopedSlots, checked, trueValue } = this;
    componentProps.props.checked = checked === trueValue ? true : false;
    return h(
      "a-checkbox",
      {
        ref: "inputComponent",
        props: {
          ...componentProps.props
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
