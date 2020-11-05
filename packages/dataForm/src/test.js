export default {
  name: "test",
  components: {},
  props: {
    api: {
      type: Function,
      default: () => []
    },
    value: [Number, String, Object, Array]
  },
  model: {
    prop: "value",
    event: "update"
  },
  created() {
    console.log(this.api);
    // if (this.api) {
    //   this.fetchOptionsData();
    // }
  },
  methods: {
    updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    fetchOptionsData() {
      this.api(this.param).then(res => {
        console.log(res);
      });
    }
  },
  render(h) {
    // const { customRender, value } = this;
    // const contentDom = [customRender(value, this.updateValue)];
    return h(
      "div",
      {
        class: "data-form-test"
      },
      ["666"]
    );
  }
};
