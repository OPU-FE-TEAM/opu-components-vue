import utils from "../../utils";
import config from "../conf";
import { DataForm } from "../../dataForm";

export default {
  name: "FormModal",
  components: {
    DataForm
  },
  props: {
    form: {
      type: Object,
      required: true
    },
    modal: Object
  },
  data() {
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
    modalOpt() {
      const { modal } = this;
      return modal && modal.props
        ? { ...config.modal.props, ...modal.props }
        : config.modal.props;
    },
    formOpt() {
      const { form } = this;
      return form && form.props
        ? { ...config.form.props, ...form.props }
        : config.form.props;
    }
  },
  created() {
    this.items = utils.clone(this.formOpt.items, true);
  },
  methods: {
    show(callback) {
      this.loading = true;
      this.visible = true;
      this.confirmLoading = true;
      this.$nextTick(() => {
        if (callback) {
          const res = callback();
          if (res) {
            this.setFormData(res);
          }
        }
      });
    },
    setLoading(flag) {
      this.loading = flag;
      this.confirmLoading = flag;
    },
    setFormData(data) {
      this.$refs.form && this.$refs.form.setData(data);
      this.loading = false;
      this.confirmLoading = false;
    },
    onCancel() {
      this.confirmLoading = false;
      this.visible = false;
      this.$emit("cancel");
    },
    onSubmit() {
      this.confirmLoading = true;
      this.$refs.form
        .validateFields()
        .then(values => {
          this.$emit("submit", values);
        })
        .catch(() => {
          this.confirmLoading = false;
        });
    },
    setConfirmLoading(flag) {
      this.confirmLoading = flag;
    },
    setReadonly(flag) {
      this.readonly = flag;
    },
    setTitle(title) {
      this.title = title;
    },
    setItems(items) {
      this.items = items;
    }
  },
  render(h) {
    const {
      modalOpt,
      formOpt,
      visible,
      onSubmit,
      onCancel,
      loading,
      confirmLoading,
      $scopedSlots,
      readonly,
      title,
      items
    } = this;
    //TODO 自动以footer 增加 loading状态
    const modalProps = {
      props: {
        width: 800,
        ...modalOpt,
        title: title ? title : modalOpt.title,
        confirmLoading: confirmLoading,
        visible: visible
      },
      on: {
        cancel: onCancel,
        ok: onSubmit
      },
      class: "crud-table-form-modal"
    };
    if (readonly) {
      modalProps.props.okButtonProps = {
        style: { display: "none" }
      };
    }

    const formProps = {
      ref: "form",
      props: {
        ...formOpt,
        items,
        readonly
      },
      class: "crud-table-form",
      scopedSlots: $scopedSlots
    };
    return h("a-modal", modalProps, [
      h("a-spin", { props: { spinning: loading } }, [h("data-form", formProps)])
    ]);
  }
};
