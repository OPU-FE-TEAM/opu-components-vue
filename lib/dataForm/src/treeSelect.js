"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _interface = require("ant-design-vue/lib/tree-select/interface");

var _utils = _interopRequireDefault(require("../../utils"));

var _default = {
  name: "optionsComponent",
  components: {},
  props: (0, _objectSpread2.default)({}, (0, _interface.TreeSelectProps)()),
  model: {
    prop: "value",
    event: "update"
  },
  data: function data() {
    return {
      optionsData: []
    };
  },
  computed: {
    componentProps: function componentProps() {
      var _this = this;

      var $listeners = this.$listeners,
          $options = this.$options,
          optionsData = this.optionsData;
      var propsData = $options.propsData;
      var ons = {};

      _utils.default.each($listeners, function (cb, type) {
        ons[type] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this.$emit.apply(_this, [type].concat(args));
        };
      });

      var props = {
        props: (0, _objectSpread2.default)({}, propsData),
        on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, ons), {}, {
          change: this.updateValue
        })
      };
      props.props.treeData = optionsData;
      return props;
    }
  },
  created: function created() {
    this.optionsData = this.treeData;
  },
  methods: {
    updateValue: function updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    setOptionsData: function setOptionsData(data) {
      this.optionsData = data;
      return data;
    },
    getOptionsData: function getOptionsData() {
      return this.optionsData;
    },
    focus: function focus() {
      var input = this.$refs.inputComponent;
      input.focus();
    }
  },
  render: function render(h) {
    var componentProps = this.componentProps;
    return h("a-tree-select", {
      ref: "inputComponent",
      props: (0, _objectSpread2.default)({}, componentProps.props),
      on: (0, _objectSpread2.default)({}, componentProps.on)
    }, []);
  }
};
exports.default = _default;