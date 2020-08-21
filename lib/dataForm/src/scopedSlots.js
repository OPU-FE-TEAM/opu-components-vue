"use strict";

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  name: 'scopedSlots',
  components: {},
  props: {
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
    var value = this.value,
        $scopedSlots = this.$scopedSlots,
        updateValue = this.updateValue;
    return h("div", {
      class: "data-form-scopedSlots"
    }, [$scopedSlots.default(value, updateValue)]);
  }
};
exports.default = _default;