import { TimePickerProps } from "ant-design-vue/lib/time-picker";
import utils from "../../utils";
import OpuTimePicker from "./timePicker";
import moment from "moment";
import { cloneDeep } from "lodash";

export default {
  name: "ARangeTimePickerSplit",
  components: { OpuTimePicker },
  props: {
    ...TimePickerProps(),
    value: [Number, String, Object, Array],
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
    startDisabledHours: {
      type: Boolean,
      default: false
    },
    startDisabledMinutes: {
      type: Boolean,
      default: false
    },
    startDisabledSeconds: {
      type: Boolean,
      default: false
    },
    endDisabled: {
      type: Boolean,
      default: false
    },
    endDisabledHours: {
      type: Boolean,
      default: false
    },
    endDisabledMinutes: {
      type: Boolean,
      default: false
    },
    endDisabledSeconds: {
      type: Boolean,
      default: false
    }
    // isEqual: {
    //   type: Boolean,
    //   default: true
    // }
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    let hours = [];
    let minutes = [];
    let seconds = [];
    for (let i = 0; i < 60; i++) {
      if (i < 24) {
        hours.push(i);
      }
      minutes.push(i);
      seconds.push(i);
    }
    return {
      hours,
      minutes,
      seconds,
      minTime: "",
      maxTime: ""
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
        this.minTime = val[0];
      }
      if (val && val.length > 1) {
        this.maxTime = val[1];
      }
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.minTime = this.value[0];
    }
    if (this.value && this.value.length > 1) {
      this.maxTime = this.value[1];
    }
  },
  methods: {
    onChange(type) {
      let value = [this.minTime, this.maxTime];
      this.$emit("update", value);
      this.$emit("change", value);
      this.$emit(`${type}Change`, value);
    },
    onStartChange(e) {
      if (this.maxTime && moment(this.maxTime, this.format).isBefore(e)) {
        if (this.hasLimit) {
          this.minTime = cloneDeep(this.maxTime);
        } else {
          this.maxTime = cloneDeep(e);
          this.minTime = e;
        }
      } else {
        this.minTime = e;
      }
      this.onChange("start");
    },
    onEndChange(e) {
      if (this.minTime && e && !moment(this.minTime, this.format).isBefore(e)) {
        if (this.hasLimit) {
          this.maxTime = cloneDeep(this.minTime);
        } else {
          this.minTime = cloneDeep(e);
          this.maxTime = e;
        }
      } else {
        this.maxTime = e;
      }
      this.onChange("end");
    },
    startDisabledHoursFuc() {
      let hoursArr = [];
      if (this.disabledHours) {
        hoursArr = this.disabledHours();
      }
      if (this.startDisabledHours) {
        hoursArr = this.startDisabledHours();
      }
      if (this.hasLimit && this.endValue) {
        let { endHours } = this.getEndValueSplit();
        let limitHoursArr = cloneDeep(this.hours);
        for (let i = 0; i < limitHoursArr.length; i++) {
          let item = limitHoursArr[i];
          if (hoursArr.includes(item) || item < endHours || item == endHours) {
            continue;
          }
          hoursArr.push(item);
        }
      }
      return hoursArr;
    },
    startDisabledMinutesFuc(selectedHour) {
      let minutesArr = [];
      if (this.disabledMinutes) {
        minutesArr = this.disabledMinutes(selectedHour);
      }
      if (this.startDisabledMinutes) {
        minutesArr = this.startDisabledMinutes(selectedHour);
      }
      if (this.hasLimit && this.endValue) {
        let { endHours, endMinutes } = this.getEndValueSplit();
        let limitMinutesArr = cloneDeep(this.minutes);
        if (selectedHour >= endHours) {
          for (let i = 0; i < limitMinutesArr.length; i++) {
            let item = limitMinutesArr[i];
            if (minutesArr.includes(item)) continue;
            if (selectedHour == endHours) {
              if (item < endMinutes) continue;
              if (item == endMinutes) {
                continue;
              }
            }
            minutesArr.push(item);
          }
        }
      }
      return minutesArr;
    },
    startDisabledSecondsFuc(selectedHour, selectedMinute) {
      let secondsArr = [];
      if (this.disabledSeconds) {
        secondsArr = this.disabledSeconds(selectedHour, selectedMinute);
      }
      if (this.startDisabledSeconds) {
        secondsArr = this.startDisabledSeconds(selectedHour, selectedMinute);
      }
      if (this.hasLimit && this.endValue) {
        let { endHours, endMinutes, endSeconds } = this.getEndValueSplit();
        let limitSecondsArr = cloneDeep(this.seconds);
        if (
          selectedHour > endHours ||
          (selectedHour == endHours && selectedMinute >= endMinutes)
        ) {
          for (let i = 0; i < limitSecondsArr.length; i++) {
            let item = limitSecondsArr[i];
            if (secondsArr.includes(item)) continue;
            if (selectedHour == endHours && selectedMinute == endMinutes) {
              if (item < endSeconds) continue;
              if (item == endSeconds) continue;
            }
            secondsArr.push(item);
          }
        }
      }
      return secondsArr;
    },
    endDisabledHoursFuc() {
      let hoursArr = [];
      if (this.disabledHours) {
        hoursArr = this.disabledHours();
      }
      if (this.endDisabledHours) {
        hoursArr = this.endDisabledHours();
      }
      if (this.hasLimit && this.startValue) {
        let { startHours } = this.getStartValueSplit();
        let limitHoursArr = cloneDeep(this.hours);
        for (let i = 0; i < limitHoursArr.length; i++) {
          let item = limitHoursArr[i];
          if (hoursArr.includes(item) || item >= startHours) {
            continue;
          }
          hoursArr.push(item);
        }
      }
      return hoursArr;
    },
    endDisabledMinutesFuc(selectedHour) {
      let minutesArr = [];
      if (this.disabledMinutes) {
        minutesArr = this.disabledMinutes(selectedHour);
      }
      if (this.startDisabledMinutes) {
        minutesArr = this.startDisabledMinutes(selectedHour);
      }
      if (this.hasLimit && this.startValue) {
        let { startHours, startMinutes } = this.getStartValueSplit();
        let limitMinutesArr = cloneDeep(this.minutes);
        if (selectedHour <= startHours) {
          for (let i = 0; i < limitMinutesArr.length; i++) {
            let item = limitMinutesArr[i];
            if (minutesArr.includes(item)) continue;
            if (item > startMinutes) continue;
            if (item == startMinutes) continue;
            minutesArr.push(item);
          }
        }
      }
      return minutesArr;
    },
    endDisabledSecondsFuc(selectedHour, selectedMinute) {
      let secondsArr = [];
      if (this.disabledSeconds) {
        secondsArr = this.disabledSeconds(selectedHour, selectedMinute);
      }
      if (this.startDisabledSeconds) {
        secondsArr = this.startDisabledSeconds(selectedHour, selectedMinute);
      }
      if (this.hasLimit && this.startValue) {
        let {
          startHours,
          startMinutes,
          startSeconds
        } = this.getStartValueSplit();
        let limitSecondsArr = cloneDeep(this.seconds);
        if (
          selectedHour < startHours ||
          (selectedHour == startHours && selectedMinute == startMinutes)
        ) {
          for (let i = 0; i < limitSecondsArr.length; i++) {
            let item = limitSecondsArr[i];
            if (secondsArr.includes(item)) continue;
            if (selectedHour == startHours && selectedMinute == startMinutes) {
              if (item > startSeconds) continue;
              if (item == startSeconds) continue;
            }
            secondsArr.push(item);
          }
        }
      }
      return secondsArr;
    },
    getStartValueSplit() {
      let startHours = Number(this.startValue.format("HH"));
      let startMinutes = Number(this.startValue.format("mm"));
      let startSeconds = Number(this.startValue.format("ss"));
      return { startHours, startMinutes, startSeconds };
    },
    getEndValueSplit() {
      let endHours = Number(this.endValue.format("HH"));
      let endMinutes = Number(this.endValue.format("mm"));
      let endSeconds = Number(this.endValue.format("ss"));
      return { endHours, endMinutes, endSeconds };
    },
    endItemKeyup(e) {
      this.$emit("inputPressEnter", e);
    },
    focus() {
      this.$refs.startTimePicker.focus();
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
      ref: "startTimePicker",
      props: {
        ...propsData,
        disabledHours: this.startDisabledHoursFuc,
        disabledMinutes: this.startDisabledMinutesFuc,
        disabledSeconds: this.startDisabledSecondsFuc
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
            this.$refs.endTimePicker.focus();
            // this.$refs.endTimePicker.onFocus();
            // this.$refs.endItem.click();
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
      ref: "endTimePicker",
      props: {
        ...propsData,
        disabledHours: this.endDisabledHoursFuc,
        disabledMinutes: this.endDisabledMinutesFuc,
        disabledSeconds: this.endDisabledSecondsFuc
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
          if (this.maxTime && current) {
            outside =
              current > this.maxTime || (this.min && current < this.min);
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
          if (this.minTime && current) {
            outside =
              current < this.minTime || (this.max && current > this.max);
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
          <opu-time-picker {...start} />
        </div>
        <div class="fh"> {separatorText} </div>
        <div class="item">
          <opu-time-picker {...end} />
        </div>
      </div>
    );
  }
};
