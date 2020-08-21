import Vue from "vue";
import utils from "../../utils";
import Sortable from "sortablejs";

export default {
  name: "SetColumns",
  components: {},
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      columns: []
    };
  },
  computed: {
    getOpt() {
      const { option } = this;
      return option.proxyConfig && option.proxyConfig.get
        ? option.proxyConfig.get
        : {};
    },
    submitOpt() {
      const { option } = this;
      return option.proxyConfig && option.proxyConfig.submit
        ? option.proxyConfig.submit
        : {};
    },
    modalOpt() {
      const { option } = this;
      return option.modal ? option.modal : {};
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
      const { getOpt } = this;
      if (getOpt.api) {
        this.fetchColumns();
      }
    },
    fetchColumns() {
      const { getOpt } = this;
      const json = {
        ...getOpt.param
      };
      getOpt.api(json).then(res => {
        const dataField = getOpt.dataField ? getOpt.dataField : "data";
        const data = utils.getObjData(dataField, res);
        this.columns = data;
        this.treeDrop();
      });
    },
    treeDrop() {
      this.$nextTick(() => {
        let xTable = this.$refs.table;
        this.sortable2 = Sortable.create(
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
              let tableTreeData = this.columns;
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
      const { submitOpt, getOpt } = this;
      const data = this.getData();
      if (submitOpt.api) {
        let json = {
          ...getOpt.param,
          data: data.tableData
        };
        const callbackRes = submitOpt.before && submitOpt.before(json);
        if (callbackRes === false) {
          return false;
        } else if (callbackRes) {
          json = callbackRes;
        }
        submitOpt.api(json).then(res => {
          this.visible = false;
          submitOpt.after && submitOpt.after(res);
          this.$emit("submit", res);
        });
      }
    }
  },
  render(h) {
    const {
      columns,
      renderShowEdit,
      modalOpt,
      visible,
      onSubmit,
      onCancel
    } = this;

    const dropBtn = (
      <span class="drag-btn">
        <i class="vxe-icon--menu"></i>
      </span>
    );
    const tableColumn = [
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
      { field: "title", title: "默认标题", align: "center", treeNode: true },
      {
        field: "name",
        title: "显示标题",
        align: "center",
        editRender: { name: "AInput" }
      },
      {
        field: "width",
        title: "列宽",
        align: "center",
        editRender: { name: "AInputNumber" }
      },
      {
        field: "align",
        title: "对齐方式",
        align: "center",
        editRender: {
          name: "ASelect",
          options: [
            { label: "居左", value: "left" },
            { label: "居中", value: "center" },
            { label: "居右", value: "right" }
          ]
        }
      },
      {
        field: "show",
        title: "显示",
        align: "center",
        slots: { default: "show_default" }
      },
      {
        field: "freeze",
        title: "固定",
        align: "center",
        editRender: {
          name: "ASelect",
          options: [
            { label: "靠左", value: "left" },
            { label: "居中", value: "center" },
            { label: "靠右", value: "right" }
          ]
        }
      }
    ];

    const modalProps = {
      ...modalOpt
    };

    return h(
      "a-modal",
      {
        props: {
          title: modalProps.title ? modalProps.title : "设置表头",
          width: 1000,
          ...modalProps,
          visible: visible
        },
        on: {
          cancel: onCancel,
          ok: onSubmit
        },
        class: "advanced-search-modal"
      },
      [
        h(
          "vxe-grid",
          {
            class: "columns-table",
            ref: "table",
            props: {
              border: true,
              rowKey: true,
              columns: tableColumn,
              data: columns,
              treeConfig: { children: "children" },
              editConfig: { trigger: "click", mode: "row" },
              checkboxConfig: { checkStrictly: true }
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
