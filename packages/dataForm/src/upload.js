// import upload from "ant-design-vue/lib/upload";
// import "ant-design-vue/lib/upload/style/css";

// import Button from "ant-design-vue/lib/button";
// import "ant-design-vue/lib/button/style/css";

// import message from "ant-design-vue/lib/message";
// import "ant-design-vue/lib/message/style/css";

import utils from "../../utils";

export default {
  name: "Upload",
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
  data() {
    return {
      // fileList:[]
    };
  },
  methods: {
    onBeforeUpload(info) {
      if (this.beforeUpload) {
        return this.beforeUpload(info);
      }
      return this.hasAccept(info, true);
    },
    onChange(info) {
      this.$emit("update", info);
      this.$emit("change", info);
      // }
    },
    onPreview(info) {
      let url = "";
      if (info.url) {
        url = info.url;
      } else if (info.response) {
        url = utils.getObjData(this.responseUrlField, info.response);
      }
      const listeners = this.$listeners;
      if (!listeners.preview) {
        window.open(url, "new");
      } else {
        this.$emit("preview", info);
      }
    },
    hasAccept(info, isMessage) {
      if (info.size > this.maxSize) {
        const kb = Math.floor(this.maxSize / 1024);
        if (isMessage) {
          this.$message.error(`附件限制大小为：${kb}KB`);
        }
        return false;
      }
      return true;
    }
  },
  render(h) {
    const {
      multiple,
      listType,
      buttonText,
      value,
      onChange,
      onPreview,
      action,
      onBeforeUpload,
      dragger
    } = this;
    const propsData = this.$options.propsData;
    const listeners = this.$listeners;
    let buttonContent = "上传文件";
    if (buttonText && utils.isFunction(buttonText)) {
      buttonContent = [buttonText()];
    } else if (buttonText) {
      buttonContent = buttonText;
    }
    let button = "";
    if (listType === "picture-card") {
      button = h(
        "span",
        {
          class: "upload-image-button"
        },
        buttonContent
      );
    } else {
      button = h(
        "a-button",
        {
          props: {
            icon: "upload"
          }
        },
        buttonContent
      );
    }
    if (value && typeof value === "string") {
      if (multiple) {
        throw new Error(
          "When multiple selection mode, the value should be an Array"
        );
      } else {
        propsData.fileList = [
          {
            uid: "-1",
            name: "image",
            status: "done",
            url: value
          }
        ];
      }
    } else if (value && value.length) {
      propsData.fileList = value.map((item, index) => {
        if (typeof item === "string") {
          return {
            uid: `-${index}`,
            name: "image",
            status: "done",
            url: item
          };
        }
        return item;
      });
    } else if (value && value.fileList) {
      propsData.fileList = value.fileList.map(p => {
        if (action && !p.status) {
          p.status = "error";
        }
        return p;
      });
    }
    if (propsData.fileList && propsData.fileList.length && !this.multiple) {
      button = "";
    }

    const nodeName = dragger === true ? "a-upload-dragger" : "a-upload";

    return h(
      nodeName,
      {
        props: {
          ...propsData,
          beforeUpload: onBeforeUpload
        },
        on: {
          ...listeners,
          change: onChange,
          preview: onPreview
        }
      },
      [button]
    );
  }
};
