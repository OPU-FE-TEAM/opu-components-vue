"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find");

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
  var pValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var vF = _vm.vF,
      lF = _vm.lF,
      childrenField = _vm.childrenField;

  if (options && _utils.default.isArray(options)) {
    var cloneOptions = _utils.default.clone(options);

    return cloneOptions.map(function (item) {
      if (vF) {
        item.value = item[vF] + "";
      }

      if (lF) {
        item.label = item[lF];
      }

      if (pValue) {
        item._pValue = pValue;
      }

      if (item[childrenField] && item[childrenField].length) {
        item[childrenField] = handleItemPropsOptions(item[childrenField], _vm, item.value);
      }

      return item;
    });
  }

  return options;
}

var _default2 = {
  name: "OpuSelectGroup",
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
    },
    childrenField: String
  }),
  model: {
    prop: "value",
    event: "update"
  },
  data: function data() {
    return {
      optionsData: [],
      hasGroup: false,
      cloneOptionsData: []
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
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
          value: currentValue
        }),
        on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, ons), {}, {
          change: this.updateValue,
          search: this.onSearch
        })
      };

      if (props.props.showSearch) {
        props.props.filterOption = false;
      }

      props.props.options = optionsData;
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
        this.optionsData = handleItemPropsOptions(options, this);
        this.cloneOptionsData = this.optionsData;
      }
    },
    updateValue: function updateValue(value) {
      var vF = this.vF,
          optionsData = this.optionsData,
          childrenField = this.childrenField;

      var optionsList = _utils.default.treeTransArray(optionsData, childrenField);

      var row = optionsList.find(function (p) {
        return p[vF] == value;
      });
      var pRow = "";

      if (row && row._pValue) {
        pRow = optionsList.find(function (p) {
          return p[vF] == row._pValue;
        });
      }

      this.$emit("update", value, row, pRow);
      this.$emit("change", value, row, pRow);
    },
    setOptionsData: function setOptionsData(data) {
      var options = handleItemPropsOptions(data, this);
      this.optionsData = options;
      this.cloneOptionsData = this.optionsData;
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
    },
    renderOptGroup: function renderOptGroup(h) {
      var childrenField = this.childrenField,
          optionsData = this.optionsData;

      if (this.childrenField) {
        return optionsData.map(function (group) {
          var options = "";

          if (group[childrenField] && group[childrenField].length) {
            options = group[childrenField].map(function (p) {
              return h("a-select-option", {
                props: {
                  value: p.value
                }
              }, [p.label]);
            });
            return h("a-select-opt-group", {
              props: {
                label: group.label,
                key: group.value
              }
            }, [options]);
          }

          return h("a-select-option", {
            props: {
              value: group.value
            }
          }, [group.label]);
        });
      }

      return "";
    },
    onSearch: function onSearch(value) {
      var cloneOptionsData = this.cloneOptionsData,
          vF = this.vF,
          lF = this.lF,
          searchFields = this.searchFields,
          childrenField = this.childrenField;

      var newData = _utils.default.clone(cloneOptionsData, true);

      if (value) {
        var keyword = value.toLowerCase();
        var searchFieldList = [vF, lF].concat((0, _toConsumableArray2.default)(searchFields));
        var data = newData.map(function (item) {
          if (item[childrenField] && item[childrenField].length) {
            var children = item[childrenField].filter(function (p) {
              var is = false;

              for (var i = 0; i < searchFieldList.length; i++) {
                var key = searchFieldList[i];

                if (p[key]) {
                  if (p[key].toString().toLowerCase().indexOf(keyword) >= 0) {
                    is = true;
                    break;
                  }
                }
              }

              return is;
            });

            if (children && children.length) {
              item[childrenField] = children;
              return item;
            }
          }

          var is = false;

          for (var i = 0; i < searchFieldList.length; i++) {
            var key = searchFieldList[i];

            if (item[key]) {
              if (item[key].toString().toLowerCase().indexOf(keyword) >= 0) {
                is = true;
                break;
              }
            }
          }

          if (is) {
            return item;
          } else {
            return "";
          }
        }).filter(function (p) {
          return p !== "";
        });
        this.optionsData = data;
      } else {
        this.optionsData = newData;
      }
    }
  },
  render: function render(h) {
    var componentProps = this.componentProps,
        renderOptGroup = this.renderOptGroup;
    var optGroup = renderOptGroup(h);

    if (optGroup) {
      componentProps.props.options = null;
    }

    return h("a-select", {
      ref: "inputComponent",
      props: (0, _objectSpread2.default)({}, componentProps.props),
      on: (0, _objectSpread2.default)({}, componentProps.on)
    }, [optGroup]);
  }
};
exports.default = _default2;