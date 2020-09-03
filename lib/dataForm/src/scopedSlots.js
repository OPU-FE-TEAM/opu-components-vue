"use strict";

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
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
    updateValue: function updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    }
  },
  render: function render(h) {
    var value = this.value,
        $scopedSlots = this.$scopedSlots,
        updateValue = this.updateValue,
        fieldName = this.fieldName;
    return h("div", {
      class: "data-form-scopedSlots"
    }, [$scopedSlots.default(value, updateValue, fieldName)]);
  }
};
exports.default = _default;