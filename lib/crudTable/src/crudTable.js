"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _vue = _interopRequireDefault(require("vue"));

var _dataForm = require("../../dataForm");

var _dataTable = require("../../dataTable");

var _formModal = _interopRequireDefault(require("./formModal"));

var _conf = _interopRequireDefault(require("../conf"));

var _utils = _interopRequireDefault(require("../../utils"));

function renderFormModal(modalOpt, formOpt, h, _vm) {
  var onFormModalSubmit = _vm.onFormModalSubmit,
      onFormModalCancel = _vm.onFormModalCancel,
      $scopedSlots = _vm.$scopedSlots;
  return h("FormModal", {
    ref: "formModal",
    props: {
      modal: modalOpt,
      form: formOpt
    },
    on: {
      submit: onFormModalSubmit,
      cancel: onFormModalCancel
    },
    scopedSlots: $scopedSlots
  });
}

var _default2 = {
  name: "CrudTable",
  components: {
    DataForm: _dataForm.DataForm,
    DataTable: _dataTable.DataTable,
    FormModal: _formModal.default
  },
  props: {
    form: Object,
    modal: {
      type: Object,
      default: function _default() {}
    },
    table: Object,
    proxyConfig: Object,
    permissions: [Boolean, Array]
  },
  computed: {
    proxyConfigOpt: function proxyConfigOpt() {
      var option = {}; // 新增

      if (this.proxyConfig && this.proxyConfig.add) {
        var addProps = this.proxyConfig.add && this.proxyConfig.add.props ? this.proxyConfig.add.props : {};
        option.add = (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig.add), this.proxyConfig.add), {}, {
          props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig.add.props), addProps)
        });
      } else {
        option.add = _conf.default.proxyConfig.add;
      } // 编辑


      if (this.proxyConfig && this.proxyConfig.edit) {
        var editProps = this.proxyConfig.edit && this.proxyConfig.edit.props ? this.proxyConfig.edit.props : {};
        option.edit = (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig.edit), this.proxyConfig.edit), {}, {
          props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig.edit.props), editProps)
        });
      } else {
        option.edit = _conf.default.proxyConfig.edit;
      } //删除


      if (this.proxyConfig && this.proxyConfig.del) {
        var delProps = this.proxyConfig.del && this.proxyConfig.del.props ? this.proxyConfig.del.props : {};
        option.del = (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig.del), this.proxyConfig.del), {}, {
          props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig.del.props), delProps)
        });
      } else {
        option.del = _conf.default.proxyConfig.del;
      } //查看


      if (this.proxyConfig && this.proxyConfig.view) {
        var viewProps = this.proxyConfig.view && this.proxyConfig.view.props ? this.proxyConfig.view.props : {};
        option.view = (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig.view), this.proxyConfig.view), {}, {
          props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig.view.props), viewProps)
        });
      } else {
        option.view = _conf.default.proxyConfig.view;
      }

      return option;
    },
    tableProps: function tableProps() {
      var table = this.table,
          tableData = this.tableData,
          onToobarButtonClick = this.onToobarButtonClick,
          $scopedSlots = this.$scopedSlots,
          proxyConfig = this.proxyConfig,
          proxyConfigOpt = this.proxyConfigOpt,
          renderRowAction = this.renderRowAction,
          permissions = this.permissions,
          view = this.view;
      var permissionsArr = permissions ? permissions : _conf.default.permissions;
      var props = {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.table), table.props), {}, {
          data: tableData,
          columns: table.props.columns
        }),
        on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, table.on), {}, {
          toobarButtonClick: onToobarButtonClick
        })
      }; // 处理查看触发事件

      if (proxyConfig.view && proxyConfigOpt.view.trigger) {
        // 绑定单击事件
        if (proxyConfigOpt.view.trigger.includes("click")) {
          props.on["cell-click"] = function (_ref) {
            var row = _ref.row;
            view(row);
          };
        } // 双击


        if (proxyConfigOpt.view.trigger.includes("dblclick")) {
          props.on["cell-dblclick"] = function (_ref2) {
            var row = _ref2.row;
            view(row);
          };
        }
      } // 不存在新增按钮，自动生成


      if (!(props.props.headToolbar && props.props.headToolbar.buttons) && proxyConfig.add) {
        var addButtonProps = proxyConfigOpt.add.props;

        if (proxyConfig.add && proxyConfig.add.permission && !_utils.default.hasEquaValueArray(permissionsArr, proxyConfig.add.permission)) {
          // 无权限
          addButtonProps.disabled = true;
        }

        props.props.headToolbar.buttons = [(0, _objectSpread2.default)({
          name: "新增",
          code: "add",
          type: "primary"
        }, addButtonProps)];
      } // 不存在行操作插槽，自动生成


      if (proxyConfig && (proxyConfig.edit || proxyConfig.del) && !$scopedSlots.rowAction) {
        $scopedSlots["rowAction"] = renderRowAction;
      }

      props.scopedSlots = $scopedSlots;
      props.ref = "table";
      return props;
    }
  },
  data: function data() {
    return {
      tableData: [],
      currentAction: ""
    };
  },
  methods: {
    onToobarButtonClick: function onToobarButtonClick(code) {
      var add = this.add;

      switch (code) {
        case "add":
          add();
          break;

        default:
          break;
      }
    },
    onFormModalSubmit: function onFormModalSubmit(values) {
      var _this = this;

      var proxyConfig = this.proxyConfig,
          currentAction = this.currentAction;

      if (proxyConfig && proxyConfig[currentAction] && proxyConfig[currentAction].submit) {
        var formModal = this.$refs.formModal;
        proxyConfig[currentAction].submit(values).then(function (res) {
          formModal && formModal.onCancel();
          var successMsgCode = proxyConfig[currentAction].successMsgCode ? proxyConfig[currentAction].successMsgCode : _conf.default.proxyConfig[currentAction].successMsgCode;
          var responseCodeField = proxyConfig[currentAction].responseCodeField ? proxyConfig[currentAction].responseCodeField : _conf.default.proxyConfig[currentAction].responseCodeField;

          if ((successMsgCode || successMsgCode == 0) && responseCodeField) {
            var resCode = responseCodeField ? _utils.default.getObjData(responseCodeField, res) : "";

            if (resCode === successMsgCode) {
              _this.formModalSubmitMessage(res);
            }
          } else {
            _this.formModalSubmitMessage(res);
          }

          _this.reloadTable();
        }).catch(function () {
          formModal && formModal.setConfirmLoading(false);
        });
      }
    },
    formModalSubmitMessage: function formModalSubmitMessage(res) {
      var proxyConfig = this.proxyConfig,
          currentAction = this.currentAction;
      var responseMsgField = proxyConfig[currentAction].responseMsgField ? proxyConfig[currentAction].responseMsgField : _conf.default.proxyConfig[currentAction].responseMsgField;
      var resMsg = responseMsgField ? _utils.default.getObjData(responseMsgField, res) : "";
      var msg = resMsg ? resMsg : "操作成功";
      this.$message.success(msg);
    },
    onFormModalCancel: function onFormModalCancel() {
      if (this.modal.on && this.modal.on.cancel) {
        this.modal.on.cancel();
      }
    },
    reloadTable: function reloadTable(params) {
      this.$refs.table.reload(params);
    },
    // 渲染自动生成操作行的插槽
    renderRowAction: function renderRowAction(scope) {
      var proxyConfig = this.proxyConfig,
          edit = this.edit,
          del = this.del,
          view = this.view,
          permissions = this.permissions,
          proxyConfigOpt = this.proxyConfigOpt,
          $scopedSlots = this.$scopedSlots;
      var vm = new _vue.default();
      var h = vm.$createElement;
      var permissionsArr = permissions ? permissions : _conf.default.permissions;
      var buttons = []; // 查看

      if (proxyConfig && proxyConfig.view && proxyConfigOpt.view.trigger.includes("button")) {
        var viewButtonProps = proxyConfigOpt.view.props;

        if (_utils.default.isArray(proxyConfig.view.permission) && !_utils.default.hasEquaValueArray(permissionsArr, proxyConfig.view.permission)) {
          // 无权限
          viewButtonProps.disabled = true;
        } else if (_utils.default.isFunction(proxyConfig.view.permission)) {
          var res = proxyConfig.view.permission(scope);
          viewButtonProps.disabled = !res;
        }

        buttons.push(h("a-button", {
          props: viewButtonProps,
          on: {
            click: function click() {
              view(scope.row);
            }
          }
        }, viewButtonProps.name ? viewButtonProps.name : "查看"));
      } // 编辑


      if (proxyConfig && proxyConfig.edit) {
        var editButtonProps = proxyConfigOpt.edit.props;

        if (_utils.default.isArray(proxyConfig.edit.permission) && !_utils.default.hasEquaValueArray(permissionsArr, proxyConfig.edit.permission)) {
          // 无权限
          editButtonProps.disabled = true;
        } else if (_utils.default.isFunction(proxyConfig.edit.permission)) {
          var _res = proxyConfig.edit.permission(scope);

          editButtonProps.disabled = !_res;
        }

        buttons.push(h("a-button", {
          props: editButtonProps,
          on: {
            click: function click(e) {
              edit(scope.row, e);
            }
          }
        }, editButtonProps.name ? editButtonProps.name : "编辑"));
      } // 删除按钮


      if (proxyConfig && proxyConfig.del) {
        var delButtonProps = proxyConfigOpt.del.props;

        if (_utils.default.isArray(proxyConfig.del.permission) && !_utils.default.hasEquaValueArray(permissionsArr, proxyConfig.del.permission)) {
          // 无权限
          delButtonProps.disabled = true;
        } else if (_utils.default.isFunction(proxyConfig.del.permission)) {
          var _res2 = proxyConfig.del.permission(scope);

          delButtonProps.disabled = !_res2;
        }

        if (delButtonProps.disabled) {
          buttons.push(h("a-button", {
            props: delButtonProps
          }, delButtonProps.name ? delButtonProps.name : "删除"));
        } else {
          buttons.push(h("a-popconfirm", {
            props: {
              title: proxyConfigOpt.del.popconfirmTitle
            },
            on: {
              confirm: function confirm() {
                del(scope.row);
              }
            }
          }, [h("a-button", {
            props: delButtonProps
          }, delButtonProps.name ? delButtonProps.name : "删除")]));
        }
      } //前置插槽


      var rowActionBefore = "";

      if ($scopedSlots.rowActionBefore) {
        rowActionBefore = $scopedSlots.rowActionBefore(scope);
      } //后置插槽


      var rowActionAfter = "";

      if ($scopedSlots.rowActionAfter) {
        rowActionAfter = $scopedSlots.rowActionAfter(scope);
      }

      return h("div", {
        class: "crud-table-row-actions"
      }, [rowActionBefore, buttons, rowActionAfter]);
    },
    add: function add(e) {
      if (e) e.target.blur();
      var proxyConfig = this.proxyConfig,
          proxyConfigOpt = this.proxyConfigOpt,
          filterFormItems = this.filterFormItems;
      var addButtonProps = proxyConfigOpt.add.props;
      var openCallback = "";

      if (proxyConfig && proxyConfig.add && proxyConfig.add.open) {
        var openRes = proxyConfig.add.open();

        if (openRes === false) {
          return false;
        } else if (openRes && _utils.default.isFunction(openRes)) {
          openCallback = openRes;
        }
      }

      this.currentAction = "add";
      var formModal = this.$refs.formModal;

      if (!formModal) {
        return false;
      }

      formModal.setReadonly(false);
      formModal.setTitle(proxyConfig.add.modalTitle ? proxyConfig.add.modalTitle : addButtonProps.name);
      formModal.setItems(filterFormItems(this.currentAction));
      formModal.show(openCallback, this.currentAction);
      formModal.loadOptionsData();
      formModal.setLoading(false);
    },
    edit: function edit(row, e) {
      if (e) e.target.blur();
      var proxyConfig = this.proxyConfig,
          proxyConfigOpt = this.proxyConfigOpt,
          filterFormItems = this.filterFormItems;
      var editButtonProps = proxyConfigOpt.edit.props;
      var openCallback = "";

      if (proxyConfig && proxyConfig.edit && proxyConfig.edit.open) {
        var openRes = proxyConfig.edit.open(row);

        if (openRes === false) {
          return false;
        } else if (openRes && _utils.default.isFunction(openRes)) {
          openCallback = openRes;
        }
      }

      this.currentAction = "edit";
      var formModal = this.$refs.formModal;

      if (!formModal) {
        return false;
      }

      formModal.setTitle(proxyConfig.edit.modalTitle ? proxyConfig.edit.modalTitle : editButtonProps.name);
      formModal.setItems(filterFormItems(this.currentAction));
      formModal.setReadonly(false);
      formModal.show(openCallback, this.currentAction);

      if (proxyConfig && proxyConfig.edit && proxyConfig.edit.query) {
        proxyConfig.edit.query(row).then(function (res) {
          var data = res;
          var queryDataField = proxyConfig.edit.queryDataField != undefined ? proxyConfig.edit.queryDataField : _conf.default.proxyConfig.edit.queryDataField;

          if (queryDataField) {
            data = _utils.default.getObjData(queryDataField, res);
          }

          formModal.setFormData(data);
        });
      } else {
        setTimeout(function () {
          formModal.setFormData(row);
        }, 100);
      }
    },
    del: function del(row) {
      this.currentAction = "del";
      this.onFormModalSubmit(row);
    },
    view: function view(row) {
      var proxyConfig = this.proxyConfig,
          proxyConfigOpt = this.proxyConfigOpt,
          filterFormItems = this.filterFormItems;
      var viewButtonProps = proxyConfigOpt.view.props;
      var openCallback = "";

      if (proxyConfig && proxyConfig.view && proxyConfig.view.open) {
        var openRes = proxyConfig.view.open(row);

        if (openRes === false) {
          return false;
        } else if (openRes && _utils.default.isFunction(openRes)) {
          openCallback = openRes;
        }
      }

      this.currentAction = "view";
      var formModal = this.$refs.formModal;

      if (!formModal) {
        return false;
      }

      formModal.setReadonly(true);
      formModal.setTitle(proxyConfig.view.modalTitle ? proxyConfig.view.modalTitle : viewButtonProps.name);
      formModal.setItems(filterFormItems(this.currentAction));
      formModal.show(openCallback, this.currentAction);

      if (proxyConfig && proxyConfig.view && proxyConfig.view.query) {
        proxyConfig.view.query(row).then(function (res) {
          var data = res;
          var queryDataField = proxyConfig.view.queryDataField != undefined ? proxyConfig.view.queryDataField : _conf.default.proxyConfig.view.queryDataField;

          if (queryDataField) {
            data = _utils.default.getObjData(queryDataField, res);
          }

          formModal.setFormData(data);
        });
      } else {
        formModal.setFormData(row);
      }
    },
    filterFormItems: function filterFormItems(type) {
      var form = this.form;
      var items = form.props.items.filter(function (item) {
        if (item.filter && !item.filter.includes(type)) {
          return false;
        }

        return true;
      });
      return items;
    },
    getTableData: function getTableData() {
      return this.$refs.table.getData();
    },
    getRefs: function getRefs() {
      return this.$refs;
    }
  },
  render: function render(h) {
    var tableProps = this.tableProps,
        modal = this.modal,
        form = this.form,
        $slots = this.$slots;
    var formDom = "";

    if (modal && form) {
      formDom = renderFormModal(modal, form, h, this);
    }

    var slots = Object.keys($slots).map(function (name) {
      return h("template", {
        "slot": name
      }, [$slots[name]]);
    });
    return h("div", {
      class: "crud-table"
    }, [formDom, [h("data-table", (0, _objectSpread2.default)({}, tableProps), slots)]]);
  }
};
exports.default = _default2;