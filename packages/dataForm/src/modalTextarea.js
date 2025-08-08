import { TextAreaProps } from "ant-design-vue/lib/input/TextArea";
import { Modal } from "../../modal";
export default {
  name: "InputNumber",
  components: {
    Modal,
  },
  props: {
    ...TextAreaProps,
    value: {
      type: [String, Number],
    },
    modalTitle: {
      type: String,
      default: "",
    },
  },
  model: {
    prop: "value",
    event: "update",
  },
  data() {
    return {
      visible: false,
      modalTextareaValue: "",
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  updated() {},
  methods: {
    focus() {
      this.$refs.modalTextarea.focus();
    },
    onShowModal() {
      this.modalTextareaValue = this.value;
      this.visible = true;
    },
    onModalSubmit() {
      this.$emit("update", this.modalTextareaValue);
      this.$emit("change", this.modalTextareaValue);
      this.visible = false;
    },
    onModalCancel() {
      this.visible = false;
    },
  },
  render() {
    const { $listeners } = this;
    const that = this;
    let propsData = this.$options.propsData;
    let listeners = {};
    for (const key in $listeners) {
      listeners[key] = (...arg) => {
        that.$emit(key, ...arg);
      };
    }
    let props = {
      style: { width: "100%" },
      ref: "modalTextarea",
      props: {
        ...propsData,
      },
      on: {
        ...listeners,
        change: value => {
          value = value || value === 0 ? value : "";
          this.$emit("update", value);
          if (this.value !== value) {
            this.$emit("change", value);
          }
        },
        pressEnter: e => {
          this.$emit("pressEnter", e);
        },
      },
    };

    return (
      <div class="textarea-edit-wraper">
        <a-textarea {...props} />
        <a class="showmodal-btn" onClick={this.onShowModal}>
          <a-icon type="arrows-alt" />
        </a>
        <modal
          {...{
            props: {
              centered: true,
              title: this.modalTitle || "编辑",
              value: this.visible,
              maskClosable: false,
              destroyOnClose: true,
              width: this.modalWidth || 800,
            },
            on: {
              ok: this.onModalSubmit,
              cancel: this.onModalCancel,
            },
          }}
        >
          <a-textarea
            {...{
              props: {
                value: this.modalTextareaValue,
                destroyOnClose: true,
              },
              on: {
                change: e => {
                  this.modalTextareaValue = e.target.value;
                },
              },
            }}
            rows={propsData.modalTextareaRows || 20}
          />
        </modal>
      </div>
    );
  },
};
