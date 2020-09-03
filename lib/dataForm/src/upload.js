"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.map");

require("core-js/modules/es.number.constructor");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _utils = _interopRequireDefault(require("../../utils"));

// import upload from "ant-design-vue/lib/upload";
// import "ant-design-vue/lib/upload/style/css";
// import Button from "ant-design-vue/lib/button";
// import "ant-design-vue/lib/button/style/css";
// import message from "ant-design-vue/lib/message";
// import "ant-design-vue/lib/message/style/css";
var _default = {
  name: "DataForm",
  components: {},
  props: {
    name: String,
    action: [String, Function],
    listType: String,
    headers: Object,
    accept: String,
    multiple: Boolean,
    showUploadList: [Boolean, Object],
    buttonText: [Function, String],
    value: [Object, String, Array],
    fileList: [Array],
    method: String,
    directory: Boolean,
    beforeUpload: Function,
    customRequest: Function,
    data: [Object, Function],
    disabled: Boolean,
    previewFile: Function,
    supportServerRender: Boolean,
    withCredentials: Boolean,
    openFileDialogOnClick: Boolean,
    remove: Function,
    transformFile: Function,
    responseUrlField: {
      type: String,
      default: "data.url"
    },
    maxSize: Number,
    dragger: Boolean
  },
  model: {
    prop: "value",
    event: "update"
  },
  data: function data() {
    return {// fileList:[]
    };
  },
  methods: {
    onBeforeUpload: function onBeforeUpload(info) {
      if (this.beforeUpload) {
        return this.beforeUpload(info);
      }

      return this.hasAccept(info, true);
    },
    onChange: function onChange(info) {
      // if (this.hasAccept(info.file)) {
      this.$emit("update", info);
      this.$emit("change", info); // }
    },
    onPreview: function onPreview(info) {
      var url = "";

      if (info.url) {
        url = info.url;
      } else if (info.response) {
        url = _utils.default.getObjData(this.responseUrlField, info.response);
      }

      var listeners = this.$listeners;

      if (!listeners.preview) {
        window.open(url, "new");
      }
    },
    hasAccept: function hasAccept(info, isMessage) {
      if (info.size > this.maxSize) {
        var kb = Math.floor(this.maxSize / 1024);

        if (isMessage) {
          this.$message.error("\u9644\u4EF6\u9650\u5236\u5927\u5C0F\u4E3A\uFF1A".concat(kb, "KB"));
        }

        return false;
      }

      return true;
    }
  },
  render: function render(h) {
    var multiple = this.multiple,
        listType = this.listType,
        buttonText = this.buttonText,
        value = this.value,
        onChange = this.onChange,
        onPreview = this.onPreview,
        onBeforeUpload = this.onBeforeUpload,
        dragger = this.dragger;
    var propsData = this.$options.propsData;
    var listeners = this.$listeners;
    var buttonContent = "上传文件";

    if (buttonText && _utils.default.isFunction(buttonText)) {
      buttonContent = [buttonText()];
      console.log(buttonContent);
    } else if (buttonText) {
      buttonContent = buttonText;
    }

    var button = "";

    if (listType === "picture-card") {
      button = h("span", {
        class: "upload-image-button"
      }, buttonContent);
    } else {
      button = h("a-button", {
        props: {
          icon: "upload"
        }
      }, buttonContent);
    }

    if (value && typeof value === "string") {
      if (multiple) {
        throw new Error("When multiple selection mode, the value should be an Array");
      } else {
        propsData.fileList = [{
          uid: "-1",
          name: "image",
          status: "done",
          url: value
        }];
      }
    } else if (value && value.length) {
      propsData.fileList = value.map(function (item, index) {
        if (typeof item === "string") {
          return {
            uid: "-".concat(index),
            name: "image",
            status: "done",
            url: item
          };
        }

        return item;
      });
    } else if (value && value.fileList) {
      propsData.fileList = value.fileList.map(function (p) {
        if (!p.status) {
          p.status = "error";
        }

        return p;
      });
    }

    if (propsData.fileList && propsData.fileList.length && !this.multiple) {
      button = "";
    }

    var nodeName = dragger === true ? "a-upload-dragger" : "a-upload";
    return h(nodeName, {
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
        beforeUpload: onBeforeUpload
      }),
      on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, listeners), {}, {
        change: onChange,
        preview: onPreview
      })
    }, [button]);
  }
};
exports.default = _default;