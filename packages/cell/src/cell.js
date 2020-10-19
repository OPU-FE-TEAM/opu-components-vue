export default {
  name: "cell",
  components: {},
  props: {
    title: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    thumb: {}
    // isLink: {
    //   type: Boolean
    // }
  },
  data() {
    return {};
  },
  methods: {
    leftRender(h) {
      let { $slots: slots, thumb } = this;
      thumb = slots.thumb
        ? slots.thumb
        : thumb
        ? h("img", { attrs: { src: thumb } })
        : "";
      if (thumb) {
        return h("div", { class: "left thumb" }, [thumb]);
      }
    },
    titleRender(h) {
      let { $slots: slots, title } = this;
      title = slots.title ? slots.title : title;
      if (title) {
        return h(
          "div",
          {
            class: "title"
          },
          [title]
        );
      }
    },
    valueRender(h) {
      let { $slots: slots, value } = this;
      value = slots.default ? slots.default : value;
      if (value) {
        return h(
          "div",
          {
            class: "value"
          },
          [value]
        );
      }
    },
    labelRender(h) {
      let { $slots: slots, label } = this;
      label = slots.label ? slots.label : label;
      if (label) {
        return h(
          "div",
          {
            class: "label"
          },
          [label]
        );
      }
    }
  },
  render(h) {
    const { leftRender, titleRender, valueRender, labelRender } = this;
    return h("div", { class: "cell" }, [
      leftRender(h),
      h(
        "div",
        {
          class: "right"
        },
        [
          h("div", { class: "header" }, [titleRender(h), valueRender(h)]),
          labelRender(h)
        ]
      )
    ]);
  }
};
