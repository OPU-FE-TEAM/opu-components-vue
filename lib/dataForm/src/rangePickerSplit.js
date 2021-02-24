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

var _datePicker = _interopRequireDefault(require("./datePicker"));

var _moment = _interopRequireDefault(require("moment"));

var _default = {
  name: "ARangePickerSplit",
  components: {
    OpuDatePicker: _datePicker.default
  },
  props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _interface.DatePickerProps)()), {}, {
    value: [Number, String, Object, Array],
    min: [String, Object],
    max: [String, Object],
    // 是否限制开始于结束日期选择
    hasLimit: {
      type: Boolean,
      required: false,
      default: true
    }
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
    }
  },
  methods: {
    onChange: function onChange() {
      var value = [this.minDate, this.maxDate];
      this.$emit("updata", value);
      this.$emit("change", value);
    },
    onStartChange: function onStartChange(e) {
      if (this.maxDate && (0, _moment.default)(this.maxDate).isBefore(e)) {
        this.maxDate = e;
      }

      this.minDate = e;
      this.onChange();
    },
    onEndChange: function onEndChange(e) {
      if (this.minDate && !(0, _moment.default)(this.minDate).isBefore(e)) {
        this.minDate = e;
      }

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
    },
    focus: function focus() {
      this.$refs.startDatePicker.focus();
    }
  },
  render: function render(h) {
    var _this = this;

    var hasLimit = this.hasLimit;

    var propsData = _utils.default.clone(this.$options.propsData);

    delete propsData.value;
    var start = {
      ref: "startDatePicker",
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
        allowClear: false
      }),
      style: {
        width: "100%"
      },
      on: {
        change: function change(e) {
          _this.onStartChange(e);
        },
        inputPressEnter: function inputPressEnter() {
          setTimeout(function () {
            _this.$refs.endDatePicker.focus();
          }, 100);
        }
      }
    };

    if (this.startValue) {
      start.props.value = this.startValue;
    }

    var end = {
      ref: "endDatePicker",
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
        allowClear: false
      }),
      style: {
        width: "100%"
      },
      on: {
        change: function change(e) {
          _this.onEndChange(e);
        },
        inputPressEnter: function inputPressEnter(e) {
          _this.$emit("inputPressEnter", e);
        }
      }
    };

    if (this.endValue) {
      end.props.value = this.endValue;
    } // 限制


    if (hasLimit) {
      start.props.disabledDate = function (e) {
        return _this.startDisabledDate(e);
      };

      end.props.disabledDate = function (e) {
        return _this.endDisabledDate(e);
      };
    } else {
      start.scopedSlots = {
        dateRender: function dateRender(current) {
          var outside = false;

          if (_this.maxDate && current) {
            outside = current > _this.maxDate || _this.min && current < _this.min;
          } else if (_this.min || _this.max) {
            outside = current < _this.min || current > _this.max;
          }

          var dateClass = outside ? "outside" : "";
          return h("div", {
            class: ["ant-calendar-date", dateClass]
          }, [current.date()]);
        }
      };
      end.scopedSlots = {
        dateRender: function dateRender(current) {
          var outside = false;

          if (_this.minDate && current) {
            outside = current < _this.minDate || _this.max && current > _this.max;
          } else if (_this.min || _this.max) {
            outside = current < _this.min || current > _this.max;
          }

          var dateClass = outside ? "outside" : "";
          return h("div", {
            class: ["ant-calendar-date", dateClass]
          }, [current.date()]);
        }
      };
    }

    return h("div", {
      "class": "date-range-split"
    }, [h("div", {
      "class": "item"
    }, [h("opu-date-picker", (0, _babelHelperVueJsxMergeProps.default)([{}, start]))]), h("div", {
      "class": "fh"
    }, [" - "]), h("div", {
      "class": "item"
    }, [h("opu-date-picker", (0, _babelHelperVueJsxMergeProps.default)([{}, end]))])]);
  }
};
exports.default = _default;