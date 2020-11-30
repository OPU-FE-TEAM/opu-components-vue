"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.map");

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _utils = _interopRequireDefault(require("../../utils"));

var _conf = _interopRequireDefault(require("../conf"));

/**
 * 有下拉数据的输入组件
 */
// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, valueField, labelField) {
  var vF = valueField ? valueField : _conf.default.getSelectOptions.valueField;
  var lF = labelField ? labelField : _conf.default.getSelectOptions.labelField;

  if (options && _utils.default.isArray(options)) {
    var cloneOptions = _utils.default.clone(options);

    return cloneOptions.map(function (item) {
      if (vF) {
        item.value = item[vF] + "";
      }

      if (lF) {
        item.label = item[lF];
      }

      if (item.children && item.children.length) {
        item.children = handleItemPropsOptions(item.children, vF, lF);
      }

      return item;
    });
  }

  return options;
}

var _default = {
  name: "optionsComponent",
  components: {},
  props: {
    renderName: {
      type: String,
      default: "a-input"
    },
    value: [Number, String, Object, Array],
    valueField: String,
    labelField: String,
    dataField: String,
    options: Array,
    componentPropsData: Object
  },
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
          optionsData = this.optionsData,
          renderName = this.renderName,
          componentPropsData = this.componentPropsData,
          value = this.value;
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

      var currentValue = value;

      if (value && _utils.default.isNumber(value)) {
        currentValue = value + "";
      } else if (value && _utils.default.isArray(value)) {
        currentValue = value.map(function (p) {
          return p + "";
        });
      }

      var props = {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, componentPropsData), propsData), {}, {
          value: currentValue
        }),
        on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, ons), {}, {
          change: this.updateValue
        })
      };

      if (renderName === "a-tree-select") {
        props.props.treeData = optionsData;
      } else {
        props.props.options = optionsData;
      }

      return props;
    }
  },
  created: function created() {
    this.init();
  },
  methods: {
    init: function init() {
      var valueField = this.valueField,
          labelField = this.labelField,
          options = this.options;

      if (options && options.length) {
        this.optionsData = handleItemPropsOptions(options, valueField, labelField);
      }
    },
    updateValue: function updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    setOptionsData: function setOptionsData(data) {
      var valueField = this.valueField,
          labelField = this.labelField;
      var options = handleItemPropsOptions(data, valueField, labelField);
      this.optionsData = options;
      return options;
    },
    getOptionsData: function getOptionsData() {
      return this.optionsData;
    },
    focus: function focus() {
      // const that = this;
      var input = this.$refs.inputComponent;
      input.focus();
      var el = input.$el; // select获得输入焦点，弹出下拉面板

      var box = el.getElementsByClassName("ant-select-selection__rendered");

      if (box && box.length) {
        box[0].click();
      }
    }
  },
  render: function render(h) {
    var renderName = this.renderName,
        componentProps = this.componentProps;
    return h(renderName, {
      ref: "inputComponent",
      props: (0, _objectSpread2.default)({}, componentProps.props),
      on: (0, _objectSpread2.default)({}, componentProps.on)
    }, []);
  }
};
exports.default = _default;