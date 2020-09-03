import { DatePickerProps } from "ant-design-vue/lib/date-picker/interface";
import utils from "../../utils";

export default {
  name: "ARangePickerSplit",
  components: {},
  props: {
    ...DatePickerProps(),
    value: [Number, String, Object, Array],
    min: [String, Object],
    max: [String, Object]
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      data: [],
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
      console.log(val);
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

    // this.min = this.min ? this.min : "";
    // this.max = this.max ? this.max : "";
  },
  methods: {
    onChange() {
      // this.cvalue = value;

      let value = [this.minDate, this.maxDate];
      // if (this.minDate) {
      //   value.push(this.minDate);
      // }
      // if (this.maxDate) {
      //   value.push(this.maxDate);
      // }

      this.$emit("updata", value);
      this.$emit("change", value);
    },
    onStartChange(e) {
      this.minDate = e;
      this.onChange();
    },
    onEndChange(e) {
      this.maxDate = e;
      this.onChange();
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
    }
  },
  render() {
    const propsData = utils.clone(this.$options.propsData);
    delete propsData.value;
    const start = {
      props: {
        ...propsData,
        allowClear: false,
        disabledDate: e => {
          return this.startDisabledDate(e);
        }
      },
      style: {
        width: "100%"
      },
      on: {
        change: e => {
          this.onStartChange(e);
        }
      }
    };

    if (this.startValue) {
      start.props.value = this.startValue;
    }
    const end = {
      props: {
        ...propsData,
        allowClear: false,
        disabledDate: e => {
          return this.endDisabledDate(e);
        }
      },
      style: {
        width: "100%"
      },
      on: {
        change: e => {
          this.onEndChange(e);
        }
      }
    };
    if (this.endValue) {
      end.props.value = this.endValue;
    }

    return (
      <div class="date-range-split">
        <div class="item">
          <a-date-picker {...start} />
        </div>
        <div class="fh"> - </div>
        <div class="item">
          <a-date-picker {...end} />
        </div>
      </div>
    );
  }
};
