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
    permissions: Array
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
      console.log(values);
      const { proxyConfig, currentAction } = this;
      if (
        proxyConfig &&
        proxyConfig[currentAction] &&
        proxyConfig[currentAction].submit
      ) {
        proxyConfig[currentAction].submit(values).then(res => {
          console.log(res);
          this.reloadTable();
        });
      }
    },
    onFormModalCancel() {
      console.log(2);
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
        proxyConfigOpt
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
          proxyConfig.view.permission &&
          !utils.hasEquaValueArray(permissionsArr, proxyConfig.view.permission)
        ) {
          // 无权限
          viewButtonProps.disabled = true;
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

      return h("div", { class: "crud-table-row-actions" }, buttons);
    },
    add() {
      const { proxyConfig, proxyConfigOpt } = this;
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
      const formModal = this.$refs.formModal;
      formModal.setReadonly(false);
      formModal.setTitle(
        proxyConfig.add.modalTitle
          ? proxyConfig.add.modalTitle
          : addButtonProps.name
      );
      formModal.show(openCallback);
      formModal.setLoading(false);
      this.currentAction = "add";
    },
    edit(row) {
      const { proxyConfig, proxyConfigOpt } = this;
      const editButtonProps = proxyConfigOpt.edit.props;

      let openCallback = "";
      if (proxyConfig && proxyConfig.edit && proxyConfig.edit.open) {
        const openRes = proxyConfig.edit.open();
        if (openRes === false) {
          return false;
        } else if (openRes && utils.isFunction(openRes)) {
          openCallback = openRes;
        }
      }
      const formModal = this.$refs.formModal;
      formModal.setTitle(
        proxyConfig.edit.modalTitle
          ? proxyConfig.edit.modalTitle
          : editButtonProps.name
      );
      formModal.setReadonly(false);
      formModal.show(openCallback);
      if (proxyConfig && proxyConfig.edit && proxyConfig.edit.query) {
        proxyConfig.edit.query(row).then(res => {
          formModal.setFormData(res);
        });
      } else {
        formModal.setFormData(row);
      }

      this.currentAction = "edit";
    },
    del(row) {
      this.currentAction = "del";
      this.onFormModalSubmit(row);
    },
    view(row) {
      const { proxyConfig, proxyConfigOpt } = this;
      const viewButtonProps = proxyConfigOpt.view.props;
      let openCallback = "";
      if (proxyConfig && proxyConfig.view && proxyConfig.view.open) {
        const openRes = proxyConfig.view.open();
        if (openRes === false) {
          return false;
        } else if (openRes && utils.isFunction(openRes)) {
          openCallback = openRes;
        }
      }
      const formModal = this.$refs.formModal;
      formModal.setReadonly(true);
      formModal.setTitle(
        proxyConfig.view.modalTitle
          ? proxyConfig.view.modalTitle
          : viewButtonProps.name
      );
      formModal.show(openCallback);
      if (proxyConfig && proxyConfig.view && proxyConfig.view.query) {
        proxyConfig.view.query(row).then(res => {
          formModal.setFormData(res);
        });
      } else {
        formModal.setFormData(row);
      }

      this.currentAction = "view";
    }
  },
  render(h) {
    const { tableProps, modal, form } = this;

    return h(
      "div",
      {
        class: "crud-table"
      },
      [renderFormModal(modal, form, h, this), h("data-table", tableProps, "")]
    );
  }
};
