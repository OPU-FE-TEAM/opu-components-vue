"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.find-index");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _index = require("ant-design-vue/lib/select/index");

var _utils = _interopRequireDefault(require("../../utils"));

var _conf = _interopRequireDefault(require("../conf"));

// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, _vm) {
  var vF = _vm.vF,
      lF = _vm.lF;

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
        item.children = handleItemPropsOptions(item.children, _vm);
      }

      return item;
    });
  }

  return options;
}

var _default2 = {
  name: "OpuSelect",
  components: {},
  props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _index.SelectProps), {}, {
    value: [Number, String, Object, Array],
    valueField: String,
    labelField: String,
    dataField: String,
    options: Array,
    searchFields: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  }),
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
    vF: function vF() {
      return this.valueField ? this.valueField : _conf.default.getSelectOptions.valueField;
    },
    lF: function lF() {
      return this.labelField ? this.labelField : _conf.default.getSelectOptions.labelField;
    },
    componentProps: function componentProps() {
      var _this = this;

      var $listeners = this.$listeners,
          $options = this.$options,
          optionsData = this.optionsData,
          value = this.value,
          searchFields = this.searchFields,
          vF = this.vF,
          lF = this.lF;
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
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
          value: currentValue
        }),
        on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, ons), {}, {
          change: this.updateValue
        })
      };

      if (props.props.showSearch && !props.props.filterOption) {
        props.props.filterOption = function (input, option) {
          var value = option.componentOptions.propsData.value;
          var objIndex = optionsData.findIndex(function (item) {
            return item[vF].toString() === value;
          });
          var obj = optionsData[objIndex];
          var is = false;
          var searchFieldList = [vF, lF].concat((0, _toConsumableArray2.default)(searchFields));

          for (var i = 0; i < searchFieldList.length; i++) {
            var key = searchFieldList[i];

            if (obj[key]) {
              if (obj[key].toString().toLowerCase().indexOf(input.toLowerCase()) >= 0) {
                is = true;
                break;
              }
            }
          }

          return is;
        };
      }

      props.props.options = optionsData;
      console.log(optionsData);
      return props;
    }
  },
  created: function created() {
    this.init();
  },
  methods: {
    init: function init() {
      var options = this.options;

      if (options && options.length) {
        console.log(this.vF);
        this.optionsData = handleItemPropsOptions(options, this);
      }
    },
    updateValue: function updateValue(value) {
      var vF = this.vF,
          optionsData = this.optionsData; // const vF = valueField ? valueField : config.getSelectOptions.valueField;

      var row = optionsData.find(function (p) {
        return p[vF] == value;
      });
      this.$emit("update", value, row);
      this.$emit("change", value, row);
    },
    setOptionsData: function setOptionsData(data) {
      // const { valueField, labelField } = this;
      var options = handleItemPropsOptions(data, this);
      this.optionsData = options;
      return options;
    },
    getOptionsData: function getOptionsData() {
      return this.optionsData;
    },
    focus: function focus() {
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
    var componentProps = this.componentProps;
    return h("a-select", {
      ref: "inputComponent",
      props: (0, _objectSpread2.default)({}, componentProps.props),
      on: (0, _objectSpread2.default)({}, componentProps.on)
    }, []);
  }
};
exports.default = _default2;