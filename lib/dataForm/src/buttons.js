"use strict";

var _interopRequireDefault = require("D:/demo/vue-npm-template/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("D:/demo/vue-npm-template/node_modules/@babel/runtime/helpers/esm/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("D:/demo/vue-npm-template/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _button = _interopRequireDefault(require("ant-design-vue/lib/button"));

require("ant-design-vue/lib/button/style/css");

function renderButtons(children, h, _vm) {
  var onClick = _vm.onClick;
  return children ? children.map(function (item, index) {
    var buttonText = item.props && item.props.content ? item.props.content : "";

    if (buttonText && typeof buttonText === "function") {
      buttonText = [buttonText()];
    }

    var props = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, item), {}, {
      key: index
    });

    if (item.props.action) {
      props.on = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, item.on), {}, {
        click: function click() {
          onClick(item);
        }
      });
    }

    return h('a-button', props, buttonText);
  }) : [];
}

var _default2 = {
  name: 'DataForm',
  components: (0, _defineProperty2.default)({}, _button.default.name, _button.default),
  props: {
    children: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    itemClick: {
      type: Function,
      default: function _default() {}
    }
  },
  methods: {
    onClick: function onClick(item) {
      var itemClick = this.itemClick;

      if (item && item.props && item.props.action) {
        itemClick && itemClick(item.props.action);
      }
    }
  },
  render: function render(h) {
    var children = this.children;
    return h("div", {
      class: "data-form-buttons"
    }, [].concat(renderButtons(children, h, this)));
  }
};
exports.default = _default2;