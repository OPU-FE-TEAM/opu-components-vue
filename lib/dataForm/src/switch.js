"use strict";

var _interopRequireDefault = require("E:/T/git/\u5965\u666ETeam/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("E:/T/git/\u5965\u666ETeam/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _index = _interopRequireDefault(require("ant-design-vue/lib/switch/index"));

var _utils = _interopRequireDefault(require("../../utils"));

var _default = {
  name: "OpuSwitch",
  components: {},
  props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _index.default.props), {}, {
    trueValue: {
      type: [String, Boolean, Number],
      default: true
    },
    falseValue: {
      type: [String, Boolean, Number],
      default: false
    },
    checked: [Number, String, Boolean]
  }),
  model: {
    prop: "value",
    event: "update"
  },
  data: function data() {
    return {};
  },
  computed: {
    componentProps: function componentProps() {
      var _this = this;

      var $listeners = this.$listeners,
          $options = this.$options;
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
      return props;
    }
  },
  created: function created() {},
  methods: {
    updateValue: function updateValue(value) {
      var trueValue = this.trueValue,
          falseValue = this.falseValue;
      var val = value ? trueValue : falseValue;
      this.$emit("update", val);
      this.$emit("change", val);
    }
  },
  render: function render(h) {
    var componentProps = this.componentProps,
        $scopedSlots = this.$scopedSlots,
        checked = this.checked,
        trueValue = this.trueValue;
    componentProps.props.checked = checked === trueValue ? true : false;
    return h("a-switch", {
      ref: "inputComponent",
      props: (0, _objectSpread2.default)({}, componentProps.props),
      on: (0, _objectSpread2.default)({}, componentProps.on),
      scopedSlots: $scopedSlots
    }, []);
  }
};
exports.default = _default;