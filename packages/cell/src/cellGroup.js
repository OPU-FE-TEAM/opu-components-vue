export default {
  name: "CellGroup",
  components: {},
  props: {
    title: {
      type: String,
      default: ""
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {},
  methods: {},
  render(h) {
    const { $slots: slots, title } = this;
    const groupDom = h("div", { class: "cell-group" }, slots.default);
    if (title || slots.title) {
      return h("div", [
        h(
          "div",
          {
            class: "group-title"
          },
          [slots.title ? slots.title : title]
        ),
        groupDom
      ]);
    }
    return groupDom;
  }
};
