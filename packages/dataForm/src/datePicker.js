import { DatePickerProps } from "ant-design-vue/lib/date-picker/interface";
import utils from "../../utils";
import {
  formatInputDate,
  mergeInputDate,
  getBlocks
} from "../../utils/dateFormat";
import moment from "moment";

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
    return {
      inputValue: "",
      blocksData: {
        blocks: [],
        datePatterns: [],
        delimiters: []
      }
    };
  },
  computed: {
    componentProps() {
      const { $listeners, $options, ok } = this;
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
          panelChange: e => {
            if (propsData.mode == "year") {
              this.updateValue(e);
            }
          },
          openChange: this.onOpenChange,
          ok: ok
        }
      };
      if (this.min || (this.max && !props.props.disabledDate)) {
        props.props.disabledDate = e => {
          return this.renderDisabledDate(e);
        };
      }

      return props;
    },
    currentFormat() {
      let format = "YYYY-MM-DD";
      if (this.componentProps.props && this.componentProps.props.format) {
        format = this.componentProps.props.format;
      } else if (
        this.componentProps.props &&
        this.componentProps.props.showTime
      ) {
        format = format + " HH:mm:ss";
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

      // datePicker 获得焦点，弹出选择面板并全选输入框的值
      const box = el.getElementsByClassName("ant-calendar-picker-input");
      if (box && box.length) {
        const boxDom = box[box.length - 1];
        boxDom.click();
      }
      this.onInputEvent();
    },
    onKeyUpEnter(e) {
      if (e.key === "Enter") {
        e.stopPropagation();
        this.ok();
        this.$emit("inputPressEnter", e);
      }
    },
    ok() {
      const val = mergeInputDate(
        this.inputValue,
        this.value.format(this.currentFormat),
        this.currentFormat
      );
      const newVal = moment(val, this.currentFormat);
      if (newVal.format(this.currentFormat) !== "Invalid date") {
        this.updateValue(newVal);
      }
    },
    // 监听输入事件
    onInputEvent() {
      const that = this;
      setTimeout(() => {
        const input = document.getElementsByClassName("ant-calendar-input");
        if (input && input.length) {
          const inputDom = input[input.length - 1];
          inputDom.selectionStart = 0; // 选中开始位置
          inputDom.selectionEnd = inputDom.value.length;
          inputDom.removeEventListener("keyup", that.onKeyUpEnter);
          inputDom.addEventListener("keyup", that.onKeyUpEnter);
          inputDom.oninput = function(e) {
            const { value } = e.target;
            console.log(that.blocksData);
            if (e.target.value && e.inputType !== "deleteContentBackward") {
              let newValue = formatInputDate(value, that.blocksData);
              e.target.value = newValue;
            }
            that.inputValue = e.target.value;
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
        return current < this.min || current > this.max.endOf("day");
      }
    }
  },
  render(h) {
    const { componentProps, $scopedSlots, value } = this;
    return h(
      "a-date-picker",
      {
        ref: "inputComponent",
        props: {
          ...componentProps.props,
          value: value
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
