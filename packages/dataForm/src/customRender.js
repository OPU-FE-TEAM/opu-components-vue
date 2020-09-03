export default {
  name: "custom",
  components: {},
  props: {
    customRender: {
      type: Function,
      default: () => []
    },
    value: [Number, String, Object, Array]
  },
  model: {
    prop: "value",
    event: "update"
  },
  methods: {
    updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    }
  },
  render(h) {
    const { customRender, value } = this;
    const contentDom = [customRender(value, this.updateValue)];
    return h(
      "div",
      {
        class: "data-form-custom"
      },
      [].concat(contentDom)
    );
  }
};
