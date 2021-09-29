import { DataTable } from "../../dataTable";
import { Pulldown } from "vxe-table";
import { utils } from "../../init";
function renderInput(h, _vm) {
  const {
    onInputFocus,
    onChange,
    text,
    // onCancelChange,
    disabled,
    inputProps,
    onInputKeyUp
  } = _vm;
  // const onChange = utils.debounce(onInputChange, 200);
  return h("a-input", {
    props: {
      placeholder: "",
      disabled,
      allowClear: true,
      ...inputProps,
      value: text
    },
    on: {
      focus: onInputFocus,
      keyup: onInputKeyUp,
      // change: onCancelChange,
      input: onChange
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
      tableData: [],
      selectValue: "",
      inputChangeValue: ""
    };
  },
  computed: {
    text() {
      const { selectValue } = this;
      let text = "";
      if (selectValue && utils.isArray(selectValue)) {
        text = selectValue.map(p => p[this.textField]).join(",");
      } else if (selectValue && utils.isObject(selectValue)) {
        text = selectValue[this.textField];
      } else if (selectValue) {
        text = selectValue;
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
      const { pulldownExtendProps, $scopedSlots } = this;
      const propsData = this.$options.propsData;
      const props = Object.assign({}, pulldownExtendProps);
      Object.assign(props, {
        props: {
          transfer: true,
          "destroy-on-close": true,
          ...propsData
        }
      });
      props.ref = "pulldownTable";
      props.scopedSlots = $scopedSlots;
      props.class = "pulldown";
      props.on = {
        "hide-panel": this.onPulldownHide
      };
      return props;
    },
    tableProps() {
      const {
        table,
        tableData,
        $scopedSlots,
        onTableRowSelect,
        onTableCheckboxChange
      } = this;
      const props = {
        props: {
          "show-overflow": true,
          ...table.props,
          data: tableData,
          columns: table.props.columns
        },
        on: {
          "current-change": onTableRowSelect,
          "checkbox-change": onTableCheckboxChange,
          "checkbox-all": onTableCheckboxChange
        },
        style: { background: "#fff", ...table.style },
        class: "pulldown-table",
        slot: "dropdown"
      };
      if (table.props.proxyConfig && table.props.proxyConfig.ajax) {
        props.props.proxyConfig = {
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
      this.selectValue = val;
    }
  },
  created() {
    this.onChange = utils.debounce(this.onInputChange, 400);
    this.selectValue = this.value;
    // this.inputChangeValue = this.value;
  },

  methods: {
    onTableRowSelect({ row }) {
      this.selectValue = row[this.valueField];
      this.$emit("change", this.selectValue, row);
      this.$refs.pulldownTable.hidePanel();
    },
    onTableCheckboxChange({ records }) {
      this.selectValue = records;
      this.$emit("change", this.selectValue);
    },

    onInputFocus(e) {
      this.$refs.pulldownTable.showPanel();
      this.$emit("showPanel", e);
      if (!this.allowInputValue) {
        this.selectValue = "";
      } else {
        this.inputChangeValue = this.selectValue;
      }
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
      }
    },

    onInputChange(e) {
      let { value } = e.target;
      console.log(value);
      if (e.type === "click") {
        value = "";
        this.$emit("change", "", {});
        return false;
      }
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
      this.inputChangeValue = value;

      this.$emit("inputChange", e);
    },
    onCancelChange(e) {
      if (e.type === "click") {
        this.$emit("change", "", {});
      }
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
      const { $refs, onInputEnter, valueField } = this;
      if (key == "Enter") {
        onInputEnter();
        return false;
      } else if (!(key == "ArrowDown" || key == "ArrowUp")) {
        // this.onChange(e);
        return false;
      }
      const dataTable = $refs.table;
      const tableData = dataTable.getData();
      const tableSelectedRow = dataTable.getCurrentRecord();

      if (!tableSelectedRow && tableData && tableData.length) {
        // 不存在选中的值，默认选中第一行
        dataTable.setCurrentRow(tableData[0]);
      } else if (tableData && tableData.length) {
        const index = tableData.findIndex(
          p => p[valueField] === tableSelectedRow[valueField]
        );
        let nextIndex = 0;
        if (key === "ArrowUp") {
          nextIndex = index - 1;
          if (nextIndex < 0) {
            nextIndex = 0;
          }
        } else {
          nextIndex = index + 1;
        }

        if (tableData[nextIndex]) {
          dataTable.setCurrentRow(tableData[nextIndex]);
        }
      }
    },
    onPulldownHide() {
      if (this.allowInputValue) {
        this.selectValue = this.inputChangeValue;
        // console.log("---", this.selectValue, this.inputChangeValue);
        this.$emit("change", this.selectValue, {});
      } else {
        // this.selectValue = this.inputChangeValue;
        this.$nextTick(() => {
          this.selectValue = this.value;
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
