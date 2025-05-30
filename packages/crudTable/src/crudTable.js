import Vue from "vue";
import { DataForm } from "../../dataForm";
import { DataTable } from "../../dataTable";
import FormModal from "./formModal";
import config from "../conf";
import utils from "../../utils";

function renderFormModal(modalOpt, formOpt, h, _vm) {
  const { onFormModalSubmit, onFormModalCancel, $scopedSlots } = _vm;
  return h("FormModal", {
    ref: "formModal",
    props: {
      modal: modalOpt,
      form: formOpt,
      onOptionsLoadAfter: _vm.onOptionsLoadAfter
    },
    on: {
      submit: onFormModalSubmit,
      cancel: onFormModalCancel
    },
    scopedSlots: $scopedSlots
  });
}

export default {
  name: "CrudTable",
  components: {
    DataForm,
    DataTable,
    FormModal
  },
  props: {
    form: Object,
    modal: {
      type: Object,
      default: () => ({})
    },
    table: Object,
    proxyConfig: Object,
    permissions: [Boolean, Array]
  },
  computed: {
    proxyConfigOpt() {
      let option = {};
      // 新增
      if (this.proxyConfig && this.proxyConfig.add) {
        const addProps =
          this.proxyConfig.add && this.proxyConfig.add.props
            ? this.proxyConfig.add.props
            : {};
        option.add = {
          ...config.proxyConfig.add,
          ...this.proxyConfig.add,
          props: {
            ...config.proxyConfig.add.props,
            ...addProps
          }
        };
      } else {
        option.add = config.proxyConfig.add;
      }
      // 编辑
      if (this.proxyConfig && this.proxyConfig.edit) {
        const editProps =
          this.proxyConfig.edit && this.proxyConfig.edit.props
            ? this.proxyConfig.edit.props
            : {};
        option.edit = {
          ...config.proxyConfig.edit,
          ...this.proxyConfig.edit,
          props: {
            ...config.proxyConfig.edit.props,
            ...editProps
          }
        };
      } else {
        option.edit = config.proxyConfig.edit;
      }
      //删除
      if (this.proxyConfig && this.proxyConfig.del) {
        const delProps =
          this.proxyConfig.del && this.proxyConfig.del.props
            ? this.proxyConfig.del.props
            : {};
        option.del = {
          ...config.proxyConfig.del,
          ...this.proxyConfig.del,
          props: {
            ...config.proxyConfig.del.props,
            ...delProps
          }
        };
      } else {
        option.del = config.proxyConfig.del;
      }

      //查看
      if (this.proxyConfig && this.proxyConfig.view) {
        const viewProps =
          this.proxyConfig.view && this.proxyConfig.view.props
            ? this.proxyConfig.view.props
            : {};
        option.view = {
          ...config.proxyConfig.view,
          ...this.proxyConfig.view,
          props: {
            ...config.proxyConfig.view.props,
            ...viewProps
          }
        };
      } else {
        option.view = config.proxyConfig.view;
      }

      return option;
    },
    tableProps() {
      const {
        table,
        tableData,
        onToobarButtonClick,
        $scopedSlots,
        proxyConfig,
        proxyConfigOpt,
        renderRowAction,
        permissions,
        view
      } = this;
      const permissionsArr = permissions ? permissions : config.permissions;
      const props = {
        props: {
          ...config.table,
          ...table.props,
          data: proxyConfig ? null : tableData,
          columns: table.props.columns
        },
        on: {
          ...table.on,
          toobarButtonClick: onToobarButtonClick
        }
      };
      // 处理查看触发事件
      if (proxyConfig.view && proxyConfigOpt.view.trigger) {
        // 绑定单击事件
        if (proxyConfigOpt.view.trigger.includes("click")) {
          props.on["cell-click"] = ({ row }) => {
            view(row);
          };
        }
        // 双击
        if (proxyConfigOpt.view.trigger.includes("dblclick")) {
          props.on["cell-dblclick"] = ({ row }) => {
            view(row);
          };
        }
      }
      // 不存在新增按钮，自动生成
      if (
        !(props.props.headToolbar && props.props.headToolbar.buttons) &&
        proxyConfig.add
      ) {
        const addButtonProps = proxyConfigOpt.add.props;
        if (proxyConfig.add && proxyConfig.add.permission) {
          if (
            utils.isArray(proxyConfig.add.permission) &&
            !utils.hasEquaValueArray(permissionsArr, proxyConfig.add.permission)
          ) {
            addButtonProps.disabled = true;
          } else if (utils.isFunction(proxyConfig.add.permission)) {
            const res = proxyConfig.add.permission();
            addButtonProps.disabled = !res;
          }
        }

        props.props.headToolbar.buttons = [
          {
            name: "新增",
            code: "add",
            type: "primary",
            ...addButtonProps
          }
        ];
      }
      // 不存在行操作插槽，自动生成
      if (
        proxyConfig &&
        (proxyConfig.edit || proxyConfig.del || proxyConfig.view) &&
        !$scopedSlots.rowAction
      ) {
        $scopedSlots["rowAction"] = renderRowAction;
      }
      props.scopedSlots = $scopedSlots;
      props.ref = "table";
      return props;
    }
  },
  data() {
    return {
      tableData: [],
      currentAction: ""
    };
  },
  methods: {
    headSearch() {
      this.$refs.table.headSearch();
    },
    onToobarButtonClick(code) {
      const { add } = this;
      switch (code) {
        case "add":
          add();
          break;

        default:
          break;
      }
    },
    onFormModalSubmit(values) {
      const { proxyConfig, currentAction } = this;
      if (
        proxyConfig &&
        proxyConfig[currentAction] &&
        proxyConfig[currentAction].submit
      ) {
        const formModal = this.$refs.formModal;
        proxyConfig[currentAction]
          .submit(values)
          .then(res => {
            formModal && formModal.onCancel();
            const successMsgCode = proxyConfig[currentAction].successMsgCode
              ? proxyConfig[currentAction].successMsgCode
              : config.proxyConfig[currentAction].successMsgCode;
            const responseCodeField = proxyConfig[currentAction]
              .responseCodeField
              ? proxyConfig[currentAction].responseCodeField
              : config.proxyConfig[currentAction].responseCodeField;
            if ((successMsgCode || successMsgCode == 0) && responseCodeField) {
              const resCode = responseCodeField
                ? utils.getObjData(responseCodeField, res)
                : "";
              if (resCode === successMsgCode) {
                this.formModalSubmitMessage(res);
              }
            } else {
              this.formModalSubmitMessage(res);
            }
            if (proxyConfig[currentAction].reloadType === "query") {
              this.queryTable();
            } else {
              this.reloadTable();
            }
          })
          .catch(() => {
            formModal && formModal.setConfirmLoading(false);
          });
      }
    },
    formModalSubmitMessage(res) {
      const { proxyConfig, currentAction } = this;
      const responseMsgField = proxyConfig[currentAction].responseMsgField
        ? proxyConfig[currentAction].responseMsgField
        : config.proxyConfig[currentAction].responseMsgField;
      const resMsg = responseMsgField
        ? utils.getObjData(responseMsgField, res)
        : "";
      const msg = resMsg ? resMsg : "操作成功";
      this.$message.success(msg);
    },
    onFormModalCancel() {
      if (this.modal.on && this.modal.on.cancel) {
        this.modal.on.cancel();
      }
    },
    reloadTable() {
      this.$refs.table.reload();
    },
    queryTable(params) {
      this.$refs.table.query(params);
    },
    // 渲染自动生成操作行的插槽
    renderRowAction(scope) {
      const {
        proxyConfig,
        edit,
        del,
        view,
        permissions,
        proxyConfigOpt,
        $scopedSlots
      } = this;
      const vm = new Vue();
      const h = vm.$createElement;
      const permissionsArr = permissions ? permissions : config.permissions;
      const buttons = [];
      // 查看
      if (
        proxyConfig &&
        proxyConfig.view &&
        proxyConfigOpt.view.trigger.includes("button")
      ) {
        const viewButtonProps = proxyConfigOpt.view.props;
        if (
          utils.isArray(proxyConfig.view.permission) &&
          !utils.hasEquaValueArray(permissionsArr, proxyConfig.view.permission)
        ) {
          // 无权限
          viewButtonProps.disabled = true;
        } else if (utils.isFunction(proxyConfig.view.permission)) {
          const res = proxyConfig.view.permission(scope);
          viewButtonProps.disabled = !res;
        }
        let button = h(
          "a-button",
          {
            props: viewButtonProps,
            on: {
              click: () => {
                view(scope.row);
              }
            }
          },
          viewButtonProps.name ? viewButtonProps.name : "查看"
        );
        if (config.showPermissionsTip) {
          let tips = !proxyConfig.view.disabledTip
            ? config.showPermissionsTipText
            : proxyConfig.view.disabledTip(scope.row);

          if (viewButtonProps.disabled && tips) {
            button = h(
              "a-tooltip",
              {
                scopedSlots: {
                  title: () => tips
                }
              },
              [button]
            );
          }
        }
        buttons.push(button);
      }
      // 编辑
      if (proxyConfig && proxyConfig.edit) {
        const editButtonProps = proxyConfigOpt.edit.props;
        if (
          utils.isArray(proxyConfig.edit.permission) &&
          !utils.hasEquaValueArray(permissionsArr, proxyConfig.edit.permission)
        ) {
          // 无权限
          editButtonProps.disabled = true;
        } else if (utils.isFunction(proxyConfig.edit.permission)) {
          const res = proxyConfig.edit.permission(scope);
          editButtonProps.disabled = !res;
        }
        let button = h(
          "a-button",
          {
            props: editButtonProps,
            on: {
              click: e => {
                edit(scope.row, e);
              }
            }
          },
          editButtonProps.name ? editButtonProps.name : "编辑"
        );
        if (config.showPermissionsTip) {
          let tips = !proxyConfig.edit.disabledTip
            ? config.showPermissionsTipText
            : proxyConfig.edit.disabledTip(scope.row);

          if (editButtonProps.disabled && tips) {
            button = h(
              "a-tooltip",
              {
                scopedSlots: {
                  title: () => tips
                }
              },
              [button]
            );
          }
        }
        buttons.push(button);
      }
      // 删除按钮
      if (proxyConfig && proxyConfig.del) {
        const delButtonProps = proxyConfigOpt.del.props;
        if (
          utils.isArray(proxyConfig.del.permission) &&
          !utils.hasEquaValueArray(permissionsArr, proxyConfig.del.permission)
        ) {
          // 无权限
          delButtonProps.disabled = true;
        } else if (utils.isFunction(proxyConfig.del.permission)) {
          const res = proxyConfig.del.permission(scope);
          delButtonProps.disabled = !res;
        }
        let button;
        if (delButtonProps.disabled) {
          button = h(
            "a-button",
            {
              props: delButtonProps
            },
            delButtonProps.name ? delButtonProps.name : "删除"
          );
        } else {
          button = h(
            "a-popconfirm",
            {
              props: {
                title: proxyConfigOpt.del.popconfirmTitle
              },
              on: {
                confirm: () => {
                  del(scope.row);
                }
              }
            },
            [
              h(
                "a-button",
                {
                  props: delButtonProps
                },
                delButtonProps.name ? delButtonProps.name : "删除"
              )
            ]
          );
        }
        if (config.showPermissionsTip) {
          let tips = !proxyConfig.del.disabledTip
            ? config.showPermissionsTipText
            : proxyConfig.del.disabledTip(scope.row);

          if (delButtonProps.disabled && tips) {
            button = h(
              "a-tooltip",
              {
                scopedSlots: {
                  title: () => tips
                }
              },
              [button]
            );
          }
        }
        buttons.push(button);
      }

      //前置插槽
      let rowActionBefore = "";
      if ($scopedSlots.rowActionBefore) {
        rowActionBefore = $scopedSlots.rowActionBefore(scope);
      }
      //后置插槽
      let rowActionAfter = "";
      if ($scopedSlots.rowActionAfter) {
        rowActionAfter = $scopedSlots.rowActionAfter(scope);
      }

      return h("div", { class: "crud-table-row-actions" }, [
        rowActionBefore,
        buttons,
        rowActionAfter
      ]);
    },
    add(e) {
      if (e) e.target.blur();
      const { proxyConfig, proxyConfigOpt, filterFormItems } = this;
      const addButtonProps = proxyConfigOpt.add.props;
      let openCallback = "";
      if (proxyConfig && proxyConfig.add && proxyConfig.add.open) {
        const openRes = proxyConfig.add.open();

        if (openRes === false) {
          return false;
        } else if (openRes && utils.isFunction(openRes)) {
          openCallback = openRes;
        }
      }
      this.currentAction = "add";
      const formModal = this.$refs.formModal;
      if (!formModal) {
        return false;
      }
      formModal.setReadonly(false);
      formModal.setTitle(
        proxyConfig.add.modalTitle
          ? proxyConfig.add.modalTitle
          : addButtonProps.name
      );
      formModal.setItems(filterFormItems(this.currentAction));
      formModal.show(openCallback, this.currentAction);
      // formModal.loadOptionsData();
      formModal.setLoading(false);
    },
    edit(row, e) {
      if (e) e.target.blur();
      const { proxyConfig, proxyConfigOpt, filterFormItems } = this;
      const editButtonProps = proxyConfigOpt.edit.props;

      let openCallback = "";
      if (proxyConfig && proxyConfig.edit && proxyConfig.edit.open) {
        const openRes = proxyConfig.edit.open(row);
        if (openRes === false) {
          return false;
        } else if (openRes && utils.isFunction(openRes)) {
          openCallback = openRes;
        }
      }
      this.currentAction = "edit";
      const formModal = this.$refs.formModal;
      if (!formModal) {
        return false;
      }
      formModal.setTitle(
        proxyConfig.edit.modalTitle
          ? proxyConfig.edit.modalTitle
          : editButtonProps.name
      );
      formModal.setItems(filterFormItems(this.currentAction));
      formModal.setReadonly(false);
      formModal.show(openCallback, this.currentAction);
      if (proxyConfig && proxyConfig.edit && proxyConfig.edit.query) {
        proxyConfig.edit.query(row).then(res => {
          let data = res;
          const queryDataField =
            proxyConfig.edit.queryDataField != undefined
              ? proxyConfig.edit.queryDataField
              : config.proxyConfig.edit.queryDataField;
          if (queryDataField) {
            data = utils.getObjData(queryDataField, res);
          }
          formModal.setFormData(data);
          // if (form && form.props && form.props.autoSetDefaultValue) {
          // } else {
          // }
        });
      } else {
        setTimeout(() => {
          formModal.setFormData(row);
        }, 100);
      }
    },
    del(row) {
      this.currentAction = "del";
      this.onFormModalSubmit(row);
    },
    view(row) {
      const { proxyConfig, proxyConfigOpt, filterFormItems } = this;
      const viewButtonProps = proxyConfigOpt.view.props;
      let openCallback = "";
      if (proxyConfig && proxyConfig.view && proxyConfig.view.open) {
        const openRes = proxyConfig.view.open(row);
        if (openRes === false) {
          return false;
        } else if (openRes && utils.isFunction(openRes)) {
          openCallback = openRes;
        }
      }
      this.currentAction = "view";
      const formModal = this.$refs.formModal;
      if (!formModal) {
        return false;
      }
      formModal.setReadonly(true);
      formModal.setTitle(
        proxyConfig.view.modalTitle
          ? proxyConfig.view.modalTitle
          : viewButtonProps.name
      );
      formModal.setItems(filterFormItems(this.currentAction));
      formModal.show(openCallback, this.currentAction);
      if (proxyConfig && proxyConfig.view && proxyConfig.view.query) {
        proxyConfig.view.query(row).then(res => {
          let data = res;
          const queryDataField =
            proxyConfig.view.queryDataField != undefined
              ? proxyConfig.view.queryDataField
              : config.proxyConfig.view.queryDataField;
          if (queryDataField) {
            data = utils.getObjData(queryDataField, res);
          }
          this.$nextTick(() => {
            formModal.setFormData(data);
          });
        });
      } else {
        this.$nextTick(() => {
          formModal.setFormData(row);
        });
      }
    },
    onOptionsLoadAfter() {
      let { proxyConfig } = this;
      if (proxyConfig[this.currentAction].autoSetDefaultValue) {
        this.$refs.formModal.$refs.form.setFieldsOptionsDefaultValues();
      }
    },
    filterFormItems(type) {
      const { form } = this;
      const items = form.props.items.filter(item => {
        if (item.filter && !item.filter.includes(type)) {
          return false;
        }
        return true;
      });
      return items;
    },
    getTableData() {
      return this.$refs.table.getData();
    },
    getRefs() {
      return this.$refs;
    }
  },
  render(h) {
    const { tableProps, modal, form, $slots } = this;
    let formDom = "";
    if (modal && form) {
      formDom = renderFormModal(modal, form, h, this);
    }
    const slots = Object.keys($slots).map(name => (
      <template slot={name}>{$slots[name]}</template>
    ));

    return h(
      "div",
      {
        class: "crud-table"
      },
      [formDom, [h("data-table", { ...tableProps }, slots)]]
    );
  }
};
