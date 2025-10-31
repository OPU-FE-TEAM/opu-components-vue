import { DataTable } from "../../dataTable";
import { Pulldown } from "vxe-table";
import { utils } from "../../init";
import SetColumns from "../../dataTable/src/setColumns";
import tableConf from "../../dataTable/conf";
function renderInput(h, _vm) {
  const {
    onInputFocus,
    onInputKeDown,
    onInputChangeBefore,
    text,
    selectValueText,
    disabled,
    inputProps,
    onInputKeyUp,
  } = _vm;
  return h("a-input", {
    props: {
      placeholder: selectValueText,
      disabled,
      allowClear: true,
      ...inputProps,
      value: text,
    },
    ref: "input",
    on: {
      focus: onInputFocus,
      keydown: onInputKeDown,
      keyup: onInputKeyUp,
      change: onInputChangeBefore,
    },
  });
}

const pulldownPropKeys = Object.keys(Pulldown.props);

export default {
  name: "PulldownTable",
  components: {
    DataTable,
    SetColumns,
  },
  props: {
    ...Pulldown.props,
    table: Object,
    valueField: {
      type: String,
      default: "id",
    },
    textField: {
      type: String,
      default: "name",
    },
    labelField: {
      type: String,
      default: "",
    },
    searchBefore: Function,
    searchField: {
      type: String,
      default: "keyword",
    },
    value: {
      type: [Object, Array, String, Number],
    },
    disabled: Boolean,
    inputProps: {
      type: [Object],
    },
    //是否focus时保留原值搜索
    retainSearchValue: {
      type: Boolean,
      default: true,
    },
    //是否focus时保留原查询关键词搜索
    retainSearchKeyword: {
      type: Boolean,
      default: false,
    },
    //其他插槽
    otherSlot: {
      type: [Function],
      default: null,
    },
    popupClassName: {
      type: String,
      default: "",
    },
    popupStyle: {
      type: String,
      default: "",
    },
    // 允许输入值
    allowInputValue: Boolean,
  },

  data() {
    return {
      visible: false,
      multiple: false,
      tableData: [],
      selectValue: "",
      currentValue: "",
      inputChangeValue: "",
      timer: null,
      checkboxIndex: -1,
      searchKeyword: "",
    };
  },
  computed: {
    selectValueText() {
      const { selectValue } = this;
      let text = "";
      // 显示上次搜索关键词为灰色
      // if (this.retainSearchKeyword && this.searchKeyword) {
      //   return this.searchKeyword;
      // }
      if (selectValue && utils.isArray(selectValue)) {
        text = selectValue
          .map(p => p[this.labelField || this.textField])
          .join(",");
      } else if (selectValue && utils.isObject(selectValue)) {
        text = selectValue[this.labelField || this.textField];
      } else if (selectValue || selectValue == 0) {
        text = selectValue;
      }
      return text;
    },
    text() {
      const { currentValue } = this;
      let text = "";
      if (currentValue && utils.isArray(currentValue)) {
        text = currentValue
          .map(p => p[this.labelField || this.textField])
          .join(",");
      } else if (currentValue && utils.isObject(currentValue)) {
        text = currentValue[this.labelField || this.textField];
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
          transfer: true,
          destroyOnClose: true,
          ...propsData,
        },
      });
      props.ref = "pulldownTable";
      props.class = "pulldown";
      props.on = {
        "hide-panel": this.onPulldownHideBefore,
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
        onTableCheckboxChange,
        onTableCurrentChange,
        onTableSetColumnsShow,
      } = that;
      //是否存在多选  若存在  多选checkbox索引
      let columns = (table && table.props && table.props.columns) || [];
      that.checkboxIndex = columns.findIndex(p => p.type == "checkbox");
      const props = {
        props: {
          highlightHoverRow: true,
          highlightCurrentRow: true,
          defaultSelectFristRow: true,
          "show-overflow": true,
          ...table.props,
          data: tableData,
          columns: columns,
        },
        on: {
          "cell-click": onTableRowSelect,
          "checkbox-change": onTableCheckboxChange,
          "checkbox-all": onTableCheckboxChange,
          "current-change": onTableCurrentChange,
        },
        style: { background: "#fff", ...table.style },
        class: "pulldown-table",
        slot: "dropdown",
      };
      if (props.props.setcolumnsConfig) {
        props.props.setcolumnsConfig.onShow = onTableSetColumnsShow;
      }
      if (table.props.proxyConfig && table.props.proxyConfig.ajax) {
        props.props.proxyConfig = {
          ...table.props.proxyConfig,
          ajax: {
            ...table.props.proxyConfig.ajax,
          },
        };
      }
      props.scopedSlots = $scopedSlots;
      props.ref = "table";
      return props;
    },
    setColumnsOpt() {
      const setcolumnsConfig = this.tableProps.props.setcolumnsConfig;
      if (setcolumnsConfig) {
        const modalProps =
          setcolumnsConfig &&
          setcolumnsConfig.modal &&
          setcolumnsConfig.modal.props
            ? setcolumnsConfig.modal.props
            : {};

        const proxyConfigProps =
          setcolumnsConfig &&
          setcolumnsConfig.proxyConfig &&
          setcolumnsConfig.proxyConfig.props
            ? setcolumnsConfig.proxyConfig.props
            : {};

        const proxyConfigAjax =
          setcolumnsConfig &&
          setcolumnsConfig.proxyConfig &&
          setcolumnsConfig.proxyConfig.ajax
            ? setcolumnsConfig.proxyConfig.ajax
            : {};

        const proxyConfigOn =
          setcolumnsConfig &&
          setcolumnsConfig.proxyConfig &&
          setcolumnsConfig.proxyConfig.on
            ? setcolumnsConfig.proxyConfig.on
            : {};

        const tableConfig =
          setcolumnsConfig && setcolumnsConfig.tableConfig
            ? setcolumnsConfig.tableConfig
            : {};
        return {
          ...tableConf.setColumns,
          modal: {
            props: {
              zIndex: 9999,
              transfer: true,
              ...tableConf.setColumns.modal.props,
              ...modalProps,
            },
          },
          proxyConfig: {
            params:
              setcolumnsConfig &&
              setcolumnsConfig.proxyConfig &&
              setcolumnsConfig.proxyConfig.params
                ? setcolumnsConfig.proxyConfig.params
                : null,
            props: {
              ...tableConf.setColumns.proxyConfig.props,
              ...proxyConfigProps,
            },
            ajax: {
              ...tableConf.setColumns.proxyConfig.ajax,
              ...proxyConfigAjax,
            },
            on: {
              ...tableConf.setColumns.proxyConfig.on,
              ...proxyConfigOn,
            },
          },
          tableConfig: {
            ...tableConf.setColumns.tableConfig,
            ...tableConfig,
          },
        };
      } else {
        return tableConf.setColumns;
      }
    },
  },
  watch: {
    value(val) {
      this.currentValue = val;
      this.selectValue = val;
    },
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
      if (
        (checkboxIndex < 0 || checkboxIndex != columnIndex) &&
        this.selectValue != row &&
        this.visible
      ) {
        let text = row[this.labelField || this.textField];
        this.selectValue = row;
        this.currentValue = row;
        this.$emit("input", text);
        this.$emit("change", text, row);
        this.visible = false;
      }
    },
    onTableCurrentChange({ row, columnIndex }) {
      let { checkboxIndex } = this;
      if (checkboxIndex < 0 || checkboxIndex != columnIndex) {
        let text = row[this.labelField || this.textField];
        this.$emit("current-change", text, row);
      }
    },
    onTableCheckboxChange({ records }) {
      this.selectValue = records;
      this.currentValue = records;
      this.$emit("change", this.selectValue);
    },
    onInputFocus(e) {
      this.$emit("focus", e);
      this.onInputFocusBefore(e);
    },
    onInputFocusBefore(e) {
      let that = this;
      const { table, searchBefore, searchField, retainSearchValue } = that;
      that.visible = true;
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
          const dataTable = that.$refs.table;
          let params = {};

          if (that.retainSearchKeyword) {
            params[searchField] = that.searchKeyword;
            // 保留上次搜索关键词并选中
            that.currentValue = that.searchKeyword;
            setTimeout(() => {
              that.select();
            }, 100);
          } else {
            params[searchField] = retainSearchValue ? that.selectValueText : "";
          }
          if (searchBefore) {
            const searchBeforeRes = searchBefore && searchBefore(params);
            if (searchBeforeRes === false) {
              return false;
            } else if (searchBeforeRes) {
              params = searchBeforeRes;
            }
          }
          dataTable.onSearchSubmit(params);
          that.searchKeyword = params[searchField];
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
        if (!this.visible) {
          this.visible = true;
          this.$emit("showPanel", e);
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
          params[searchField] = value.replace(/(^\s*)|(\s*$)/g, "");
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
          this.searchKeyword = params[searchField];
        }

        this.$emit("inputChange", e);
      }, 300);
    },
    onClear(value) {
      if (
        this.visible &&
        this.searchKeyword &&
        this.currentValue == this.searchKeyword
      ) {
        this.onInputChange({
          target: {
            value: "",
          },
        });
        return;
      }
      this.selectValue = "";
      this.currentValue = "";
      this.searchKeyword = "";
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
      this.visible = false;
      this.$emit("inputPressEnter", e);
    },
    onInputKeDown(e) {
      const { key } = e;
      if (key == "Tab") {
        this.visible = false;
      }
      this.$emit("keydown", e);
    },
    // 快捷键上下切换选中行
    onInputKeyUp(e) {
      const { key } = e;
      const { onInputEnter, onInputFocusBefore, visible } = this;
      if (key == "Enter") {
        if (visible) {
          onInputEnter(e);
        }
      }
      if (!visible && key == "ArrowDown") {
        onInputFocusBefore(e);
      }
    },
    onPulldownHideBefore({ $event: e }) {
      let that = this;
      const dataTable = that.$refs.table;
      const tableData = dataTable.getTableData();
      if (tableData.tableData && tableData.tableData.length == 0) {
        this.searchKeyword = "";
      }
      that.onPulldownHide(e);
      // let isContains = false;

      // let event = e || window.event;
      // let target = event.target || event.srcElement;
      // let pathIndex = 0;
      // while (target.parentNode === null) {
      //   pathIndex++;
      //   target = event.path[pathIndex];
      // }
      // //下拉
      // let selectEl = document.getElementsByClassName("ant-select-dropdown");
      // //表头
      // let setTableColumnEl = document.getElementsByClassName(
      //   "set-columns-modal"
      // );
      // //特殊处理数组
      // let specialEl = [...setTableColumnEl, ...selectEl];

      // for (let i = 0; i < specialEl.length; i++) {
      //   let el = specialEl[i];
      //   isContains = el.contains(target);
      //   if (isContains) {
      //     break;
      //   }
      // }
      // if (!isContains) {
      //   that.onPulldownHide();
      // }
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

      this.visible = false;
    },
    onSetColumnsSubmit(e) {
      const dataTable = this.$refs.table;
      if (dataTable) {
        dataTable.setTableColumns(e);
      }
    },
    onTableSetColumnsShow() {
      if (this.$refs.setTableColumnsModal) {
        this.$refs.setTableColumnsModal.show();
      }
      return false;
    },
  },
  render(h) {
    const {
      tableProps,
      pulldownProps,
      visible,
      onSetColumnsSubmit,
      setColumnsOpt,
    } = this;

    return h(
      "vxe-pulldown",
      {
        ...pulldownProps,
        props: {
          ...pulldownProps.props,
          value: visible,
        },
        ...{
          on: { ...pulldownProps.on },
        },
      },
      [
        renderInput(h, this),
        h(
          "div",
          {
            slot: "dropdown",
            class: this.popupClassName,
            style: this.popupStyle,
          },
          [
            this.otherSlot && this.otherSlot(),
            h("data-table", {
              ...tableProps,
              ...{
                on: { ...tableProps.on },
              },
            }),
            setColumnsOpt.tableConfig &&
              h("set-columns", {
                ref: "setTableColumnsModal",
                props: {
                  option: setColumnsOpt,
                  columns: tableProps.props.columns,
                },
                on: {
                  submit: onSetColumnsSubmit,
                },
              }),
          ],
        ),
      ],
    );
  },
};
