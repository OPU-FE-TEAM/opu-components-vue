<script>
import utils from "../../../utils";
import { DataForm } from "../../index";
export default {
  components: {
    "data-form": DataForm
  },
  props: {
    modalProps: {
      type: Object,
      default: () => {}
    },
    content: [Function],
    form: {
      type: Object,
      default: () => {}
    },
    slots: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: true,
      confirmLoading: false
    };
  },
  methods: {
    onSubmit() {
      const { form, $refs } = this;
      if (form && form.props && form.props.items) {
        this.confirmLoading = true;
        $refs.dataFrom
          .validateFields()
          .then(values => {
            if (form.on && form.on.submit) {
              const submitRes = form.on.submit(values);
              if (submitRes === false) {
                return false;
              }
            }
            this.confirmLoading = false;
            this.onCancel();
          })
          .catch(() => {
            this.confirmLoading = false;
          });
      }
    },
    onCancel() {
      this.visible = false;
    }
  },
  render(h) {
    const {
      modalProps,
      content,
      visible,
      onSubmit,
      onCancel,
      form,
      confirmLoading,
      slots
    } = this;
    let modalContent = "";
    if (content && utils.isFunction(content)) {
      modalContent = content();
    }
    let formContent = "";
    if (form && form.props && form.props.items) {
      formContent = h(
        "data-form",
        {
          ref: "dataFrom",
          props: { ...form.props },
          scopedSlots: slots
        },
        []
      );
    }
    return h(
      "a-modal",
      {
        props: {
          ...modalProps,
          visible: visible,
          destroyOnClose: true,
          confirmLoading: confirmLoading
        },
        on: {
          ok: onSubmit,
          cancel: onCancel
        }
      },
      [formContent, modalContent]
    );
  }
};
</script>
