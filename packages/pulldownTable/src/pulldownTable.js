import { DataTable } from "../../dataTable";
import { Pulldown } from "vxe-table";
import { utils } from "../../init";
function renderInput(h, _vm) {
  const {
    onInputFocus,
    onInputKeDown,
    onInputChangeBefore,
    text,
    selectValueText,
    disabled,
    inputProps,
    onInputKeyUp
  } = _vm;
  return h("a-input", {
    props: {
      placeholder: selectValueText,
      disabled,
      allowClear: true,
      ...inputProps,
      value: text
    },
    ref: "input",
    on: {
      focus: onInputFocus,
      keydown: onInputKeDown,
      keyup: onInputKeyUp,
      change: onInputChangeBefore
    }
  });
}

const pulldownPropKeys = Object.keys(Pulldown.props);

export default {
  name: "PulldownTable",
  components: {
    DataTable
  },
  props: {
    ...Pulldown.props,
    table: Object,
    valueField: {
      type: String,
      default: "id"
    },
    textField: {
      type: String,
      default: "name"
    },
    searchBefore: Function,
    searchField: {
      type: String,
      default: "keyword"
    },
    value: {
      type: [Object, Array, String, Number]
    },
    disabled: Boolean,
    inputProps: {
      type: [Object]
    },
    //是否focus时保留原值搜索
    retainSearchValue: {
      type: Boolean,
      default: true
    },
    // 允许输入值
    allowInputValue: Boolean
  },

  data() {
    return {
      multiple: false,
      tableData: [],
      selectValue: "",
      currentValue: "",
      inputChangeValue: "",
      timer: null,
      checkboxIndex: -1
    };
  },
  computed: {
    selectValueText() {
      const { selectValue } = this;
      let text = "";
      if (selectValue && utils.isArray(selectValue)) {
        text = selectValue.map(p => p[this.textField]).join(",");
      } else if (selectValue && utils.isObject(selectValue)) {
        text = selectValue[this.textField];
      } else if (selectValue || selectValue == 0) {
        text = selectValue;
      }
      return text;
    },
    text() {
      const { currentValue } = this;
      let text = "";
      if (currentValue && utils.isArray(currentValue)) {
        text = currentValue.map(p => p[this.textField]).join(",");
      } else if (currentValue && utils.isObject(currentValue)) {
        text = currentValue[this.textField];
      } else if (currentValue || currentValue == 0) {
        text = currentValue;
      }
      return text;
    },
    pulldownExtendProps() {
      const rest = {};
      pulldownPropKeys.forEach(key => {
        rest[key] = this[key];
      });
      return rest;
    },
    pulldownProps() {
      const { pulldownExtendProps } = this;
      const propsData = this.$options.propsData;
      const props = Object.assign({}, pulldownExtendProps);
      delete propsData.value;
      Object.assign(props, {
        props: {
          modelValue: true,
          transfer: true,
          destroyOnClose: true,
          ...propsData
        }
      });
      props.ref = "pulldownTable";
      props.class = "pulldown";
      props.on = {
        "hide-panel": this.onPulldownHide
      };
      return props;
    },
    tableProps() {
      let that = this;
      const {
        table,
        tableData,
        $scopedSlots,
        onTableRowSelect,
        onTableCheckboxChange
      } = that;
      //是否存在多选  若存在  多选checkbox索引
      that.checkboxIndex = table.props.columns.findIndex(
        p => p.type == "checkbox"
      );
      const props = {
        props: {
          highlightHoverRow: true,
          highlightCurrentRow: true,
          defaultSelectFristRow: true,
          "show-overflow": true,
          ...table.props,
          data: tableData,
          columns: table.props.columns
        },
        on: {
          "cell-click": onTableRowSelect,
          "checkbox-change": onTableCheckboxChange,
          "checkbox-all": onTableCheckboxChange
        },
        style: { background: "#fff", ...table.style },
        class: "pulldown-table",
        slot: "dropdown"
      };
      if (table.props.proxyConfig && table.props.proxyConfig.ajax) {
        props.props.proxyConfig = {
          ...table.props.proxyConfig,
          ajax: {
            ...table.props.proxyConfig.ajax
          }
        };
      }
      props.scopedSlots = $scopedSlots;
      props.ref = "table";
      return props;
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
      this.selectValue = val;
    }
  },
  created() {
    this.onChange = utils.debounce(this.onInputChange, 400);
    this.currentValue = this.value;
    this.selectValue = this.value;
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    select() {
      this.$refs.input.$refs.input.select();
    },
    onTableRowSelect({ row, columnIndex }) {
      let { checkboxIndex } = this;
      if (checkboxIndex < 0 || checkboxIndex != columnIndex) {
        let text = row[this.textField];
        this.selectValue = row;
        this.currentValue = row;
        this.$emit("input", text);
        this.$emit("change", text, row);
        this.$refs.pulldownTable.hidePanel();
      }
    },
    onTableCheckboxChange({ records }) {
      this.selectValue = records;
      this.currentValue = records;
      this.$emit("change", this.selectValue);
    },
    onInputFocus(e) {
      let that = this;
      const { table, searchBefore, searchField, retainSearchValue } = that;
      that.$refs.pulldownTable.showPanel();
      that.$emit("showPanel", e);
      if (!retainSearchValue) {
        that.currentValue = "";
      }
      if (
        table.props.proxyConfig &&
        table.props.proxyConfig.ajax &&
        table.props.proxyConfig.ajax.query
      ) {
        that.$nextTick(() => {
          let params = {};
          params[searchField] = retainSearchValue ? that.selectValueText : "";
          if (searchBefore) {
            const searchBeforeRes = searchBefore && searchBefore(params);
            if (searchBeforeRes === false) {
              return false;
            } else if (searchBeforeRes) {
              params = searchBeforeRes;
            }
          }
          const dataTable = that.$refs.table;
          dataTable.onSearchSubmit(params);
        });
      } else if (that.tableData.length > 0) {
        const dataTable = that.$refs.table;
        dataTable.setCurrentRow(that.tableData[0]);
      }
    },
    onInputChangeBefore(e) {
      if (e.type === "click") {
        this.onClear("");
      } else {
        this.onInputChange(e);
      }
    },
    onInputChange(e) {
      let { value } = e.target;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.currentValue = value;
        const pulldown = this.$refs.pulldownTable;
        const { table, searchBefore, searchField } = this;
        if (
          table.props.proxyConfig &&
          table.props.proxyConfig.ajax &&
          table.props.proxyConfig.ajax.query &&
          pulldown &&
          pulldown.isPanelVisible()
        ) {
          let params = {};
          params[searchField] = value;
          if (searchBefore) {
            const searchBeforeRes = searchBefore && searchBefore(params);
            if (searchBeforeRes === false) {
              return false;
            } else if (searchBeforeRes) {
              params = searchBeforeRes;
            }
          }
          const dataTable = this.$refs.table;
          dataTable.onSearchSubmit(params);
        }

        this.$emit("inputChange", e);
      }, 300);
    },
    onClear(value) {
      this.selectValue = {};
      this.$emit("input", value);
      this.$emit("change", value, {});
    },
    onInputEnter(e) {
      const dataTable = this.$refs.table;
      const pulldown = this.$refs.pulldownTable;
      const tableSelectedRow = dataTable.getCurrentRecord();
      if (tableSelectedRow && pulldown.isPanelVisible()) {
        this.onTableRowSelect({ row: tableSelectedRow });
      }
      this.$refs.pulldownTable.hidePanel();
      this.$emit("inputPressEnter", e);
    },
    onInputKeDown(e) {
      const { key } = e;
      if (key == "Tab") {
        this.$refs.pulldownTable.hidePanel();
      }
      this.$emit("keydown", e);
    },
    // 快捷键上下切换选中行
    onInputKeyUp(e) {
      const { key } = e;
      const { onInputEnter, onInputFocus } = this;
      let isVisible = this.$refs.pulldownTable.isPanelVisible();
      if (key == "Enter") {
        if (isVisible) {
          onInputEnter(e);
        }
      }
      if (!isVisible && key == "ArrowDown") {
        onInputFocus();
      }
    },
    onPulldownHide() {
      let that = this;
      if (that.allowInputValue) {
        if (that.currentValue == that.selectValueText) {
          that.$emit("change", that.selectValue, {});
        } else {
          that.$emit("change", that.currentValue, {});
        }
      } else {
        that.$nextTick(() => {
          that.currentValue = that.selectValue;
        });
      }
    }
  },
  render(h) {
    const { tableProps, pulldownProps } = this;
    return h(
      "vxe-pulldown",
      {
        ...pulldownProps,
        ...{
          on: { ...pulldownProps.on }
        }
      },
      [
        renderInput(h, this),
        h("data-table", {
          ...tableProps,
          ...{
            on: { ...tableProps.on }
          }
        })
      ]
    );
  }
};
