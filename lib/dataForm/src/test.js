"use strict";

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default2 = {
  name: "test",
  components: {},
  props: {
    api: {
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
  created: function created() {
    console.log(this.api); // if (this.api) {
    //   this.fetchOptionsData();
    // }
  },
  methods: {
    updateValue: function updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    fetchOptionsData: function fetchOptionsData() {
      this.api(this.param).then(function (res) {
        console.log(res);
      });
    }
  },
  render: function render(h) {
    // const { customRender, value } = this;
    // const contentDom = [customRender(value, this.updateValue)];
    return h("div", {
      class: "data-form-test"
    }, ["666"]);
  }
};
exports.default = _default2;