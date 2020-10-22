"use strict";

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
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
  data: function data() {
    return {};
  },
  methods: {
    leftRender: function leftRender(h) {
      var slots = this.$slots,
          thumb = this.thumb,
          size = this.size;
      thumb = slots.thumb ? slots.thumb : thumb ? h("img", {
        attrs: {
          src: thumb
        }
      }) : "";

      if (thumb) {
        return h("div", {
          class: "left thumb",
          style: {
            width: size + "px",
            height: size + "px"
          }
        }, [thumb]);
      }
    },
    titleRender: function titleRender(h) {
      var slots = this.$slots,
          title = this.title;
      title = slots.title ? slots.title : title;

      if (title) {
        return h("div", {
          class: "title"
        }, [title]);
      }
    },
    valueRender: function valueRender(h) {
      var slots = this.$slots,
          value = this.value;
      value = slots.default ? slots.default : value;

      if (value) {
        return h("div", {
          class: "value"
        }, [value]);
      }
    },
    labelRender: function labelRender(h) {
      var slots = this.$slots,
          label = this.label;
      label = slots.label ? slots.label : label;

      if (label) {
        return h("div", {
          class: "label"
        }, [label]);
      }
    },
    linkRender: function linkRender(h) {
      var isLink = this.isLink;

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
  render: function render(h) {
    var leftRender = this.leftRender,
        titleRender = this.titleRender,
        valueRender = this.valueRender,
        linkRender = this.linkRender,
        labelRender = this.labelRender,
        border = this.border;
    return h("div", {
      class: ["cell", {
        "cell-border": border
      }]
    }, [leftRender(h), h("div", {
      class: "right"
    }, [h("div", {
      class: "header"
    }, [titleRender(h), valueRender(h), linkRender(h)]), labelRender(h)])]);
  }
};
exports.default = _default;