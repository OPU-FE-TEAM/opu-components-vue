"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _utils = _interopRequireDefault(require("../../utils"));

/**
 * 默认的输入组件
 */
var _default = {
  name: "baseComponent",
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
    return {};
  },
  computed: {
    componentProps: function componentProps() {
      var _this = this;

      var $listeners = this.$listeners,
          $options = this.$options,
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
      return props;
    }
  },
  created: function created() {},
  methods: {
    updateValue: function updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    focus: function focus() {
      var renderName = this.renderName,
          componentProps = this.componentProps;
      var that = this;
      var input = this.$refs.inputComponent;
      input.focus();
      var el = input.$el; // datePicker 获得焦点，弹出选择面板并全选输入框的值

      if (renderName === "a-date-picker") {
        var box = el.getElementsByClassName("ant-calendar-picker-input");

        if (box && box.length) {
          box[0].click();
        }

        setTimeout(function () {
          var input = document.getElementsByClassName("ant-calendar-input");

          if (input && input.length) {
            input[0].selectionStart = 0; // 选中开始位置

            input[0].selectionEnd = input[0].value.length;
            input[0].addEventListener("keyup", function (e) {
              if (e.key === "Enter") {
                e.stopPropagation();
                console.log(666);
                that.$emit("inputPressEnter");
              }
            });

            input[0].oninput = function (e) {
              if (e.target.value && e.inputType !== "deleteContentBackward") {
                var value = e.target.value;
                var dayFh = "-";

                if (componentProps.props && componentProps.props.format) {
                  dayFh = componentProps.props.format.split("")[4];
                }

                if (value.length === 4 && value.indexOf(dayFh) < 0) {
                  // 输入4位不存在-
                  e.target.value = value + dayFh;
                } else if (value.length === 7 && value.indexOf(dayFh) > -1 && value.split(dayFh).length === 2) {
                  // 输入7位不存在两个-
                  e.target.value = value + dayFh;
                }

                if (componentProps.props && componentProps.props.showTime) {
                  // 输入时间
                  var timeFh = ":";

                  if (componentProps.props && componentProps.props.format) {
                    timeFh = componentProps.props.format.split("")[13];
                  }

                  if (value.length === 10 && value.indexOf(" ") < 0) {
                    // 输入10位不存在空格
                    e.target.value = value + " ";
                  } else if (value.length === 13 && value.indexOf(timeFh) < 0) {
                    // 输入13位不存在:
                    e.target.value = value + timeFh;
                  } else if (value.length === 16 && value.indexOf(timeFh) > -1 && value.split(timeFh).length === 2) {
                    // 输入16位不存在两个:
                    e.target.value = value + timeFh;
                  }
                }
              }
            };
          }
        }, 100);
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