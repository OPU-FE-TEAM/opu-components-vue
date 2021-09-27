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
    separator: [String, Function]
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
      this.$emit("updata", value);
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
      if (this.minDate && !moment(this.minDate).isBefore(e)) {
        this.minDate = e;
      }
      this.maxDate = e;
      this.onChange(1);
    },
    startDisabledDate(current) {
      if (this.maxDate && current) {
        return current > this.maxDate || (this.min && current < this.min);
      } else if (this.min || this.max) {
        return current < this.min || current > this.max;
      }
    },
    endDisabledDate(current) {
      if (this.minDate && current) {
        return current < this.minDate || (this.max && current > this.max);
      } else if (this.min || this.max) {
        return current < this.min || current > this.max;
      }
    },
    focus() {
      this.$refs.startDatePicker.focus();
    }
  },
  render(h) {
    const { hasLimit, separator } = this;
    const propsData = utils.clone(this.$options.propsData);
    delete propsData.value;
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
    // 限制
    if (hasLimit) {
      start.props.disabledDate = e => {
        return this.startDisabledDate(e);
      };
      end.props.disabledDate = e => {
        return this.endDisabledDate(e);
      };
    } else {
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
