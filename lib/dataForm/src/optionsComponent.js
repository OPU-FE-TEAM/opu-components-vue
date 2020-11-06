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

// const valueArrayTypes = ["a-checkbox-group", "a-radio-group", "a-select"];
// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, valueField, labelField) {
  var vF = valueField ? valueField : _conf.default.getSelectOptions.valueField;
  var lF = labelField ? labelField : _conf.default.getSelectOptions.labelField;

  if (options && _utils.default.isArray(options)) {
    var cloneOptions = _utils.default.clone(options);

    return cloneOptions.map(function (item) {
      if (vF) {
        item.value = item[vF];
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

var _default2 = {
  name: "optionsComponent",
  components: {},
  props: {
    renderName: {
      type: String,
      default: "a-input"
    },
    api: Function,
    param: {
      type: Object,
      default: function _default() {}
    },
    value: [Number, String, Object, Array],
    valueField: String,
    labelField: String,
    dataField: String,
    options: Array
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
          renderName = this.renderName;
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

      if (renderName === "a-tree-select") {
        props.props.treeData = optionsData;
      } else {
        props.props.options = optionsData;
      }

      return props;
    }
  },
  watch: {
    api: function api() {
      this.init();
    },
    param: function param() {
      this.init();
    }
  },
  created: function created() {
    this.init();
  },
  methods: {
    init: function init() {
      var api = this.api,
          param = this.param,
          valueField = this.valueField,
          labelField = this.labelField,
          fetchOptionsData = this.fetchOptionsData,
          options = this.options;

      if (api || param) {
        fetchOptionsData();
      } else if (options && options.length) {
        this.optionsData = handleItemPropsOptions(options, valueField, labelField);
      }
    },
    updateValue: function updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    fetchOptionsData: function fetchOptionsData() {
      var _this2 = this;

      var dataField = this.dataField,
          valueField = this.valueField,
          labelField = this.labelField,
          param = this.param,
          api = this.api;
      var fetchApi = api ? api : _conf.default.getSelectOptions.api;
      fetchApi(param).then(function (res) {
        // const vF = valueField ? valueField : config.getSelectOptions.valueField;
        // const lF = labelField ? labelField : config.getSelectOptions.labelField;
        var dF = dataField ? dataField : _conf.default.getSelectOptions.dataField;

        var data = _utils.default.getObjData(dF, res);

        var options = handleItemPropsOptions(data, valueField, labelField);
        _this2.optionsData = options;
      });
    },
    setOptionsData: function setOptionsData(data) {
      this.optionsData = data;
    }
  },
  render: function render(h) {
    var renderName = this.renderName,
        componentProps = this.componentProps;
    return h(renderName, {
      props: (0, _objectSpread2.default)({}, componentProps.props),
      on: (0, _objectSpread2.default)({}, componentProps.on)
    }, []);
  }
};
exports.default = _default2;