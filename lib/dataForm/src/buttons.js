"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

function renderButtons(items, h, _vm) {
  var onClick = _vm.onClick;
  return items ? items.map(function (item, index) {
    var buttonText = item.props && item.props.content ? item.props.content : "";

    if (buttonText && typeof buttonText === "function") {
      buttonText = [buttonText()];
    }

    var props = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, item), {}, {
      key: index
    });

    if (item.props.action) {
      props.on = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, item.on), {}, {
        click: function click(e) {
          onClick(item, e);
        }
      });
    }

    return h("a-button", props, buttonText);
  }) : [];
}

var _default2 = {
  name: "DataForm",
  components: {},
  props: {
    items: {
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
    onClick: function onClick(item, e) {
      var itemClick = this.itemClick;

      if (item && item.props && item.props.action) {
        itemClick && itemClick(item.props.action, e);
      }
    }
  },
  render: function render(h) {
    var items = this.items;
    return h("div", {
      class: "data-form-buttons"
    }, [].concat(renderButtons(items, h, this)));
  }
};
exports.default = _default2;