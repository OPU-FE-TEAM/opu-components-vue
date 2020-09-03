"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default2 = {
  name: "custom",
  components: {},
  props: {
    customRender: {
      type: Function,
      default: function _default() {
        return [];
      }
    },
    value: [Number, String, Object, Array]
  },
  model: {
    prop: "value",
    event: "update"
  },
  methods: {
    updateValue: function updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    }
  },
  render: function render(h) {
    var customRender = this.customRender,
        value = this.value;
    var contentDom = [customRender(value, this.updateValue)];
    return h("div", {
      class: "data-form-custom"
    }, [].concat(contentDom));
  }
};
exports.default = _default2;