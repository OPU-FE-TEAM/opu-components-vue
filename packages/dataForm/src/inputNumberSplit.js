import { InputNumberProps } from "ant-design-vue/lib/input-number";
export default {
  name: "InputNumberSplit",
  components: {},
  props: {
    ...InputNumberProps,
    value: {
      type: Array
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    startMin: {
      type: Number
    },
    startMax: {
      type: Number
    },
    endMin: {
      type: Number
    },
    endMax: {
      type: Number
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      sMin: "",
      sMax: "",
      sValue: "",
      eMin: "",
      eMax: "",
      eValue: ""
    };
  },
  watch: {
    value(val) {
      if (val && val.length) {
        this.sValue = val[0];
      }
      if (val && val.length > 1) {
        this.eValue = val[1];
      }
    }
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
  created() {
    let { min, max, startMin, startMax, endMin, endMax } = this;
    this.sMin = startMin ? startMin : min;
    this.sMax = startMax ? startMax : max;
    this.eMin = endMin ? endMin : min;
    this.eMax = endMax ? endMax : max;
  },
  mounted() {},
  updated() {},
  methods: {
    focus() {
      this.$refs.start.focus();
    },
    onChange() {
      let value = [this.sValue, this.eValue];
      this.$emit("updata", value);
      this.$emit("change", value);
    },
    onStartChange(e) {
      let { sMin, sMax } = this;
      if (sMin && e < sMin) {
        e = sMin;
      }
      if (sMax && e > sMax) {
        e = sMax;
      }
      if (this.eValue && (e || e == 0) && this.eValue < e) {
        e = this.eValue;
      }
      this.sValue = e;
      this.onChange();
    },
    onEndChange(e) {
      let { eMin, eMax } = this;
      if (eMin && e < eMin) {
        e = eMin;
      }
      if (eMax && e > eMax) {
        e = eMax;
      }
      if (this.sValue && (e || e == 0) && this.sValue > e) {
        e = this.sValue;
      }
      this.eValue = e;
      this.onChange();
    }
  },
  render() {
    let {
      sMin,
      sMax,
      startValue,
      onStartChange,
      eMin,
      eMax,
      endValue,
      onEndChange
    } = this;
    let propsData = this.$options.propsData;
    delete propsData.value;
    let start = {
      style: { width: "100%" },
      ref: "start",
      props: {
        ...propsData,
        min: sMin,
        max: sMax,
        value: startValue
      },
      option: {
        initialValue: ""
      },
      on: {
        change: onStartChange,
        pressEnter: () => {
          this.$refs.end.focus();
        }
      }
    };
    let end = {
      style: { width: "100%" },
      ref: "end",
      props: {
        ...propsData,
        min: eMin,
        max: eMax,
        value: endValue
      },
      on: {
        change: onEndChange,
        pressEnter: e => {
          setTimeout(() => {
            this.$emit("inputPressEnter", e);
          }, 100);
        }
      }
    };

    return (
      <div class="input-number-split">
        <div class="item">
          <a-input-number {...start} />
        </div>
        <div class="fh"> - </div>
        <div class="item">
          <a-input-number {...end} />
        </div>
      </div>
    );
  }
};
