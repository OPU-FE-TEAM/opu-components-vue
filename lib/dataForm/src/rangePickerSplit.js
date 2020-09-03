"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _babelHelperVueJsxMergeProps = _interopRequireDefault(require("@vue/babel-helper-vue-jsx-merge-props"));

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _interface = require("ant-design-vue/lib/date-picker/interface");

var _utils = _interopRequireDefault(require("../../utils"));

var _default = {
  name: "ARangePickerSplit",
  components: {},
  props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _interface.DatePickerProps)()), {}, {
    value: [Number, String, Object, Array],
    min: [String, Object],
    max: [String, Object]
  }),
  model: {
    prop: "value",
    event: "update"
  },
  data: function data() {
    return {
      data: [],
      minDate: "",
      maxDate: ""
    };
  },
  computed: {
    startValue: function startValue() {
      var start = "";

      if (this.value && this.value.length) {
        start = this.value[0];
      }

      return start;
    },
    endValue: function endValue() {
      var end = "";

      if (this.value && this.value.length > 1) {
        end = this.value[1];
      }

      return end;
    }
  },
  watch: {
    value: function value(val) {
      console.log(val);

      if (val && val.length) {
        this.minDate = val[0];
      }

      if (val && val.length > 1) {
        this.maxDate = val[1];
      }
    }
  },
  created: function created() {
    if (this.value && this.value.length) {
      this.minDate = this.value[0];
    }

    if (this.value && this.value.length > 1) {
      this.maxDate = this.value[1];
    } // this.min = this.min ? this.min : "";
    // this.max = this.max ? this.max : "";

  },
  methods: {
    onChange: function onChange() {
      // this.cvalue = value;
      var value = [this.minDate, this.maxDate]; // if (this.minDate) {
      //   value.push(this.minDate);
      // }
      // if (this.maxDate) {
      //   value.push(this.maxDate);
      // }

      this.$emit("updata", value);
      this.$emit("change", value);
    },
    onStartChange: function onStartChange(e) {
      this.minDate = e;
      this.onChange();
    },
    onEndChange: function onEndChange(e) {
      this.maxDate = e;
      this.onChange();
    },
    startDisabledDate: function startDisabledDate(current) {
      if (this.maxDate && current) {
        return current > this.maxDate || this.min && current < this.min;
      } else if (this.min || this.max) {
        return current < this.min || current > this.max;
      }
    },
    endDisabledDate: function endDisabledDate(current) {
      if (this.minDate && current) {
        return current < this.minDate || this.max && current > this.max;
      } else if (this.min || this.max) {
        return current < this.min || current > this.max;
      }
    }
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];

    var propsData = _utils.default.clone(this.$options.propsData);

    delete propsData.value;
    var start = {
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
        allowClear: false,
        disabledDate: function disabledDate(e) {
          return _this.startDisabledDate(e);
        }
      }),
      style: {
        width: "100%"
      },
      on: {
        change: function change(e) {
          _this.onStartChange(e);
        }
      }
    };

    if (this.startValue) {
      start.props.value = this.startValue;
    }

    var end = {
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
        allowClear: false,
        disabledDate: function disabledDate(e) {
          return _this.endDisabledDate(e);
        }
      }),
      style: {
        width: "100%"
      },
      on: {
        change: function change(e) {
          _this.onEndChange(e);
        }
      }
    };

    if (this.endValue) {
      end.props.value = this.endValue;
    }

    return h("div", {
      "class": "date-range-split"
    }, [h("div", {
      "class": "item"
    }, [h("a-date-picker", (0, _babelHelperVueJsxMergeProps.default)([{}, start]))]), h("div", {
      "class": "fh"
    }, [" - "]), h("div", {
      "class": "item"
    }, [h("a-date-picker", (0, _babelHelperVueJsxMergeProps.default)([{}, end]))])]);
  }
};
exports.default = _default;