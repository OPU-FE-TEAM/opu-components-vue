"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
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
  data: function data() {
    return {};
  },
  watch: {},
  computed: {},
  created: function created() {},
  methods: {},
  render: function render(h) {
    var slots = this.$slots,
        title = this.title,
        border = this.border;
    var groupDom = h("div", {
      class: {
        "cell-group": true,
        "group-border": border
      }
    }, slots.default);

    if (title || slots.title) {
      return h("div", [h("div", {
        class: {
          "group-title": true
        }
      }, [slots.title ? slots.title : title]), groupDom]);
    }

    return groupDom;
  }
};
exports.default = _default;