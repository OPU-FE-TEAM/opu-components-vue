"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _utils = _interopRequireDefault(require("../../utils"));

var _conf = _interopRequireDefault(require("../conf"));

var _dataForm = require("../../dataForm");

var _default = {
  name: "FormModal",
  components: {
    DataForm: _dataForm.DataForm
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    modal: Object
  },
  data: function data() {
    return {
      visible: false,
      loading: false,
      confirmLoading: false,
      readonly: false,
      title: "",
      items: []
    };
  },
  computed: {
    modalOpt: function modalOpt() {
      var modal = this.modal;
      return modal && modal.props ? (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.modal.props), modal.props) : _conf.default.modal.props;
    },
    formOpt: function formOpt() {
      var form = this.form;
      return form && form.props ? (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.form.props), form.props) : _conf.default.form.props;
    }
  },
  created: function created() {
    this.items = _utils.default.clone(this.formOpt.items, true);
  },
  methods: {
    show: function show(callback, actionType) {
      var _this = this;

      this.loading = true;
      this.visible = true;
      this.confirmLoading = true;
      this.$nextTick(function () {
        var res = "";

        if (callback) {
          res = callback();

          if (res) {
            _this.setFormData(res);
          }
        }

        if (actionType === "add" && !res) {
          _this.loadOptionsData();
        }
      });
    },
    loadOptionsData: function loadOptionsData(data) {
      this.$refs.form && this.$refs.form.loadOptionsData(data);
    },
    setLoading: function setLoading(flag) {
      this.loading = flag;
      this.confirmLoading = flag;
    },
    setFormData: function setFormData(data) {
      this.loadOptionsData(data);
      this.$refs.form && this.$refs.form.setData(data);
      this.loading = false;
      this.confirmLoading = false;
    },
    onCancel: function onCancel() {
      this.confirmLoading = false;
      this.visible = false;
      this.$emit("cancel");
    },
    onSubmit: function onSubmit() {
      var _this2 = this;

      this.confirmLoading = true;
      this.$refs.form.validateFields().then(function (values) {
        _this2.$emit("submit", values);
      }).catch(function () {
        _this2.confirmLoading = false;
      });
    },
    setConfirmLoading: function setConfirmLoading(flag) {
      this.confirmLoading = flag;
    },
    setReadonly: function setReadonly(flag) {
      this.readonly = flag;
    },
    setTitle: function setTitle(title) {
      this.title = title;
    },
    setItems: function setItems(items) {
      this.items = items;
    }
  },
  render: function render(h) {
    var modalOpt = this.modalOpt,
        formOpt = this.formOpt,
        visible = this.visible,
        onSubmit = this.onSubmit,
        onCancel = this.onCancel,
        loading = this.loading,
        confirmLoading = this.confirmLoading,
        $scopedSlots = this.$scopedSlots,
        readonly = this.readonly,
        title = this.title,
        items = this.items; //TODO 自动以footer 增加 loading状态

    var modalProps = {
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({
        width: 800
      }, modalOpt), {}, {
        title: title ? title : modalOpt.title,
        confirmLoading: confirmLoading,
        visible: visible
      }),
      on: {
        cancel: onCancel,
        ok: onSubmit
      },
      class: "crud-table-form-modal"
    };

    if (readonly) {
      modalProps.props.okButtonProps = {
        style: {
          display: "none"
        }
      };
    }

    var formProps = {
      ref: "form",
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, formOpt), {}, {
        items: items,
        readonly: readonly
      }),
      class: "crud-table-form",
      scopedSlots: $scopedSlots
    };
    return h("a-modal", modalProps, [h("a-spin", {
      props: {
        spinning: loading
      }
    }, [h("data-form", formProps)])]);
  }
};
exports.default = _default;