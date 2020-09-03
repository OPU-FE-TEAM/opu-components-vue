export default {
  name: "scopedSlots",
  components: {},
  props: {
    fieldName: String,
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
    const { value, $scopedSlots, updateValue, fieldName } = this;
    return h(
      "div",
      {
        class: "data-form-scopedSlots"
      },
      [$scopedSlots.default(value, updateValue, fieldName)]
    );
  }
};
