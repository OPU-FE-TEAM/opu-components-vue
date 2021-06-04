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

var _index = require("ant-design-vue/lib/time-picker/index");

var _utils = _interopRequireDefault(require("../../utils"));

var _default = {
  name: "OpuTimePicker",
  components: {},
  props: (0, _objectSpread2.default)({}, (0, _index.TimePickerProps)()),
  model: {
    prop: "value",
    event: "update"
  },
  data: function data() {
    return {
      isOpen: false
    };
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
      var el = input.$el; // timePicker 获得焦点，弹出选择面板并全选输入框的值

      var box = el.getElementsByClassName("ant-time-picker-input");

      if (box && box.length) {
        box[0].click();
      }

      this.onInputEvent();
    },
    // 监听输入事件
    onInputEvent: function onInputEvent() {
      var componentProps = this.componentProps;
      var that = this;
      setTimeout(function () {
        var input = document.getElementsByClassName("ant-time-picker-panel-input");

        if (input && input.length) {
          input[0].selectionStart = 0; // 选中开始位置

          input[0].selectionEnd = input[0].value.length;
          input[0].addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
              e.stopPropagation();
              that.isOpen = false;
              that.$emit("inputPressEnter", e);
            }
          });

          input[0].oninput = function (e) {
            if (e.target.value && e.inputType !== "deleteContentBackward") {
              var value = e.target.value; // 输入时间

              var timeFh = ":";

              if (componentProps.props && componentProps.props.format) {
                timeFh = componentProps.props.format.split("")[3];
              }

              if (value.length === 2 && value.indexOf(timeFh) < 0) {
                // 输入2位不存在:
                e.target.value = value + timeFh;
              } else if (value.length === 5 && value.indexOf(timeFh) > -1 && value.split(timeFh).length === 2) {
                // 输入5位不存在两个:
                e.target.value = value + timeFh;
              }
            }
          };
        }
      }, 100);
    },
    onOpenChange: function onOpenChange(status) {
      this.isOpen = status;

      if (status) {
        this.onInputEvent();
      }

      this.$emit("openChange", status);
    }
  },
  render: function render(h) {
    var componentProps = this.componentProps,
        $scopedSlots = this.$scopedSlots,
        isOpen = this.isOpen;
    return h("a-time-picker", {
      ref: "inputComponent",
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, componentProps.props), {}, {
        open: isOpen
      }),
      on: (0, _objectSpread2.default)({}, componentProps.on),
      scopedSlots: $scopedSlots
    }, []);
  }
};
exports.default = _default;