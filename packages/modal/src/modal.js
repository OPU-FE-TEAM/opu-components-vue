import { Modal } from "vxe-table";
import { utils } from "../../init";

console.log(Modal);
export default {
  name: "Modal",
  components: {},
  props: {
    ...Modal.props,
    value: {
      type: Boolean
    },
    okText: {
      type: String,
      default: "确定"
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    okButtonProps: Object,
    cancelButtonProps: Object,
    confirmLoading: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    modalProps() {
      const {
        $scopedSlots,
        $listeners,
        onHide,
        onCancel,
        okText,
        okButtonProps,
        cancelButtonProps,
        onSubmit,
        cancelText,
        visible,
        confirmLoading
      } = this;
      const propsData = this.$options.propsData;
      let props = {
        props: {
          className: "opu-modal",
          ...propsData,
          value: visible
        }
      };
      props.ref = "modal";
      props.scopedSlots = {
        ...$scopedSlots,
        title: () => {
          return (
            <div
              {...{
                on: {
                  mousedown: () => {
                    this.$refs.hiddenInput.focus();
                  }
                },
                class: "modal-title"
              }}
            >
              {propsData.title}
              <input class="hidden-input" ref="hiddenInput"></input>
            </div>
          );
        }
      };
      if (propsData.showFooter && !$scopedSlots.footer) {
        let okButton = (
          <a-button
            {...{
              props: {
                type: "primary",
                ...okButtonProps,
                loading: confirmLoading
              },
              on: { click: onSubmit }
            }}
          >
            {okText}
          </a-button>
        );
        let cancelButton = (
          <a-button
            {...{
              props: { ...cancelButtonProps },
              on: { click: onCancel }
            }}
          >
            {cancelText}
          </a-button>
        );
        props.scopedSlots.footer = () => {
          return (
            <a-space>
              {cancelButton}
              {okButton}
            </a-space>
          );
        };
      }

      const ons = {};
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          this.$emit(type, ...args);
        };
      });
      props.on = {
        ...ons,
        hide: onHide
      };

      return props;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    }
  },
  created() {
    this.visible = this.value;
  },

  methods: {
    onHide() {
      this.$emit("update", false);
    },
    onCancel() {
      this.visible = false;
      this.$emit("cancel", false);
    },
    onSubmit() {
      this.$emit("ok");
    }
  },
  render(h) {
    const { modalProps } = this;
    return h("vxe-modal", {
      ...modalProps,
      ...{
        on: { ...modalProps.on }
      }
    });
  }
};
