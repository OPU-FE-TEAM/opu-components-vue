import { TimePickerProps } from "ant-design-vue/lib/time-picker/index";
import utils from "../../utils";
import { formatInputDate, getBlocks } from "../../utils/dateFormat";

export default {
  name: "OpuTimePicker",
  components: {},
  props: {
    ...TimePickerProps()
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      isOpen: false
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
          ...propsData
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
    }
  },
  created() {
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
      this.onInputEvent();
    },
    // 监听输入事件
    onInputEvent() {
      const that = this;
      setTimeout(() => {
        const input = document.getElementsByClassName(
          "ant-time-picker-panel-input"
        );
        if (input && input.length) {
          input[0].selectionStart = 0; // 选中开始位置
          input[0].selectionEnd = input[0].value.length;
          input[0].addEventListener("keyup", function(e) {
            if (e.key === "Enter") {
              e.stopPropagation();
              that.isOpen = false;
              that.$emit("inputPressEnter", e);
            }
          });
          input[0].oninput = function(e) {
            const { value } = e.target;
            if (e.target.value && e.inputType !== "deleteContentBackward") {
              let newValue = formatInputDate(value, that.blocksData);
              e.target.value = newValue;
            }
          };
        }
      }, 100);
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
