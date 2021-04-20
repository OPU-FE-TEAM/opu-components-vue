"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _extends2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/extends"));

var _vue = _interopRequireDefault(require("vue"));

var _Modal = _interopRequireDefault(require("./Modal.vue"));

var Constructor = _vue.default.extend(_Modal.default);

var ActionModal = function ActionModal(options) {
  if (_vue.default.prototype.$isServer) return;
  var rest = (0, _extends2.default)({}, options);
  var instance = new Constructor({
    propsData: (0, _objectSpread2.default)({}, rest)
  });
  var id = "form-action-modal";
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true; //绑定 change 方法

  instance.vm.$on("submit", function (data) {
    if (instance.submit) {
      instance.submit(data);
    }
  });
  instance.vm.$on("destroy", function () {
    document.body.removeChild(instance.vm.$el);
  });
  return instance.vm;
};

var _default = ActionModal;
exports.default = _default;