import { TimePickerProps } from "ant-design-vue/lib/time-picker/index";
import utils from "../../utils";
import { formatInputDate, getBlocks } from "../../utils/dateFormat";
export default {
  name: "OpuTimePicker",
  components: {},
  props: {
    ...TimePickerProps(),
    fieldName: {
      type: String,
      default: ""
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      isOpen: false,
      className: ""
    };
  },
  computed: {
    componentProps() {
      const { $listeners, $options } = this;
      const propsData = $options.propsData;
      const ons = {};
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          this.$emit(type, ...args);
        };
      });
      const props = {
        props: {
          ...propsData,
          popupClassName: this.className
        },
        on: {
          ...ons,
          change: this.updateValue,
          openChange: this.onOpenChange
        }
      };

      return props;
    },
    currentFormat() {
      let format = "HH:mm:ss";
      if (this.componentProps.props && this.componentProps.props.format) {
        format = this.componentProps.props.format;
      }
      return format;
    }
  },
  watch: {
    currentFormat() {
      this.blocksData = getBlocks(this.currentFormat);
    },
    fieldName() {
      this.className = "id" + this.fieldName + utils.getUid();
    }
  },
  created() {
    this.className = "id" + this.fieldName + utils.getUid();
    this.blocksData = getBlocks(this.currentFormat);
    this.focus = utils.throttle(function() {
      this.onFocus();
    }, 100);
  },
  methods: {
    updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    onFocus() {
      const input = this.$refs.inputComponent;
      const el = input.$el;
      // timePicker 获得焦点，弹出选择面板并全选输入框的值
      const box = el.getElementsByClassName("ant-time-picker-input");
      if (box && box.length) {
        box[0].click();
      }
      // this.onInputEvent();
    },
    // 监听输入事件
    onInputEvent() {
      const that = this;
      this.$nextTick(() => {
        setTimeout(() => {
          const input = document.querySelector(
            `.${this.className} .ant-time-picker-panel-input`
          );

          if (input) {
            input.selectionStart = 0; // 选中开始位置
            input.selectionEnd = input.value.length;
            // input.removeEventListener("keyup", this.onKeyup);
            input.addEventListener("keyup", this.onKeyup);
            input.oninput = function(e) {
              const { value } = e.target;
              if (e.target.value && e.inputType !== "deleteContentBackward") {
                let newValue = formatInputDate(value, that.blocksData);
                e.target.value = newValue;
              }
            };
          }
        }, 100);
      });
    },
    onKeyup(e) {
      if (e.key === "Enter") {
        e.stopPropagation();
        this.isOpen = false;
        this.$emit("inputPressEnter", e);
      }
    },
    onOpenChange(status) {
      this.isOpen = status;
      if (status) {
        this.onInputEvent();
      }
      this.$emit("openChange", status);
    }
  },
  render(h) {
    const { componentProps, $scopedSlots, isOpen, value } = this;
    return h(
      "a-time-picker",
      {
        ref: "inputComponent",
        props: {
          ...componentProps.props,
          open: isOpen,
          value
        },
        on: {
          ...componentProps.on
        },
        scopedSlots: $scopedSlots
      },
      []
    );
  }
};
