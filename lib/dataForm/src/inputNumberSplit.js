"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _babelHelperVueJsxMergeProps = _interopRequireDefault(require("@vue/babel-helper-vue-jsx-merge-props"));

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _inputNumber = require("ant-design-vue/lib/input-number");

var _default = {
  name: "InputNumberSplit",
  components: {},
  props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _inputNumber.InputNumberProps), {}, {
    value: {
      type: Array
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    startMin: {
      type: Number
    },
    startMax: {
      type: Number
    },
    endMin: {
      type: Number
    },
    endMax: {
      type: Number
    }
  }),
  model: {
    prop: "value",
    event: "update"
  },
  data: function data() {
    return {
      sMin: "",
      sMax: "",
      sValue: "",
      eMin: "",
      eMax: "",
      eValue: ""
    };
  },
  watch: {
    value: function value(val) {
      if (val && val.length) {
        this.sValue = val[0];
      }

      if (val && val.length > 1) {
        this.eValue = val[1];
      }
    }
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
  created: function created() {
    var min = this.min,
        max = this.max,
        startMin = this.startMin,
        startMax = this.startMax,
        endMin = this.endMin,
        endMax = this.endMax;
    this.sMin = startMin ? startMin : min;
    this.sMax = startMax ? startMax : max;
    this.eMin = endMin ? endMin : min;
    this.eMax = endMax ? endMax : max;
  },
  mounted: function mounted() {},
  updated: function updated() {},
  methods: {
    focus: function focus() {
      this.$refs.start.focus();
    },
    onChange: function onChange() {
      var value = [this.sValue, this.eValue];
      this.$emit("updata", value);
      this.$emit("change", value);
    },
    onStartChange: function onStartChange(e) {
      var sMin = this.sMin,
          sMax = this.sMax;

      if (sMin && e < sMin) {
        e = sMin;
      }

      if (sMax && e > sMax) {
        e = sMax;
      }

      if (this.eValue && (e || e == 0) && this.eValue < e) {
        e = this.eValue;
      }

      this.sValue = e;
      this.onChange();
    },
    onEndChange: function onEndChange(e) {
      var eMin = this.eMin,
          eMax = this.eMax;

      if (eMin && e < eMin) {
        e = eMin;
      }

      if (eMax && e > eMax) {
        e = eMax;
      }

      if (this.sValue && (e || e == 0) && this.sValue > e) {
        e = this.sValue;
      }

      this.eValue = e;
      this.onChange();
    }
  },
  render: function render() {
    var _this = this;

    var h = arguments[0];
    var sMin = this.sMin,
        sMax = this.sMax,
        startValue = this.startValue,
        onStartChange = this.onStartChange,
        eMin = this.eMin,
        eMax = this.eMax,
        endValue = this.endValue,
        onEndChange = this.onEndChange;
    var propsData = this.$options.propsData;
    delete propsData.value;
    var start = {
      style: {
        width: "100%"
      },
      ref: "start",
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
        min: sMin,
        max: sMax,
        value: startValue
      }),
      option: {
        initialValue: ""
      },
      on: {
        change: onStartChange,
        pressEnter: function pressEnter() {
          _this.$refs.end.focus();
        }
      }
    };
    var end = {
      style: {
        width: "100%"
      },
      ref: "end",
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
        min: eMin,
        max: eMax,
        value: endValue
      }),
      on: {
        change: onEndChange,
        pressEnter: function pressEnter(e) {
          setTimeout(function () {
            _this.$emit("inputPressEnter", e);
          }, 100);
        }
      }
    };
    return h("div", {
      "class": "input-number-split"
    }, [h("div", {
      "class": "item"
    }, [h("a-input-number", (0, _babelHelperVueJsxMergeProps.default)([{}, start]))]), h("div", {
      "class": "fh"
    }, [" - "]), h("div", {
      "class": "item"
    }, [h("a-input-number", (0, _babelHelperVueJsxMergeProps.default)([{}, end]))])]);
  }
};
exports.default = _default;