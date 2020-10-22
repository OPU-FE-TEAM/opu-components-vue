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
    thumb: {
      type: String,
      default: null
    },
    size: {
      type: [String, Number],
      default: 80
    },
    isLink: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {
    leftRender(h) {
      let { $slots: slots, thumb, size } = this;
      thumb = slots.thumb
        ? slots.thumb
        : thumb
        ? h("img", { attrs: { src: thumb } })
        : "";
      if (thumb) {
        return h(
          "div",
          {
            class: "left thumb",
            style: {
              width: size + "px",
              height: size + "px"
            }
          },
          [thumb]
        );
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
    },
    linkRender(h) {
      let { isLink } = this;
      if (isLink) {
        return h("a-icon", {
          props: {
            type: "right"
          },
          class: "link"
        });
      }
    }
  },
  render(h) {
    const {
      leftRender,
      titleRender,
      valueRender,
      linkRender,
      labelRender,
      border
    } = this;
    return h("div", { class: ["cell", { "cell-border": border }] }, [
      leftRender(h),
      h(
        "div",
        {
          class: "right"
        },
        [
          h("div", { class: "header" }, [
            titleRender(h),
            valueRender(h),
            linkRender(h)
          ]),
          labelRender(h)
        ]
      )
    ]);
  }
};
