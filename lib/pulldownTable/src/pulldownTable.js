"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.find-index");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.map");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.object.keys");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _dataTable = require("../../dataTable");

var _vxeTable = require("vxe-table");

var _init = require("../../init");

function renderInput(h, _vm) {
  var onInputFocus = _vm.onInputFocus,
      onInputKeyUp = _vm.onInputKeyUp,
      text = _vm.text,
      onInputChange = _vm.onInputChange,
      disabled = _vm.disabled;

  var onChange = _init.utils.debounce(onInputChange, 200);

  return h("a-input", {
    props: {
      placeholder: "请选择",
      value: text,
      disabled: disabled
    },
    on: {
      focus: onInputFocus,
      keyup: onInputKeyUp,
      change: onChange
    }
  });
}

var pulldownPropKeys = Object.keys(_vxeTable.Pulldown.props);
var _default = {
  name: "PulldownTable",
  components: {
    DataTable: _dataTable.DataTable
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
    disabled: Boolean
  },
  data: function data() {
    return {
      tableData: [],
      selectValue: ""
    };
  },
  computed: {
    text: function text() {
      var _this = this;

      var selectValue = this.selectValue;
      var text = "";

      if (selectValue && _init.utils.isArray(selectValue)) {
        text = selectValue.map(function (p) {
          return p[_this.textField];
        }).join(",");
      } else if (selectValue && _init.utils.isObject(selectValue)) {
        text = selectValue[this.textField];
      } else if (selectValue) {
        text = selectValue;
      }

      return text;
    },
    pulldownExtendProps: function pulldownExtendProps() {
      var _this2 = this;

      var rest = {};
      pulldownPropKeys.forEach(function (key) {
        rest[key] = _this2[key];
      });
      return rest;
    },
    pulldownProps: function pulldownProps() {
      var pulldownExtendProps = this.pulldownExtendProps,
          $scopedSlots = this.$scopedSlots;
      var propsData = this.$options.propsData;
      var props = Object.assign({}, pulldownExtendProps);
      Object.assign(props, {
        props: (0, _objectSpread2.default)({
          transfer: true,
          "destroy-on-close": true
        }, propsData)
      });
      props.ref = "pulldownTable";
      props.scopedSlots = $scopedSlots;
      props.class = "pulldown";
      return props;
    },
    tableProps: function tableProps() {
      var table = this.table,
          tableData = this.tableData,
          $scopedSlots = this.$scopedSlots,
          onTableRowSelect = this.onTableRowSelect,
          onTableCheckboxChange = this.onTableCheckboxChange;
      var props = {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, table.props), {}, {
          data: tableData,
          columns: table.props.columns
        }),
        on: {
          "current-change": onTableRowSelect,
          "checkbox-change": onTableCheckboxChange,
          "checkbox-all": onTableCheckboxChange
        },
        slot: "dropdown"
      };

      if (table.props.proxyConfig && table.props.proxyConfig.ajax) {
        props.props.proxyConfig = {
          ajax: (0, _objectSpread2.default)({}, table.props.proxyConfig.ajax)
        };
      }

      props.scopedSlots = $scopedSlots;
      props.ref = "table";
      return props;
    }
  },
  watch: {
    value: function value(val) {
      this.selectValue = val;
    }
  },
  created: function created() {
    this.selectValue = this.value;
  },
  methods: {
    onTableRowSelect: function onTableRowSelect(_ref) {
      var row = _ref.row;
      this.selectValue = row[this.valueField];
      this.$emit("change", this.selectValue, row);
      this.$refs.pulldownTable.hidePanel();
    },
    onTableCheckboxChange: function onTableCheckboxChange(_ref2) {
      var records = _ref2.records;
      this.selectValue = records;
      this.$emit("change", this.selectValue);
    },
    onInputFocus: function onInputFocus() {
      this.$refs.pulldownTable.showPanel();
      this.$emit("showPanel");
    },
    onInputChange: function onInputChange(e) {
      var value = e.target.value;
      var table = this.table,
          searchBefore = this.searchBefore,
          searchField = this.searchField;

      if (table.props.proxyConfig && table.props.proxyConfig.ajax && table.props.proxyConfig.ajax.query) {
        var params = {};
        params[searchField] = value;

        if (searchBefore) {
          var searchBeforeRes = searchBefore && searchBefore(params);

          if (searchBeforeRes === false) {
            return false;
          } else if (searchBeforeRes) {
            params = searchBeforeRes;
          }
        }

        var dataTable = this.$refs.table;
        dataTable.onSearchSubmit(params);
      }

      this.$emit("inputChange", e);
    },
    onInputEnter: function onInputEnter() {
      var dataTable = this.$refs.table;
      var pulldown = this.$refs.pulldownTable;
      var tableSelectedRow = dataTable.getCurrentRecord();

      if (tableSelectedRow && pulldown.isPanelVisible()) {
        this.onTableRowSelect({
          row: tableSelectedRow
        });
      } else {
        this.onInputFocus();
      }
    },
    // 快捷键上下切换选中行
    onInputKeyUp: function onInputKeyUp(_ref3) {
      var key = _ref3.key;
      var $refs = this.$refs,
          onInputEnter = this.onInputEnter,
          valueField = this.valueField;

      if (key == "Enter") {
        onInputEnter();
        return false;
      } else if (!(key == "ArrowDown" || key == "ArrowUp")) {
        return false;
      }

      var dataTable = $refs.table;
      var tableData = dataTable.getData();
      var tableSelectedRow = dataTable.getCurrentRecord();

      if (!tableSelectedRow && tableData && tableData.length) {
        // 不存在选中的值，默认选中第一行
        dataTable.setCurrentRow(tableData[0]);
      } else if (tableData && tableData.length) {
        var index = tableData.findIndex(function (p) {
          return p[valueField] === tableSelectedRow[valueField];
        });
        var nextIndex = 0;

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
    }
  },
  render: function render(h) {
    var tableProps = this.tableProps,
        pulldownProps = this.pulldownProps;
    return h("vxe-pulldown", pulldownProps, [renderInput(h, this), h("data-table", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, tableProps), {
      on: (0, _objectSpread2.default)({}, tableProps.on)
    }))]);
  }
};
exports.default = _default;