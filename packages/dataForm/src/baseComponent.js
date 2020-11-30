/**
 * 默认的输入组件
 */
import utils from "../../utils";

export default {
  name: "baseComponent",
  components: {},
  props: {
    renderName: {
      type: String,
      default: "a-input"
    },
    value: [Number, String, Object, Array],
    valueField: String,
    labelField: String,
    dataField: String,
    options: Array,
    componentPropsData: Object
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
      const { $listeners, $options, componentPropsData, value } = this;
      const propsData = $options.propsData;

      const ons = {};
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          this.$emit(type, ...args);
        };
      });
      let currentValue = value;
      if (value && utils.isNumber(value)) {
        currentValue = value + "";
      } else if (value && utils.isArray(value)) {
        currentValue = value.map(p => p + "");
      }
      const props = {
        props: {
          ...componentPropsData,
          ...propsData,
          value: currentValue
        },
        on: {
          ...ons,
          change: this.updateValue
        }
      };

      return props;
    }
  },
  created() {},
  methods: {
    updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    focus() {
      const { renderName, componentProps } = this;
      const that = this;
      const input = this.$refs.inputComponent;
      input.focus();
      const el = input.$el;

      // datePicker 获得焦点，弹出选择面板并全选输入框的值
      if (renderName === "a-date-picker") {
        const box = el.getElementsByClassName("ant-calendar-picker-input");
        if (box && box.length) {
          box[0].click();
        }

        setTimeout(() => {
          const input = document.getElementsByClassName("ant-calendar-input");
          if (input && input.length) {
            input[0].selectionStart = 0; // 选中开始位置
            input[0].selectionEnd = input[0].value.length;
            input[0].addEventListener("keyup", function(e) {
              if (e.key === "Enter") {
                e.stopPropagation();
                console.log(666);
                that.$emit("inputPressEnter");
              }
            });
            input[0].oninput = function(e) {
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
      }
    }
  },
  render(h) {
    const { renderName, componentProps } = this;
    return h(
      renderName,
      {
        ref: "inputComponent",
        props: {
          ...componentProps.props
        },
        on: {
          ...componentProps.on
        }
      },
      []
    );
  }
};
