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
      form: formOpt
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
      default: () => {}
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
          data: tableData,
          columns: table.props.columns
        },
        on: {
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
        !(
          props.props.headToolbar &&
          props.props.headToolbar.buttons &&
          proxyConfig.add
        )
      ) {
        const addButtonProps = proxyConfigOpt.add.props;
        if (
          proxyConfig.add.permission &&
          !utils.hasEquaValueArray(permissionsArr, proxyConfig.add.permission)
        ) {
          // 无权限
          addButtonProps.disabled = true;
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
        (proxyConfig.edit || proxyConfig.del) &&
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
        proxyConfig[currentAction].submit(values).then(res => {
          const responseMsgField = proxyConfig[currentAction].responseMsgField
            ? proxyConfig[currentAction].responseMsgField
            : config.proxyConfig[currentAction].responseMsgField;
          const resMsg = responseMsgField
            ? utils.getObjData(responseMsgField, res)
            : "";
          const msg = resMsg ? resMsg : "操作成功";
          this.$message.success(msg);
          this.reloadTable();
        });
      }
    },
    onFormModalCancel() {
      // console.log(2);
    },
    reloadTable() {
      this.$refs.table.reload();
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

        buttons.push(
          h(
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
          )
        );
      }
      // 编辑
      if (proxyConfig && proxyConfig.edit) {
        const editButtonProps = proxyConfigOpt.edit.props;
        if (
          proxyConfig.edit.permission &&
          !utils.hasEquaValueArray(permissionsArr, proxyConfig.edit.permission)
        ) {
          // 无权限
          editButtonProps.disabled = true;
        }
        buttons.push(
          h(
            "a-button",
            {
              props: editButtonProps,
              on: {
                click: () => {
                  edit(scope.row);
                }
              }
            },
            editButtonProps.name ? editButtonProps.name : "编辑"
          )
        );
      }
      // 删除按钮
      if (proxyConfig && proxyConfig.del) {
        const delButtonProps = proxyConfigOpt.del.props;
        if (
          proxyConfig.del.permission &&
          !utils.hasEquaValueArray(permissionsArr, proxyConfig.del.permission)
        ) {
          // 无权限
          delButtonProps.disabled = true;
        }
        buttons.push(
          h(
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
          )
        );
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
    add() {
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
      formModal.show(openCallback);
      formModal.setLoading(false);
    },
    edit(row) {
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
      formModal.show(openCallback);
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
        });
      } else {
        formModal.setFormData(row);
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
      formModal.show(openCallback);
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
          formModal.setFormData(data);
        });
      } else {
        formModal.setFormData(row);
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
    }
  },
  render(h) {
    const { tableProps, modal, form } = this;
    let formDom = "";
    if (modal && form) {
      formDom = renderFormModal(modal, form, h, this);
    }
    return h(
      "div",
      {
        class: "crud-table"
      },
      [formDom, [h("data-table", tableProps, "")]]
    );
  }
};
