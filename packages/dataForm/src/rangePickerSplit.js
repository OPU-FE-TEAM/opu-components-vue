import { DatePickerProps } from "ant-design-vue/lib/date-picker/interface";
import utils from "../../utils";
import OpuDatePicker from "./datePicker";
import moment from "moment";

export default {
  name: "ARangePickerSplit",
  components: { OpuDatePicker },
  props: {
    ...DatePickerProps(),
    value: [Number, String, Object, Array],
    min: [String, Object],
    max: [String, Object],
    // 是否限制开始于结束日期选择
    hasLimit: {
      type: Boolean,
      required: false,
      default: true
    },
    separator: [String, Function],
    startDisabled: {
      type: Boolean,
      default: false
    },
    endDisabled: {
      type: Boolean,
      default: false
    },
    startDisabledDate: {
      type: Function,
      default: null
    },
    endDisabledDate: {
      type: Function,
      default: null
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      minDate: "",
      maxDate: ""
    };
  },
  computed: {
    startValue() {
      let start = "";
      if (this.value && this.value.length) {
        start = this.value[0];
      }
      return start;
    },
    endValue() {
      let end = "";
      if (this.value && this.value.length > 1) {
        end = this.value[1];
      }
      return end;
    }
  },
  watch: {
    value(val) {
      if (val && val.length) {
        this.minDate = val[0];
      }
      if (val && val.length > 1) {
        this.maxDate = val[1];
      }
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.minDate = this.value[0];
    }
    if (this.value && this.value.length > 1) {
      this.maxDate = this.value[1];
    }
  },
  methods: {
    onChange() {
      let value = [this.minDate, this.maxDate];
      this.$emit("update", value);
      this.$emit("change", value);
    },
    onStartChange(e) {
      if (this.maxDate && moment(this.maxDate).isBefore(e)) {
        this.maxDate = e;
      }
      this.minDate = e;
      this.onChange(0);
    },
    onEndChange(e) {
      if (this.minDate && e && !moment(this.minDate).isBefore(e)) {
        this.minDate = e;
      }
      this.maxDate = e;
      this.onChange(1);
    },
    startDisabledDateFuc(current) {
      if (
        this.startDisabledDate &&
        this.startDisabledDate(current, this.minDate, this.maxDate)
      ) {
        return true;
      } else if (this.maxDate && current) {
        return current > this.maxDate || (this.min && current < this.min);
      } else if (this.min || this.max) {
        return current < this.min || current > this.max.endOf("day");
      }
    },
    endDisabledDateFuc(current) {
      if (
        this.endDisabledDate &&
        this.endDisabledDate(current, this.minDate, this.maxDate)
      ) {
        return true;
      } else if (this.minDate && current) {
        return current < this.minDate || (this.max && current > this.max);
      } else if (this.min || this.max) {
        return current < this.min || current > this.max.endOf("day");
      }
    },
    focus() {
      this.$refs.startDatePicker.focus();
    }
  },
  render(h) {
    const { hasLimit, separator, $listeners } = this;
    const propsData = utils.clone(this.$options.propsData);
    delete propsData.value;
    const ons = {};
    utils.each($listeners, (cb, type) => {
      ons[type] = (...args) => {
        this.$emit(type, ...args);
      };
    });

    const start = {
      ref: "startDatePicker",
      props: {
        ...propsData
        // allowClear: false
      },
      style: {
        width: "100%"
      },
      on: {
        ...ons,
        change: e => {
          this.onStartChange(e);
        },
        inputPressEnter: () => {
          setTimeout(() => {
            this.$refs.endDatePicker.focus();
          }, 100);
        }
      }
    };

    if (this.startValue) {
      start.props.value = this.startValue;
    }
    if (this.startDisabled) {
      start.props.disabled = true;
    }
    const end = {
      ref: "endDatePicker",
      props: {
        ...propsData
        // allowClear: false
      },
      style: {
        width: "100%"
      },
      on: {
        ...ons,
        change: e => {
          this.onEndChange(e);
        },
        inputPressEnter: e => {
          this.$emit("inputPressEnter", e);
        }
      }
    };
    if (this.endValue) {
      end.props.value = this.endValue;
    }
    if (this.endDisabled) {
      end.props.disabled = true;
    }
    // 限制
    if (hasLimit) {
      start.props.disabledDate = e => {
        return this.startDisabledDateFuc(e);
      };
      end.props.disabledDate = e => {
        return this.endDisabledDateFuc(e);
      };
    } else {
      if (start.props.startDisabledDate) {
        start.props.disabledDate = this.startDisabledDate;
      }
      if (end.props.endDisabledDate) {
        end.props.disabledDate = this.endDisabledDate;
      }
      start.scopedSlots = {
        dateRender: current => {
          let outside = false;
          if (this.maxDate && current) {
            outside =
              current > this.maxDate || (this.min && current < this.min);
          } else if (this.min || this.max) {
            outside = current < this.min || current > this.max;
          }
          const dateClass = outside ? "outside" : "";
          return h(
            "div",
            {
              class: ["ant-calendar-date", dateClass]
            },
            [current.date()]
          );
        }
      };

      end.scopedSlots = {
        dateRender: current => {
          let outside = false;
          if (this.minDate && current) {
            outside =
              current < this.minDate || (this.max && current > this.max);
          } else if (this.min || this.max) {
            outside = current < this.min || current > this.max;
          }
          const dateClass = outside ? "outside" : "";
          return h(
            "div",
            {
              class: ["ant-calendar-date", dateClass]
            },
            [current.date()]
          );
        }
      };
    }
    let separatorText = "-";
    if (separator && utils.isFunction(separator)) {
      separatorText = separator();
    } else if (separator) {
      separatorText = separator;
    }

    return (
      <div class="date-range-split">
        <div class="item">
          <opu-date-picker {...start} />
        </div>
        <div class="fh"> {separatorText} </div>
        <div class="item">
          <opu-date-picker {...end} />
        </div>
      </div>
    );
  }
};
