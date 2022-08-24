import Vue from "vue";
import utils from "../../utils";
import Sortable from "sortablejs";
import config from "../conf";
import { Modal } from "../../modal";

export default {
  name: "SetColumns",
  components: {
    Modal
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    },
    columns: Array
  },
  data() {
    return {
      visible: false,
      tableData: []
    };
  },
  computed: {
    query() {
      const { option } = this;
      return option.proxyConfig &&
        option.proxyConfig.ajax &&
        option.proxyConfig.ajax.query
        ? option.proxyConfig.ajax.query
        : null;
    },
    propsConfig() {
      const { option } = this;
      // let props = {};
      // if (option.tableConfig.props) {

      // }
      return option.proxyConfig && option.proxyConfig.props
        ? {
            ...config.setColumns.proxyConfig.props,
            ...option.proxyConfig.props
          }
        : config.setColumns.proxyConfig.props;
    },
    submit() {
      const { option } = this;
      return option.proxyConfig &&
        option.proxyConfig.ajax &&
        option.proxyConfig.ajax.submit
        ? option.proxyConfig.ajax.submit
        : null;
    },
    modalOpt() {
      const { option } = this;
      return option.modal && option.modal.props
        ? { ...config.setColumns.modal.props, ...option.modal.props }
        : config.setColumns.modal.props;
    },
    onConfig() {
      const { option } = this;
      return option.proxyConfig && option.proxyConfig.on
        ? { ...config.setColumns.proxyConfig.on, ...option.proxyConfig.on }
        : config.setColumns.proxyConfig.on;
    }
  },

  beforeDestroy() {
    if (this.sortable) {
      this.sortable.destroy();
    }
  },
  methods: {
    show() {
      this.visible = true;
      const { query, columns, handelColumns, option } = this;
      if (
        query ||
        (option && option.proxyConfig && option.proxyConfig.params)
      ) {
        this.fetchColumns();
      } else {
        this.tableData = handelColumns(utils.clone(columns));
        this.treeDrop();
      }
    },
    handelColumns(data) {
      const { propsConfig } = this;
      return this.handleColumnsData(data, propsConfig);
    },
    //处理api获取的表头数据
    handleColumnsData(data, configProps) {
      // let copyColumns = utils.clone(columns);
      const apiColumns = data.map(item => {
        // 替换字段
        let obj = {
          ...item
        };
        for (const key in configProps) {
          if (key !== "list") {
            obj[key] =
              item[configProps[key]] ||
              item[configProps[key]] == 0 ||
              item[configProps[key]] === false
                ? item[configProps[key]]
                : "";
          }
        }
        if (obj.children && obj.children.length) {
          obj.children = this.handleColumnsData(obj.children, configProps);
        }
        return obj;
      });
      return apiColumns;
    },
    fetchColumns() {
      const { query, propsConfig, handelColumns, option } = this;
      // const json = {
      //   ...getOpt.param
      // };
      const defaultAjax =
        config.setColumns &&
        config.setColumns.proxyConfig &&
        config.setColumns.proxyConfig.defaultAjax
          ? config.setColumns.proxyConfig.defaultAjax
          : {};
      const opt = option.proxyConfig ? option.proxyConfig : {};
      let params = null;
      let queryApi = null;
      if (opt && opt.params) {
        params = opt.params;
        if (defaultAjax && defaultAjax.query && !query) {
          queryApi = defaultAjax.query;
        }
      }
      if (query) {
        queryApi = query;
      }
      queryApi(params).then(res => {
        // const dataField = getOpt.dataField ? getOpt.dataField : "data";
        const data = utils.getObjData(propsConfig.list, res);
        this.tableData = handelColumns(data);
        this.treeDrop();
      });
    },
    treeDrop() {
      this.$nextTick(() => {
        let xTable = this.$refs.table;
        this.sortable = Sortable.create(
          xTable.$el.querySelector(
            ".columns-table .body--wrapper>.vxe-table--body tbody"
          ),
          {
            handle: ".drag-btn",
            onEnd: ({ item, oldIndex }) => {
              let options = { children: "children" };
              let targetTrElem = item;
              let wrapperElem = targetTrElem.parentNode;
              let prevTrElem = targetTrElem.previousElementSibling;
              let tableTreeData = this.tableData;
              let selfRow = xTable.getRowNode(targetTrElem).item;
              let selfNode = utils.findTree(
                tableTreeData,
                row => row === selfRow,
                options
              );
              if (prevTrElem) {
                // 移动到节点
                let prevRow = xTable.getRowNode(prevTrElem).item;
                let prevNode = utils.findTree(
                  tableTreeData,
                  row => row === prevRow,
                  options
                );
                if (
                  utils.findTree(
                    selfRow[options.children],
                    row => prevRow === row,
                    options
                  )
                ) {
                  // 错误的移动
                  let oldTrElem = wrapperElem.children[oldIndex];
                  wrapperElem.insertBefore(targetTrElem, oldTrElem);
                  return this.$XModal.message({
                    message: "不允许自己给自己拖动！",
                    status: "error"
                  });
                }
                if (xTable.isTreeExpandByRow(prevRow)) {
                  let currRow = selfNode.items.splice(selfNode.index, 1)[0];
                  // 移动到当前的子节点
                  prevRow[options.children].splice(0, 0, currRow);
                } else {
                  const prevNodeParentKey =
                    prevNode.parent && prevNode.parent._XID
                      ? prevNode.parent._XID
                      : "";
                  const selfNodeParentKey =
                    selfNode.parent && selfNode.parent._XID
                      ? selfNode.parent._XID
                      : "";

                  if (prevNodeParentKey === selfNodeParentKey) {
                    let currRow = selfNode.items.splice(selfNode.index, 1)[0];
                    // 移动到相邻节点
                    prevNode.items.splice(
                      prevNode.index +
                        (selfNode.index < prevNode.index ? 0 : 1),
                      0,
                      currRow
                    );
                  }
                }
              } else {
                // 移动到第一行
                var currRow = selfNode.items.splice(selfNode.index, 1)[0];
                tableTreeData.unshift(currRow);
              }
              // 如果变动了树层级，需要刷新数据
              xTable.syncData();
            }
          }
        );
      });
    },
    renderShowEdit(scope) {
      const vm = new Vue();
      const h = vm.$createElement;
      return h("a-checkbox", {
        props: {
          checked: scope.row.show
        },
        on: {
          input: function(checked) {
            scope.row.show = checked;
          }
        }
      });
    },
    getData() {
      const table = this.$refs.table;
      return table.getTableData();
    },
    onCancel() {
      this.visible = false;
    },
    onSubmit() {
      const { submit, onConfig, option } = this;
      const data = this.getData();
      const { tableData } = data;
      const opt = option.proxyConfig ? option.proxyConfig : {};
      let params = {};
      if (opt && opt.params) {
        params = opt.params;
      }

      const newTableData = tableData.map(item => {
        if (!(item.fixed === "left" || item.fixed === "right")) {
          delete item.fixed;
        }
        return item;
      });
      const defaultAjax =
        config.setColumns &&
        config.setColumns.proxyConfig &&
        config.setColumns.proxyConfig.defaultAjax
          ? config.setColumns.proxyConfig.defaultAjax
          : {};

      let submitApi = submit;
      if (defaultAjax && defaultAjax.submit && !submitApi) {
        submitApi = defaultAjax.submit;
      }
      let json = { ...params, data: newTableData };
      if (submitApi) {
        if (onConfig && onConfig.submitBefore) {
          const submitBeforeRes = onConfig.submitBefore(json);
          if (submitBeforeRes === false) {
            return false;
          } else if (submitBeforeRes) {
            json = submitBeforeRes;
          }
        }
        submitApi(json).then(() => {
          this.visible = false;
          this.$emit("submit");
        });
      } else {
        //转换数据到原来
        let propsConfig = {};
        for (const key in this.propsConfig) {
          propsConfig[this.propsConfig[key]] = key;
        }
        if (onConfig && onConfig.submitBefore) {
          const submitBeforeRes = onConfig.submitBefore(json);
          if (submitBeforeRes === false) {
            return;
          }
        }
        this.visible = false;
        this.$emit("submit", newTableData);
      }
    },
    onCellEditChange(...args) {
      if (this.option.tableConfig && this.option.tableConfig.onCellEditChange) {
        this.option.tableConfig.onCellEditChange(...args);
      }
    }
  },
  render(h) {
    const {
      tableData,
      renderShowEdit,
      modalOpt,
      visible,
      onSubmit,
      onCancel,
      option,
      onCellEditChange
    } = this;
    const dropBtn = (
      <span class="drag-btn">
        <i class="vxe-icon--menu"></i>
      </span>
    );
    let tableColumn = [
      {
        width: 60,
        align: "center",
        slots: {
          default: "btn_default",
          header: () => {
            return "排序";
          }
        }
      },
      {
        field: "defaultTitle",
        title: "默认标题",
        align: "center",
        treeNode: true
      },
      {
        field: "title",
        title: "显示标题",
        align: "center",
        itemRender: {
          name: "AInput",
          on: {
            change: onCellEditChange
          }
        }
      },
      {
        field: "width",
        title: "列宽",
        align: "center",
        itemRender: {
          name: "AInputNumber",
          on: {
            change: onCellEditChange
          }
        }
      },
      {
        field: "align",
        title: "对齐方式",
        align: "center",
        itemRender: {
          name: "a-select",
          props: {
            valueField: "value",
            labelField: "label",
            options: [
              { label: "居左", value: "left" },
              { label: "居中", value: "center" },
              { label: "居右", value: "right" }
            ]
          },
          on: {
            change: (value, option, event) => {
              this.onCellEditChange(value, event);
            }
          }
        }
      },
      {
        field: "show",
        title: "显示",
        align: "center",
        itemRender: {
          name: "a-checkbox",
          on: {
            change: onCellEditChange
          }
        }
        // slots: { default: "show_default" }
      },
      {
        field: "fixed",
        title: "固定",
        align: "center",
        itemRender: {
          name: "a-select",
          props: {
            valueField: "value",
            labelField: "label",
            options: [
              { label: "不固定", value: "" },
              { label: "靠左", value: "left" },
              { label: "靠右", value: "right" }
            ]
          },
          on: {
            change: onCellEditChange
          }
        }
      }
    ];
    if (option.tableConfig.columns) {
      tableColumn = option.tableConfig.columns;
    }

    const modalProps = {
      ...modalOpt
    };
    return h(
      "modal",
      {
        props: {
          title: modalProps.title ? modalProps.title : "设置表头",
          width: 800,
          ...modalProps,
          value: visible
        },
        on: {
          cancel: onCancel,
          ok: onSubmit
        },
        class: "set-columns-modal"
      },
      [
        h(
          "data-table",
          {
            class: "columns-table",
            ref: "table",
            props: {
              border: true,
              rowKey: true,
              columns: tableColumn,
              data: tableData,
              treeConfig: { children: "children" },
              "keyboard-config": { isArrow: false },
              // editConfig: { trigger: "click", mode: "row" },
              checkboxConfig: { checkStrictly: true },
              height: "600px",
              transfer: true
            },
            scopedSlots: {
              btn_default: () => {
                return dropBtn;
              },
              show_default: renderShowEdit
            }
          },
          []
        )
        //   h(
        //     "SetColums",
        //     {
        //       ref:"setColumsTable",
        //       props:{
        //         option:setColumnsOpt
        //       }
        //     }
        //   )
      ]
    );
  }
};
