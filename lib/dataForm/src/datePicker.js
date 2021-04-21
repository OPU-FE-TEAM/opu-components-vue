"use strict";

var _interopRequireDefault = require("E:/T/git/\u5965\u666ETeam/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("E:/T/git/\u5965\u666ETeam/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _interface = require("ant-design-vue/lib/date-picker/interface");

var _utils = _interopRequireDefault(require("../../utils"));

// import moment from "moment";
var _default = {
  name: "OpuDatePicker",
  components: {},
  props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _interface.DatePickerProps)()), {}, {
    min: [String, Object],
    max: [String, Object]
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
          $options = this.$options,
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

      var props = {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
          value: value
        }),
        on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, ons), {}, {
          change: this.updateValue,
          openChange: this.onOpenChange
        })
      };

      if (this.min || this.max && !props.props.disabledDate) {
        props.props.disabledDate = function (e) {
          return _this.renderDisabledDate(e);
        };
      }

      return props;
    }
  },
  created: function created() {
    this.focus = _utils.default.throttle(function () {
      this.onFocus();
    }, 100);
  },
  methods: {
    updateValue: function updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    onFocus: function onFocus() {
      var input = this.$refs.inputComponent;
      var el = input.$el; // datePicker 获得焦点，弹出选择面板并全选输入框的值

      var box = el.getElementsByClassName("ant-calendar-picker-input");

      if (box && box.length) {
        var boxDom = box[box.length - 1];
        boxDom.click();
      }

      this.onInputEvent();
    },
    // 监听输入事件
    onInputEvent: function onInputEvent() {
      var componentProps = this.componentProps;
      var that = this;
      setTimeout(function () {
        var input = document.getElementsByClassName("ant-calendar-input");

        if (input && input.length) {
          var inputDom = input[input.length - 1];
          inputDom.selectionStart = 0; // 选中开始位置

          inputDom.selectionEnd = inputDom.value.length;
          inputDom.addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
              e.stopPropagation();
              that.$emit("inputPressEnter", e);
            }
          });

          inputDom.oninput = function (e) {
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
    },
    onOpenChange: function onOpenChange(status) {
      if (status) {
        this.onInputEvent();
      }

      this.$emit("openChange", status);
    },
    renderDisabledDate: function renderDisabledDate(current) {
      if (this.min && current) {
        return current < this.min || this.max && current > this.max;
      } else if (this.min || this.max) {
        return current < this.min || current > this.max;
      }
    }
  },
  render: function render(h) {
    var componentProps = this.componentProps,
        $scopedSlots = this.$scopedSlots;
    return h("a-date-picker", {
      ref: "inputComponent",
      props: (0, _objectSpread2.default)({}, componentProps.props),
      on: (0, _objectSpread2.default)({}, componentProps.on),
      scopedSlots: $scopedSlots
    }, []);
  }
};
exports.default = _default;