import { Modal } from "vxe-table";
import { utils } from "../../init";
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
    okButtonProps: {
      type: Object,
      default: () => {}
    },
    cancelButtonProps: Object,
    confirmLoading: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: [Boolean, String],
      default: true
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
      let {
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
        confirmLoading,
        showFooter
      } = this;
      const propsData = this.$options.propsData;
      let props = {
        props: {
          className: "opu-modal",
          ...propsData,
          value: visible,
          showFooter
        }
      };
      props.class = "vxeModal";
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
              {($scopedSlots.title && $scopedSlots.title()) || propsData.title}
              <input class="hidden-input" ref="hiddenInput"></input>
            </div>
          );
        }
      };
      if (showFooter && !$scopedSlots.footer) {
        okButtonProps = okButtonProps || {};
        let okButton = (
          <a-button
            {...{
              props: {
                type: "primary",
                ...okButtonProps,
                loading: confirmLoading
              },
              style: okButtonProps.style,
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
      this.onCancel();
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
    const { modalProps, visible } = this;
    return h("vxe-modal", {
      ...modalProps,
      ...{
        props: { ...modalProps.props, value: visible },
        on: { ...modalProps.on }
      }
    });
  }
};
