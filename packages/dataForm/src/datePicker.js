import { DatePickerProps } from "ant-design-vue/lib/date-picker/interface";
import utils from "../../utils";
// import moment from "moment";

export default {
  name: "OpuDatePicker",
  components: {},
  props: {
    ...DatePickerProps(),
    min: [String, Object],
    max: [String, Object]
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {};
  },
  computed: {
    componentProps() {
      const { $listeners, $options, value } = this;
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
          value: value
        },
        on: {
          ...ons,
          change: this.updateValue,
          panelChange: e => {
            if (propsData.mode == "year") {
              this.updateValue(e);
            }
          },
          openChange: this.onOpenChange
        }
      };
      if (this.min || (this.max && !props.props.disabledDate)) {
        props.props.disabledDate = e => {
          return this.renderDisabledDate(e);
        };
      }

      return props;
    }
  },
  created() {
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

      // datePicker 获得焦点，弹出选择面板并全选输入框的值
      const box = el.getElementsByClassName("ant-calendar-picker-input");
      if (box && box.length) {
        const boxDom = box[box.length - 1];
        boxDom.click();
      }
      this.onInputEvent();
    },
    // 监听输入事件
    onInputEvent() {
      const { componentProps } = this;
      const that = this;
      setTimeout(() => {
        const input = document.getElementsByClassName("ant-calendar-input");
        if (input && input.length) {
          const inputDom = input[input.length - 1];
          inputDom.selectionStart = 0; // 选中开始位置
          inputDom.selectionEnd = inputDom.value.length;
          inputDom.addEventListener("keyup", function(e) {
            if (e.key === "Enter") {
              e.stopPropagation();
              that.$emit("inputPressEnter", e);
            }
          });
          inputDom.oninput = function(e) {
            if (e.target.value && e.inputType !== "deleteContentBackward") {
              const value = e.target.value;
              let dayFh = "-";
              if (componentProps.props && componentProps.props.format) {
                dayFh = componentProps.props.format.split("")[4];
              }
              if (value.length === 4 && value.indexOf(dayFh) < 0) {
                // 输入4位不存在-
                e.target.value = value + dayFh;
              } else if (
                value.length === 7 &&
                value.indexOf(dayFh) > -1 &&
                value.split(dayFh).length === 2
              ) {
                // 输入7位不存在两个-
                e.target.value = value + dayFh;
              }
              if (componentProps.props && componentProps.props.showTime) {
                // 输入时间
                let timeFh = ":";
                if (componentProps.props && componentProps.props.format) {
                  timeFh = componentProps.props.format.split("")[13];
                }
                if (value.length === 10 && value.indexOf(" ") < 0) {
                  // 输入10位不存在空格
                  e.target.value = value + " ";
                } else if (value.length === 13 && value.indexOf(timeFh) < 0) {
                  // 输入13位不存在:
                  e.target.value = value + timeFh;
                } else if (
                  value.length === 16 &&
                  value.indexOf(timeFh) > -1 &&
                  value.split(timeFh).length === 2
                ) {
                  // 输入16位不存在两个:
                  e.target.value = value + timeFh;
                }
              }
            }
          };
        }
      }, 100);
    },
    onOpenChange(status) {
      if (status) {
        this.onInputEvent();
      }
      this.$emit("openChange", status);
    },
    renderDisabledDate(current) {
      if (this.min && current) {
        return current < this.min || (this.max && current > this.max);
      } else if (this.min || this.max) {
        return current < this.min || current > this.max;
      }
    }
  },
  render(h) {
    const { componentProps, $scopedSlots } = this;
    return h(
      "a-date-picker",
      {
        ref: "inputComponent",
        props: {
          ...componentProps.props
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
