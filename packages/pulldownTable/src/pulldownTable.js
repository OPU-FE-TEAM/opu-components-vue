import { DataTable } from "../../dataTable";
import { Pulldown } from "vxe-table";
import { utils } from "../../init";
function renderInput(h, _vm) {
  const {
    onInputFocus,
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
    on: {
      focus: onInputFocus,
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
      Object.assign(props, {
        props: {
          modelValue: true,
          transfer: true,
          // "destroy-on-close": true,
          ...propsData
        }
      });
      props.ref = "pulldownTable";
      // props.scopedSlots = $scopedSlots;
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
        // onCurrentChange,
        onTableRowSelect,
        onTableCheckboxChange
      } = that;
      //是否存在多选  若存在  多选checkbox索引
      that.checkboxIndex = table.props.columns.findIndex(
        p => p.type == "checkbox"
      );
      const props = {
        props: {
          defaultSelectFristRow: true,
          "show-overflow": true,
          ...table.props,
          data: tableData,
          columns: table.props.columns
        },
        on: {
          "cell-click": onTableRowSelect,
          // "current-change": onCurrentChange,
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
    }
  },
  created() {
    this.onChange = utils.debounce(this.onInputChange, 400);
    this.currentValue = this.value;
    // this.inputChangeValue = this.value;
  },

  methods: {
    // onCurrentChange({ row }) {
    //   console.log(row);
    //   // let text = row[this.textField];
    //   // this.currentValue = row;
    //   // this.selectValue = row;
    //   // console.log(text, "text");
    //   // this.$emit("input", row);
    //   // this.$emit("change", text, row);
    //   //   // this.$refs.pulldownTable.hidePanel();
    // },
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
      this.$refs.pulldownTable.showPanel();
      this.$emit("showPanel", e);
      this.currentValue = "";
      // if (this.allowInputValue) {
      // } else {
      //   this.inputChangeValue = this.selectValue;
      // }
      const { table, searchBefore, searchField } = this;
      if (
        table.props.proxyConfig &&
        table.props.proxyConfig.ajax &&
        table.props.proxyConfig.ajax.query
      ) {
        let params = {};
        params[searchField] = "";
        if (searchBefore) {
          const searchBeforeRes = searchBefore && searchBefore(params);
          if (searchBeforeRes === false) {
            return false;
          } else if (searchBeforeRes) {
            params = searchBeforeRes;
          }
        }
        this.$nextTick(() => {
          const dataTable = this.$refs.table;
          dataTable.onSearchSubmit(params);
        });
      } else if (this.tableData.length > 0) {
        const dataTable = this.$refs.table;
        dataTable.setCurrentRow(this.tableData[0]);
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
        // this.inputChangeValue = value;

        this.$emit("inputChange", e);
      }, 300);
    },
    onClear(value) {
      this.selectValue = {};
      this.$emit("input", value);
      this.$emit("change", value, {});
    },
    onInputEnter() {
      const dataTable = this.$refs.table;
      const pulldown = this.$refs.pulldownTable;
      const tableSelectedRow = dataTable.getCurrentRecord();
      if (tableSelectedRow && pulldown.isPanelVisible()) {
        this.onTableRowSelect({ row: tableSelectedRow });
      } else {
        this.onInputFocus();
      }
    },
    // 快捷键上下切换选中行
    onInputKeyUp(e) {
      const { key } = e;
      const {
        // $refs,
        onInputEnter,
        onInputFocus
        // valueField
      } = this;
      if (key == "Enter") {
        onInputEnter();
        return false;
      }
      if (!this.$refs.pulldownTable.isPanelVisible() && key == "ArrowDown") {
        onInputFocus();
      }
      //  else if (key == "ArrowDown" || key == "ArrowUp") {
      //   const dataTable = $refs.table;
      //   const tableData = dataTable.getData();
      //   const tableSelectedRow = dataTable.getCurrentRecord();

      //   if (!tableSelectedRow && tableData && tableData.length) {
      //     // 不存在选中的值，默认选中第一行
      //     dataTable.setCurrentRow(tableData[0]);
      //     dataTable.focus();
      //   }
      // }

      //  else if (tableData && tableData.length) {
      //   const index = tableData.findIndex(
      //     p => p[valueField] === tableSelectedRow[valueField]
      //   );
      //   let nextIndex = 0;
      //   if (key === "ArrowUp") {
      //     nextIndex = index - 1;
      //     if (nextIndex < 0) {
      //       nextIndex = 0;
      //     }
      //   } else {
      //     nextIndex = index + 1;
      //   }

      //   if (tableData[nextIndex]) {
      //     dataTable.setCurrentRow(tableData[nextIndex]);
      //   }
      // }
    },
    onPulldownHide() {
      let that = this;
      if (that.allowInputValue) {
        that.selectValue = that.currentValue;
        that.$emit("change", that.selectValue, {});
      } else {
        // that.selectValue = that.inputChangeValue;
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
