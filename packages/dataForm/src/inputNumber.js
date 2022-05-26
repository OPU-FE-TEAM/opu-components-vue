import { InputNumberProps } from "ant-design-vue/lib/input-number";
export default {
  name: "InputNumber",
  components: {},
  props: {
    ...InputNumberProps,
    value: {
      type: [String, Number]
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  updated() {},
  methods: {
    focus() {
      this.$refs.inputNumber.focus();
    },
    select() {
      setTimeout(() => {
        this.$refs.inputNumber.$refs.inputNumberRef.$refs.inputRef.select();
      }, 50);
    }
  },
  render() {
    let propsData = this.$options.propsData;
    let props = {
      style: { width: "100%" },
      ref: "inputNumber",
      props: {
        ...propsData
      },
      on: {
        change: value => {
          this.$emit("update", value);
          this.$emit("change", value);
        },
        pressEnter: e => {
          this.$emit("inputPressEnter", e);
        }
      }
    };

    return <a-input-number {...props} />;
  }
};
