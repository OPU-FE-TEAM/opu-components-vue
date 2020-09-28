"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.string.fixed");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _vue = _interopRequireDefault(require("vue"));

var _utils = _interopRequireDefault(require("../../utils"));

var _sortablejs = _interopRequireDefault(require("sortablejs"));

var _conf = _interopRequireDefault(require("../conf"));

var _default2 = {
  name: "SetColumns",
  components: {},
  props: {
    option: {
      type: Object,
      default: function _default() {}
    },
    columns: Array
  },
  data: function data() {
    return {
      visible: false,
      tableData: []
    };
  },
  computed: {
    query: function query() {
      var option = this.option;
      return option.proxyConfig && option.proxyConfig.ajax && option.proxyConfig.ajax.query ? option.proxyConfig.ajax.query : null;
    },
    propsConfig: function propsConfig() {
      var option = this.option;
      return option.proxyConfig && option.proxyConfig.props ? (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.setColumns.proxyConfig.props), option.proxyConfig.props) : _conf.default.setColumns.proxyConfig.props;
    },
    submit: function submit() {
      var option = this.option;
      return option.proxyConfig && option.proxyConfig.ajax && option.proxyConfig.ajax.submit ? option.proxyConfig.ajax.submit : null;
    },
    modalOpt: function modalOpt() {
      var option = this.option;
      return option.modal && option.modal.props ? (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.setColumns.modal.props), option.modal.props) : _conf.default.setColumns.modal.props;
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.sortable) {
      this.sortable.destroy();
    }
  },
  methods: {
    show: function show() {
      this.visible = true;
      var query = this.query,
          columns = this.columns,
          handelColumns = this.handelColumns;

      if (query) {
        this.fetchColumns();
      } else {
        this.tableData = handelColumns(_utils.default.clone(columns));
        this.treeDrop();
      }
    },
    handelColumns: function handelColumns(data) {
      return data ? data.map(function (item) {
        if (item.show !== false) {
          item.show = true;
        }

        if (!item.defaultTitle) {
          item.defaultTitle = item.title;
        }

        if (!item.fixed) {
          item.fixed = "";
        }

        return item;
      }) : [];
    },
    fetchColumns: function fetchColumns() {
      var _this = this;

      var query = this.query,
          propsConfig = this.propsConfig,
          handelColumns = this.handelColumns; // const json = {
      //   ...getOpt.param
      // };

      query().then(function (res) {
        // const dataField = getOpt.dataField ? getOpt.dataField : "data";
        var data = _utils.default.getObjData(propsConfig.list, res);

        _this.tableData = handelColumns(data);

        _this.treeDrop();
      });
    },
    treeDrop: function treeDrop() {
      var _this2 = this;

      this.$nextTick(function () {
        var xTable = _this2.$refs.table;
        _this2.sortable2 = _sortablejs.default.create(xTable.$el.querySelector(".columns-table .body--wrapper>.vxe-table--body tbody"), {
          handle: ".drag-btn",
          onEnd: function onEnd(_ref) {
            var item = _ref.item,
                oldIndex = _ref.oldIndex;
            var options = {
              children: "children"
            };
            var targetTrElem = item;
            var wrapperElem = targetTrElem.parentNode;
            var prevTrElem = targetTrElem.previousElementSibling;
            var tableTreeData = _this2.tableData;
            var selfRow = xTable.getRowNode(targetTrElem).item;

            var selfNode = _utils.default.findTree(tableTreeData, function (row) {
              return row === selfRow;
            }, options);

            if (prevTrElem) {
              // 移动到节点
              var prevRow = xTable.getRowNode(prevTrElem).item;

              var prevNode = _utils.default.findTree(tableTreeData, function (row) {
                return row === prevRow;
              }, options);

              if (_utils.default.findTree(selfRow[options.children], function (row) {
                return prevRow === row;
              }, options)) {
                // 错误的移动
                var oldTrElem = wrapperElem.children[oldIndex];
                wrapperElem.insertBefore(targetTrElem, oldTrElem);
                return _this2.$XModal.message({
                  message: "不允许自己给自己拖动！",
                  status: "error"
                });
              }

              if (xTable.isTreeExpandByRow(prevRow)) {
                var _currRow = selfNode.items.splice(selfNode.index, 1)[0]; // 移动到当前的子节点

                prevRow[options.children].splice(0, 0, _currRow);
              } else {
                var prevNodeParentKey = prevNode.parent && prevNode.parent._XID ? prevNode.parent._XID : "";
                var selfNodeParentKey = selfNode.parent && selfNode.parent._XID ? selfNode.parent._XID : "";

                if (prevNodeParentKey === selfNodeParentKey) {
                  var _currRow2 = selfNode.items.splice(selfNode.index, 1)[0]; // 移动到相邻节点

                  prevNode.items.splice(prevNode.index + (selfNode.index < prevNode.index ? 0 : 1), 0, _currRow2);
                }
              }
            } else {
              // 移动到第一行
              var currRow = selfNode.items.splice(selfNode.index, 1)[0];
              tableTreeData.unshift(currRow);
            } // 如果变动了树层级，需要刷新数据


            xTable.syncData();
          }
        });
      });
    },
    renderShowEdit: function renderShowEdit(scope) {
      var vm = new _vue.default();
      var h = vm.$createElement;
      return h("a-checkbox", {
        props: {
          checked: scope.row.show
        },
        on: {
          input: function input(checked) {
            scope.row.show = checked;
          }
        }
      });
    },
    getData: function getData() {
      var table = this.$refs.table;
      return table.getTableData();
    },
    onCancel: function onCancel() {
      this.visible = false;
    },
    onSubmit: function onSubmit() {
      var _this3 = this;

      var submit = this.submit;
      var data = this.getData();
      var tableData = data.tableData;
      var newTableData = tableData.map(function (item) {
        if (!(item.fixed === "left" || item.fixed === "right")) {
          delete item.fixed;
        }

        return item;
      });

      if (submit) {
        submit(newTableData).then(function () {
          _this3.visible = false;

          _this3.$emit("submit");
        });
      } else {
        this.visible = false;
        this.$emit("submit", newTableData);
      }
    }
  },
  render: function render(h) {
    var tableData = this.tableData,
        renderShowEdit = this.renderShowEdit,
        modalOpt = this.modalOpt,
        visible = this.visible,
        onSubmit = this.onSubmit,
        onCancel = this.onCancel;
    var dropBtn = h("span", {
      "class": "drag-btn"
    }, [h("i", {
      "class": "vxe-icon--menu"
    })]);
    var tableColumn = [{
      width: 60,
      align: "center",
      slots: {
        default: "btn_default",
        header: function header() {
          return "排序";
        }
      }
    }, {
      field: "defaultTitle",
      title: "默认标题",
      align: "center",
      treeNode: true
    }, {
      field: "title",
      title: "显示标题",
      align: "center",
      editRender: {
        name: "AInput"
      }
    }, {
      field: "width",
      title: "列宽",
      align: "center",
      editRender: {
        name: "AInputNumber"
      }
    }, {
      field: "align",
      title: "对齐方式",
      align: "center",
      editRender: {
        name: "ASelect",
        options: [{
          label: "居左",
          value: "left"
        }, {
          label: "居中",
          value: "center"
        }, {
          label: "居右",
          value: "right"
        }]
      }
    }, {
      field: "show",
      title: "显示",
      align: "center",
      slots: {
        default: "show_default"
      }
    }, {
      field: "fixed",
      title: "固定",
      align: "center",
      editRender: {
        name: "ASelect",
        options: [{
          label: "不固定",
          value: ""
        }, {
          label: "靠左",
          value: "left"
        }, {
          label: "靠右",
          value: "right"
        }]
      }
    }];
    var modalProps = (0, _objectSpread2.default)({}, modalOpt);
    return h("a-modal", {
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({
        title: modalProps.title ? modalProps.title : "设置表头",
        width: 800
      }, modalProps), {}, {
        visible: visible
      }),
      on: {
        cancel: onCancel,
        ok: onSubmit
      },
      class: "advanced-search-modal"
    }, [h("vxe-grid", {
      class: "columns-table",
      ref: "table",
      props: {
        border: true,
        rowKey: true,
        columns: tableColumn,
        data: tableData,
        treeConfig: {
          children: "children"
        },
        editConfig: {
          trigger: "click",
          mode: "row"
        },
        checkboxConfig: {
          checkStrictly: true
        }
      },
      scopedSlots: {
        btn_default: function btn_default() {
          return dropBtn;
        },
        show_default: renderShowEdit
      }
    }, []) //   h(
    //     "SetColums",
    //     {
    //       ref:"setColumsTable",
    //       props:{
    //         option:setColumnsOpt
    //       }
    //     }
    //   )
    ]);
  }
};
exports.default = _default2;