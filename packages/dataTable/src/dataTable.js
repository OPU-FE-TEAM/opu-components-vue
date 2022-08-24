// import Vue from "vue";
import "vxe-table/lib/index.css";
import utils from "../../utils";
import { Table } from "vxe-table";
import { DataForm } from "../../dataForm";
import config from "../conf";
import SetColumns from "./setColumns";
import editRenderMixin from "./mixin/editRender";
import { Modal } from "../../modal";

const tablePropKeys = Object.keys(Table.props);
const methods = {};
Object.keys(Table.methods).forEach(name => {
  methods[name] = function(...args) {
    return this.$refs.dataGrid && this.$refs.dataGrid[name](...args);
  };
});

// 渲染头部搜索表单
function renderHeadSearch(searchConfig, h, _vm) {
  const { onSearchSubmit, onButtonActionClick, $scopedSlots } = _vm;
  const items = searchConfig.items;
  let form = h("data-form", {
    ref: "headSearchForm",
    props: {
      ...searchConfig,
      items
    },
    class: "head-search-form",
    style: searchConfig.style,
    on: {
      submit: onSearchSubmit,
      ...searchConfig.on,
      buttonActionClick: onButtonActionClick
    },
    scopedSlots: $scopedSlots
  });

  return form;
}

// 渲染头部工具条搜索表单
function renderHeadToolbarSearch(searchConfig, h, _vm) {
  const { onSearchSubmit, onButtonActionClick, $scopedSlots } = _vm;
  const cloneSearchConfig = utils.clone(searchConfig, true);
  const items = cloneSearchConfig.items.filter(item => !item.folding);
  // 生成查询按钮
  let actionButtons = [];
  if (cloneSearchConfig.submitButtonProps !== false) {
    const submitButtonProps =
      cloneSearchConfig.submitButtonProps &&
      utils.isObject(cloneSearchConfig.submitButtonProps)
        ? cloneSearchConfig.submitButtonProps
        : {};
    actionButtons.push({
      props: {
        action: "submit",
        content: "查询",
        type: "primary",
        ...submitButtonProps
      }
    });
  }
  // 高级查询按钮
  const hasFolding = cloneSearchConfig.items.findIndex(p => p.folding) > -1;
  if (hasFolding && cloneSearchConfig.advancedSearchButtonProps !== false) {
    const advancedSearchButtonProps =
      cloneSearchConfig.advancedSearchButtonProps &&
      utils.isObject(cloneSearchConfig.advancedSearchButtonProps)
        ? cloneSearchConfig.advancedSearchButtonProps
        : {};
    actionButtons.push({
      props: {
        action: "advancedQuery",
        content: "高级查询",
        ...advancedSearchButtonProps
      }
    });
  }

  if (actionButtons && actionButtons.length) {
    items.push({
      colon: false,
      titleWidth: 0,
      folding: false,
      itemRender: {
        name: "buttons",
        items: actionButtons
      }
    });
  }
  let form = h("data-form", {
    ref: "headSearch",
    props: {
      ...cloneSearchConfig,
      submitButtonProps: false,
      items
    },
    class: "headtoolbar-search-form",
    on: {
      submit: onSearchSubmit,
      ...cloneSearchConfig.on,
      buttonActionClick: onButtonActionClick
    },
    style: { ...cloneSearchConfig.style },
    scopedSlots: $scopedSlots
  });

  return form;
}

// 渲染高级查询窗口
function renderAdvancedSearch(searchConfig, h, _vm) {
  const {
    onSearchSubmit,
    advancedVisible,
    onAdvancedReset,
    onAdvancedcancel,
    onAdvancedSubmit,
    $scopedSlots
  } = _vm;
  const cloneSearchConfig = utils.clone(searchConfig, true);
  const items = cloneSearchConfig.items.filter(item => item.folding !== false);
  const formItems = items.map(p => {
    delete p.folding;
    return p;
  });
  const formProps =
    cloneSearchConfig.advancedSearchForm &&
    cloneSearchConfig.advancedSearchForm.props
      ? cloneSearchConfig.advancedSearchForm.props
      : {};
  let form = h("data-form", {
    ref: "advancedSearch",
    props: {
      ...formProps,
      items: formItems,
      submitButtonProps: false
    },
    class: "advanced-search-form",
    on: {
      ...cloneSearchConfig.on,
      submit: onSearchSubmit
    },
    scopedSlots: $scopedSlots
  });

  const modalProps =
    cloneSearchConfig.advancedSearchModal &&
    cloneSearchConfig.advancedSearchModal.props
      ? cloneSearchConfig.advancedSearchModal.props
      : {};

  return h(
    "modal",
    {
      ...cloneSearchConfig.advancedSearchModal,
      props: {
        ...modalProps,
        title: modalProps.title ? modalProps.title : "高级查询",
        value: advancedVisible,
        showFooter: true
      },
      on: {
        cancel: onAdvancedcancel,
        ok: onAdvancedSubmit
      },
      class: "advanced-search-modal",
      scopedSlots: {
        footer: () => {
          return [
            <a-button
              {...{
                props: {
                  type: "danger"
                },
                on: {
                  click: onAdvancedReset
                }
              }}
            >
              重置
            </a-button>,
            <a-button
              {...{
                on: {
                  click: onAdvancedcancel
                }
              }}
            >
              取消
            </a-button>,
            <a-button
              {...{
                props: {
                  type: "primary"
                },
                on: {
                  click: onAdvancedSubmit
                }
              }}
            >
              确认
            </a-button>
          ];
        }
      }
    },
    [form]
  );
}

// 渲染设置表头窗口
function renderColumnsModal(h, _vm) {
  const { backupColumns, setTableColumns, setColumnsOpt } = _vm;
  return h("SetColumns", {
    ref: "setColumsModal",
    props: {
      option: setColumnsOpt,
      columns: backupColumns
    },
    on: {
      submit: setTableColumns
    }
  });
}

// 渲染工具栏按钮
function renderButton(item, h, hasDropdown, _vm) {
  const { name, icon, disabled, code, on } = item;
  const { onToobarButtonClick } = _vm;

  let iconContent = "";
  if (icon) {
    iconContent = h("a-icon", {
      props: {
        type: icon
      }
    });
  }
  const onClick = e => {
    if (e) e.target.blur();
    onToobarButtonClick(code);
    if (on && on.click) {
      on.click(e);
    }
  };
  // 下拉按钮
  if (hasDropdown) {
    return h(
      "a-menu-item",
      {
        key: code,
        props: {
          disabled
        },
        on: {
          ...on,
          click: onClick
        }
      },
      [iconContent, name]
    );
  }
  return h(
    "a-button",
    {
      key: code,
      props: {
        type: item.type,
        disabled
      },
      on: {
        ...on,
        click: onClick
      }
    },
    [iconContent, name]
  );
}
// 渲染工具栏按钮组
function renderButtons(buttons, h, _vm) {
  return buttons
    ? buttons.map(item => {
        if (Object.prototype.toString.call(item) === "[object Array]") {
          // 数组，渲染按钮组
          const buttonGroups = item.map(p => renderButton(p, h, false, _vm));
          return h("a-button-group", {}, [buttonGroups]);
        } else if (item.dropdowns && item.dropdowns.length) {
          const buttonGroups = item.dropdowns.map(p =>
            renderButton(p, h, true, _vm)
          );

          const menus = h(
            "a-menu",
            {
              slot: "overlay"
            },
            [buttonGroups]
          );
          return h(
            "a-dropdown",
            {
              props: {
                disabled: item.disabled
              },
              scopedSlots: {
                overlay: () => {
                  return menus;
                }
              }
            },
            [
              h("a-button", {}, [
                item.name,
                h("a-icon", { props: { type: "down" } })
              ])
            ]
          );
        } else if (Object.prototype.toString.call(item) === "[object Object]") {
          // 对象，渲染单个按钮
          return renderButton(item, h, false, _vm);
        }
      })
    : [];
}

// 渲染头部工具栏
function renderHeadToolbar(h, _vm) {
  const {
    headToolbar,
    $nextTick,
    $refs,
    showSetColumns,
    setcolumnsConfig,
    $slots
  } = _vm;
  if (!headToolbar) {
    return false;
  }
  const headToolbarProps = {
    ref: "headToolbar",
    props: {},
    class: "head-toolbar",
    scopedSlots: {}
  };
  // 渲染按钮
  let headButtons = "";
  if ($slots.headToolbar_buttons) {
    headButtons = $slots.headToolbar_buttons;
  } else if (headToolbar.buttons) {
    const buttons = renderButtons(headToolbar.buttons, h, _vm);
    headButtons = buttons;
  }

  if (headButtons) {
    if (headToolbar.search && headToolbar.search.position === "left") {
      headToolbarProps.scopedSlots.tools = () => {
        return headButtons;
      };
    } else {
      headToolbarProps.scopedSlots.buttons = () => {
        return headButtons;
      };
    }
  }

  // 渲染头部搜索表单
  let advancedSearch = "";
  let headSearchTools = "";
  if (headToolbar.search) {
    headSearchTools = renderHeadToolbarSearch(headToolbar.search, h, _vm);
    advancedSearch = renderAdvancedSearch(headToolbar.search, h, _vm);
  }
  if (headSearchTools) {
    if (headToolbar.search.position === "left") {
      headToolbarProps.scopedSlots.buttons = () => {
        return headSearchTools;
      };
    } else {
      headToolbarProps.scopedSlots.tools = () => {
        return headSearchTools;
      };
    }
  }

  // 渲染头部工具
  let setColumnsModal = "";
  if (headToolbar.tools) {
    headToolbarProps.props = {
      ...headToolbar.tools
    };
    // 自定义的 setColumns
    if (headToolbar.tools.setColumns) {
      const buttonProps = utils.isObject(headToolbar.tools.setColumns)
        ? headToolbar.tools.setColumns
        : {};

      const setColumnsBtn = h("a-button", {
        props: {
          circle: true,
          icon: "setting",
          shape: "circle",
          ...buttonProps
        },
        class: "tool-btn-setcolumns",
        style: { marginRight: "10px" },
        on: {
          click: showSetColumns
        }
      });
      if (headSearchTools) {
        headToolbarProps.scopedSlots.tools = () => {
          return h(
            "div",
            {
              style: { display: "flex" }
            },
            [headSearchTools, setColumnsBtn]
          );
        };
      } else {
        headToolbarProps.scopedSlots.tools = () => {
          return setColumnsBtn;
        };
      }
      if (!setcolumnsConfig) {
        setColumnsModal = renderColumnsModal(h, _vm);
      }
    }
    $nextTick(() => {
      $refs.dataGrid.connect($refs.headToolbar);
    });
  }

  return h(
    "div",
    {
      class: "head-toolbar-box"
    },
    [h("vxe-toolbar", headToolbarProps, []), advancedSearch, setColumnsModal]
  );
}

//处理api获取的表头数据
function handleColumnsData(data, columns, configProps, _vm) {
  const { sortable, notSortableFields, tableProps } = _vm;
  let copyColumns = utils.clone(columns);
  const apiColumns = data.map(item => {
    // 替换字段
    let obj = {
      ...item
    };

    for (const key in configProps) {
      if (key !== "list") {
        let value = item[configProps[key]];
        if (key === "fixed" && value == "none") {
          value = "";
        }
        obj[key] = value;
      }
    }
    if (sortable) {
      const currentNotSortableFields =
        notSortableFields && notSortableFields.length ? notSortableFields : [];
      const configNotSortableFields =
        tableProps.props &&
        tableProps.props.sortConfig &&
        tableProps.props.sortConfig.notSortableFields
          ? tableProps.props.sortConfig.notSortableFields
          : [];
      const allNotSortableFields = [
        ...configNotSortableFields,
        ...currentNotSortableFields
      ];
      if (!allNotSortableFields.includes(obj.field) && obj.sortable !== false) {
        obj.sortable = true;
      }
    }
    let copyColumnChildren = [];
    // 合并传入的定义
    if (copyColumns && copyColumns.length) {
      const findIndex = copyColumns.findIndex(p => p.field === obj.field);
      if (findIndex > -1) {
        const find = copyColumns[findIndex];
        copyColumnChildren = find.children ? find.children : [];
        obj = { ...obj, ...find, children: obj.children };
        copyColumns.splice(findIndex, 1);
      }
    }
    if (obj.children && obj.children.length) {
      obj.children = handleColumnsData(
        obj.children,
        copyColumnChildren,
        configProps,
        _vm
      );
    }
    return obj;
  });

  //处理插入指定位置的传入配置项
  if (copyColumns && copyColumns.length) {
    copyColumns = copyColumns
      .map(item => {
        if (item.colIndex || item.colIndex === 0) {
          apiColumns.splice(item.colIndex, 0, item);
          return "";
        }
        return item;
      })
      .filter(p => p != "");
  }

  let columnsData = [];
  if (copyColumns && copyColumns.length) {
    columnsData = apiColumns.concat(copyColumns);
  } else {
    columnsData = apiColumns;
  }
  // this.backupColumns = utils.clone(columnsData);
  // columnsData = columnsData.filter(p => p[configProps.show] !== false);
  return columnsData;
}

export default {
  name: "DataTable",
  components: {
    DataForm,
    SetColumns,
    Modal
  },
  props: {
    ...Table.props,
    columns: Array,
    pagerConfig: {
      type: [Boolean, Object],
      default: () => {}
    },
    proxyConfig: Object,
    toolbar: [Boolean, Object],
    formConfig: [Boolean, Object],
    zoomConfig: Object,
    searchConfig: Object,
    headToolbar: Object,
    setcolumnsConfig: Object,
    proxyColumns: Object,
    // 高亮行是否可反选
    highlightCurrentUnselect: Boolean,
    defaultSelectFristRow: { type: Boolean, default: false },
    tableIndex: { type: String, default: "" },
    sortable: { type: Boolean, default: false },
    keyboardSpace: { type: [Boolean, String], default: null },
    notSortableFields: Array
    // tableHeight: {
    //   type: String,
    //   default: "auto"
    // }
  },
  mixins: [editRenderMixin],
  watch: {
    columns(val) {
      this.setTableColumns(val);
    }
  },
  data() {
    return {
      backupColumns: [],
      tableColumns: [],
      advancedVisible: false,
      searchData: {},
      tableHeight: "",
      currentRow: {},
      currentCell: null,
      hasAjaxQuery: false,
      hasCheckbox: false //是否存在checkbox
    };
  },
  computed: {
    tableExtendProps() {
      const rest = {};
      tablePropKeys.forEach(key => {
        rest[key] = this[key];
      });
      return rest;
    },
    pagerConfigOpt() {
      if (this.pagerConfig) {
        return { ...config.pagerConfig, ...this.pagerConfig };
      } else if (!this.pagerConfig && this.pagerConfig !== false) {
        return config.pagerConfig;
      }
      return false;
    },
    setColumnsOpt() {
      if (this.setcolumnsConfig) {
        const modalProps =
          this.setcolumnsConfig &&
          this.setcolumnsConfig.modal &&
          this.setcolumnsConfig.modal.props
            ? this.setcolumnsConfig.modal.props
            : {};

        const proxyConfigProps =
          this.setcolumnsConfig &&
          this.setcolumnsConfig.proxyConfig &&
          this.setcolumnsConfig.proxyConfig.props
            ? this.setcolumnsConfig.proxyConfig.props
            : {};

        const proxyConfigAjax =
          this.setcolumnsConfig &&
          this.setcolumnsConfig.proxyConfig &&
          this.setcolumnsConfig.proxyConfig.ajax
            ? this.setcolumnsConfig.proxyConfig.ajax
            : {};

        const proxyConfigOn =
          this.setcolumnsConfig &&
          this.setcolumnsConfig.proxyConfig &&
          this.setcolumnsConfig.proxyConfig.on
            ? this.setcolumnsConfig.proxyConfig.on
            : {};

        const tableConfig =
          this.setcolumnsConfig && this.setcolumnsConfig.tableConfig
            ? this.setcolumnsConfig.tableConfig
            : {};

        return {
          modal: {
            props: {
              ...config.setColumns.modal.props,
              ...modalProps
            }
          },
          proxyConfig: {
            params:
              this.setcolumnsConfig &&
              this.setcolumnsConfig.proxyConfig &&
              this.setcolumnsConfig.proxyConfig.params
                ? this.setcolumnsConfig.proxyConfig.params
                : null,
            props: {
              ...config.setColumns.proxyConfig.props,
              ...proxyConfigProps
            },
            ajax: {
              ...config.setColumns.proxyConfig.ajax,
              ...proxyConfigAjax
            },
            on: {
              ...config.setColumns.proxyConfig.on,
              ...proxyConfigOn
            }
          },
          tableConfig: {
            ...config.setColumns.tableConfig,
            ...tableConfig
          }
        };
      } else {
        return config.setColumns;
      }
    },
    proxyConfigOpt() {
      if (this.proxyConfig) {
        const proxyConfigProps =
          this.proxyConfig && this.proxyConfig.props
            ? this.proxyConfig.props
            : {};
        return {
          ...config.proxyConfig,
          ...this.proxyConfig,
          props: {
            ...config.proxyConfig.props,
            ...proxyConfigProps
          }
        };
      }
    },
    tableProps() {
      let that = this;
      const {
        $listeners,
        $scopedSlots,
        tableExtendProps,
        handleTableQuery,
        pagerConfigOpt,
        proxyConfigOpt,
        height,
        onCurrentRowCellClick,
        onCurrentRowChange,
        onKeyDownSpace,
        // handleServerSort,
        keyboardSpace
      } = that;
      const propsData = that.$options.propsData;
      const props = Object.assign({}, tableExtendProps);
      Object.assign(props, {
        props: {
          ...config.props,
          ...propsData,
          data: proxyConfigOpt ? null : propsData.data,
          proxyConfig: utils.clone(proxyConfigOpt, true),
          // columns: columns,
          loading: propsData.loading
        }
      });
      if (height && utils.isString(height) && height.indexOf("calc") > -1) {
        props.props.height = "auto";
      }
      const ons = {};
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          that.$emit(type, ...args);
        };
      });

      ons["cell-click"] = onCurrentRowCellClick;
      ons["current-change"] = onCurrentRowChange;
      let isKeyboardSpace =
        keyboardSpace !== null ? keyboardSpace : config.keyboardSpace;
      if (isKeyboardSpace) {
        ons["keydown"] = e => {
          let event = e.$event;
          if (this.hasCheckbox && event.code == "Space") {
            event.preventDefault();
            event.stopPropagation();
            onKeyDownSpace(e);
          }
          that.$emit("keyDown", e);
        };
      }

      if (proxyConfigOpt && proxyConfigOpt.ajax && proxyConfigOpt.ajax.query) {
        that.hasAjaxQuery = true;
        props.props.proxyConfig.ajax.query = arr => {
          const json = handleTableQuery(arr);
          if (json === false) {
            return false;
          } else if (json) {
            arr = json;
          }
          arr = that.handleServerSort(arr);

          return new Promise((resolve, reject) => {
            proxyConfigOpt.ajax
              .query(arr)
              .then(res => {
                resolve(res);
                if (that.defaultSelectFristRow) {
                  that.$nextTick(() => {
                    let data = utils.getObjData(
                      props.props.proxyConfig.props.result,
                      res
                    );
                    if (data && data.length) {
                      let grid = that.$refs.dataGrid;
                      if (grid) {
                        grid.setCurrentRow(data[0]);
                        grid.focus();
                        that.onCurrentRowChange({
                          row: data[0],
                          rowIndex: 0,
                          $rowIndex: 0
                        });
                      }
                    }
                  });
                }
              })
              .catch(err => {
                reject(err);
              });
          });
          // return proxyConfigOpt.ajax.query(arr);
        };
      }
      // 默认添加分页
      if (props.props.pagerConfig !== false && that.hasAjaxQuery) {
        props.props.pagerConfig = pagerConfigOpt;
      }

      // 合并排序配置
      if (config.sortConfig && utils.isObject(config.sortConfig)) {
        if (props.props.sortConfig) {
          props.props.sortConfig = {
            ...config.sortConfig,
            ...props.props.sortConfig
          };
        } else {
          props.props.sortConfig = { ...config.sortConfig };
        }
      }
      // 全局处理服务端排序
      // if (
      //   props.props.sortConfig &&
      //   props.props.sortConfig.remote &&
      //   !$listeners["sort-change"]
      // ) {
      //   ons["sort-change"] = handleServerSort;
      // }
      props.on = ons;
      props.ref = "dataGrid";
      props.scopedSlots = $scopedSlots;
      return props;
    }
  },
  created() {
    const { columns, proxyColumns, fetchColumns, proxyConfigOpt } = this;
    if (proxyColumns) {
      // 表头代理
      fetchColumns(proxyColumns);
    } else {
      this.setTableColumns(columns);
    }
    if (proxyConfigOpt && proxyConfigOpt.ajax && proxyConfigOpt.ajax.query) {
      this.hasAjaxQuery = true;
    }
  },
  mounted() {},
  destroyed() {},
  methods: {
    ...methods,
    headSearch() {
      this.$nextTick(() => {
        this.$refs.headSearch.onSubmit();
      });
    },
    reload() {
      const { proxyConfig } = this;
      if (proxyConfig && proxyConfig.ajax && proxyConfig.ajax.query) {
        this.$refs.dataGrid.commitProxy("query");
      }
    },
    query(params) {
      const { proxyConfig } = this;
      if (proxyConfig && proxyConfig.ajax && proxyConfig.ajax.query) {
        if (params) {
          this.searchData = { ...this.searchData, ...params };
        }
        this.$refs.dataGrid.commitProxy("reload");
      }
    },
    onSearchSubmit(values) {
      this.searchData = values;
      this.query();
    },
    // 处理调用 proxyConfig.ajax 的query查询方法前处理请求参数
    handleTableQuery(arr) {
      const { searchData, pagerConfigOpt } = this;
      // 头部搜索表单数据
      // let headSearchFormData = {}
      // if (headToolbar && headToolbar.searchConfig && headToolbar.searchConfig.items) {
      //   const headSearchForm = this.$refs.headSearch;
      //   headSearchFormData = headSearchForm.getData();
      // }
      // 分页参数
      let pageData = {};
      if (pagerConfigOpt && arr.page) {
        const pageField = pagerConfigOpt.props.currentPage;
        if (pagerConfigOpt.pageIndex === 0) {
          pageData[pageField] = arr.page.currentPage - 1;
        } else if (pagerConfigOpt.pageIndex) {
          pageData[pageField] =
            arr.page.currentPage - 1 + pagerConfigOpt.pageIndex;
        } else {
          pageData[pageField] = arr.page.currentPage;
        }

        const pageSizeField = pagerConfigOpt.props.pageSize;
        pageData[pageSizeField] = arr.page.pageSize;
      } else if (arr && arr.$grid) {
        pageData = {};
      } else {
        pageData = arr;
      }

      const json = {
        ...pageData,
        ...searchData
      };

      if (arr.filters.length) {
        json.filters = arr.filters;
      }

      if (arr.sort) {
        json.sort = arr.sort;
      }

      // this.tableAjaxJson = json;

      return json;
    },
    onButtonActionClick(action, e) {
      const { searchData } = this;
      if (action === "advancedQuery") {
        if (e) e.target.blur();
        // 显示高级查询
        this.advancedVisible = true;
        this.$nextTick(() => {
          this.$refs.advancedSearch.setData(searchData);
          const advancedSearchForm = utils.clone(this.headToolbar.search, true)
            .advancedSearchForm;
          if (
            advancedSearchForm &&
            advancedSearchForm.on &&
            advancedSearchForm.on.open
          ) {
            advancedSearchForm.on.open(this.$refs.advancedSearch, searchData);
          }
        });
      }
    },
    onAdvancedReset() {
      const { $refs } = this;
      $refs.advancedSearch.resetFields();
      if (config.advancedResetClearHeadSearchForm) {
        $refs.headSearch.resetFields();
        this.searchData = {};
      }
    },
    onAdvancedSubmit() {
      const { $refs, onAdvancedcancel } = this;
      $refs.advancedSearch.validateFields((err, values) => {
        //同步值到headform
        const headSearchForm = this.$refs.headSearch;
        headSearchForm.setData(values);
        this.searchData = values;
        this.query();
        onAdvancedcancel();
      });
    },
    onAdvancedcancel() {
      this.advancedVisible = false;
    },
    // 显示表头设置窗口
    showSetColumns() {
      if (this.$refs.setColumsModal) {
        this.$refs.setColumsModal.show();
      }
    },
    // 设置表头
    setTableColumns(data) {
      const { proxyColumns, fetchColumns, sortable, notSortableFields } = this;
      if (data) {
        let columnsData = utils.clone(data);
        if (sortable) {
          const currentNotSortableFields =
            notSortableFields && notSortableFields.length
              ? notSortableFields
              : [];
          const configNotSortableFields =
            config.sortConfig && config.sortConfig.notSortableFields
              ? config.sortConfig.notSortableFields
              : [];
          const allNotSortableFields = [
            ...configNotSortableFields,
            ...currentNotSortableFields
          ];
          columnsData = columnsData.map(p => {
            if (
              !allNotSortableFields.includes(p.field) &&
              p.sortable !== false
            ) {
              p.sortable = true;
            }
            return p;
          });
        }
        this.backupColumns = columnsData;
        const configProps =
          proxyColumns &&
          proxyColumns.props &&
          utils.isObject(proxyColumns.props)
            ? { ...config.proxyColumns.props, ...proxyColumns.props }
            : config.proxyColumns.props;
        let hasCheckbox = false;
        this.tableColumns = this.editColumnsRender(columnsData, p => {
          if (!hasCheckbox && p.type == "checkbox") {
            hasCheckbox = true;
          }

          return p[configProps.show] !== false;
        });
        this.hasCheckbox = hasCheckbox;
      } else if (proxyColumns) {
        fetchColumns(proxyColumns);
      }
    },
    // // 渲染ACheckbox编辑组件
    // renderCheckbox(scope) {
    //   const vm = new Vue();
    //   const h = vm.$createElement;
    //   const currentColumn = this.tableColumns[scope.columnIndex];
    //   return h("a-checkbox", {
    //     props: {
    //       ...currentColumn.editRender.props,
    //       checked: scope.row[scope.column.property]
    //     },
    //     on: {
    //       input(val) {
    //         scope.row[scope.column.property] = val;
    //         if (
    //           currentColumn.editRender.on &&
    //           currentColumn.editRender.on.change
    //         ) {
    //           currentColumn.editRender.on.change(scope);
    //         }
    //       }
    //     }
    //   });
    // },
    // // 渲染ASwitch编辑组件
    // renderSwitch(scope) {
    //   const vm = new Vue();
    //   const h = vm.$createElement;
    //   const currentColumn = this.tableColumns[scope.columnIndex];
    //   return h("a-switch", {
    //     props: {
    //       ...currentColumn.editRender.props,
    //       checked: scope.row[scope.column.property]
    //     },
    //     on: {
    //       input: val => {
    //         scope.row[scope.column.property] = val;
    //       },
    //       update: val => {
    //         scope.row[scope.column.property] = val;
    //       },
    //       change(val) {
    //         scope.row[scope.column.property] = val;
    //         if (
    //           currentColumn.editRender.on &&
    //           currentColumn.editRender.on.change
    //         ) {
    //           currentColumn.editRender.on.change(scope);
    //         }
    //       }
    //     }
    //   });
    // },
    // // 渲染下拉面板显示组件
    // renderPulldownTableView(scope) {
    //   const vm = new Vue();
    //   const h = vm.$createElement;
    //   const value = scope.row[scope.column.property];
    //   const currentColumn = this.tableColumns[scope.columnIndex];
    //   const taxtField =
    //     currentColumn.editRender.props &&
    //     currentColumn.editRender.props.textField
    //       ? currentColumn.editRender.props.textField
    //       : "name";
    //   let text = "";
    //   if (value && utils.isArray(value)) {
    //     text = value.map(p => p[taxtField]).join(",");
    //   } else if (value && utils.isObject(value)) {
    //     text = value[taxtField];
    //   } else if (value) {
    //     text = value;
    //   }
    //   return h("div", {}, [text]);
    // },
    // // 渲染下拉面板组件
    // renderPulldownTable(scope) {
    //   // const { handlePulldownTableChange } = this;
    //   const vm = new Vue();
    //   const h = vm.$createElement;
    //   const currentColumn = this.tableColumns[scope.columnIndex];
    //   return h("pulldownTable", {
    //     props: {
    //       ...currentColumn.editRender.props
    //     },
    //     on: {
    //       change(val) {
    //         scope.row[scope.column.property] = val;
    //         if (
    //           currentColumn.editRender.on &&
    //           currentColumn.editRender.on.change
    //         ) {
    //           currentColumn.editRender.on.change(scope);
    //         }
    //       }
    //     }
    //   });
    // },
    // api获取表头
    fetchColumns(opt) {
      const { columns } = this;
      const that = this;
      const defaultAjax =
        config.proxyColumns && config.proxyColumns.defaultAjax
          ? config.proxyColumns.defaultAjax
          : {};
      let params = null;
      let queryApi = null;
      if (opt.params) {
        params = opt.params;
        if (defaultAjax && defaultAjax.query && !(opt.ajax && opt.ajax.query)) {
          queryApi = defaultAjax.query;
        }
      }
      if (opt.ajax && opt.ajax.query) {
        queryApi = opt.ajax.query;
      }
      if (queryApi) {
        queryApi(params).then(res => {
          const configProps =
            opt.props && utils.isObject(opt.props)
              ? { ...config.proxyColumns.props, ...opt.props }
              : config.proxyColumns.props;
          const data = utils.getObjData(configProps.list, res);
          const tableColumns = handleColumnsData(
            data,
            columns,
            configProps,
            that
          );
          this.backupColumns = utils.clone(tableColumns);
          // this.tableColumns = tableColumns.filter(
          //   p => p[configProps.show] !== false
          // );

          let hasCheckbox = false;

          this.tableColumns = this.editColumnsRender(tableColumns, p => {
            if (!hasCheckbox && p.type == "checkbox") {
              hasCheckbox = true;
            }

            return p[configProps.show] !== false;
          });
          this.hasCheckbox = hasCheckbox;
        });
      }
    },
    // 工具条按钮点击
    onToobarButtonClick(code) {
      this.$emit("toobarButtonClick", code);
    },
    // 设置搜索表单的值
    setSearchData(values) {
      const headSearchForm = this.$refs.headSearchForm;
      if (headSearchForm && headSearchForm.setData) {
        headSearchForm.setData(values);
      }
      const headToolbarSearch = this.$refs.headSearch;
      if (headToolbarSearch && headToolbarSearch.setData) {
        headToolbarSearch.setData(values);
      }
      this.searchData = values;
    },
    // 获取搜索表单的值
    getSearchData() {
      return this.searchData;
    },
    // 允许反选高亮行时接管，高亮行选中事件
    onCurrentRowChange(e) {
      const that = this;
      setTimeout(() => {
        that.currentRow = e.row;
      }, 10);
      this.$emit("current-change", e);
    },
    //当表格被激活且键盘被按下空格时
    onKeyDownSpace: utils.debounce(function() {
      let grid = this.$refs.dataGrid;
      let row = this.currentRow;
      grid.setCheckboxRow(row, !grid.isCheckedByCheckboxRow(row));
      this.$nextTick(() => {
        this.$emit("checkbox-change", { records: grid.getCheckboxRecords() });
      });
    }, 300),
    // 允许反选高亮行时接管，单元格点击事件
    onCurrentRowCellClick(e) {
      let that = this;

      if (that.highlightCurrentUnselect) {
        if (that.currentRow._XID && e.row._XID === that.currentRow._XID) {
          that.$refs.dataGrid.clearCurrentRow();
          that.currentRow = {};
          that.$emit("current-change", { ...e, row: null });
        }
      }
      that.$emit("cell-click", e);
      //表格  行编辑 专用
      that.onEditTableCurrentRowCellClick(e);
    },
    handleServerSort(params) {
      const { tableProps } = this;
      if (
        tableProps.props.sortConfig &&
        tableProps.props.sortConfig.handleServerSortParams
      ) {
        params = tableProps.props.sortConfig.handleServerSortParams(params);
      }
      return params;
    }
  },
  beforeDestroy() {},
  render(h) {
    const {
      tableProps,
      headToolbar,
      setcolumnsConfig,
      height,
      searchConfig
    } = this;
    const nodes = [];
    if (
      (headToolbar && headToolbar.tools && headToolbar.tools.setColumns) ||
      setcolumnsConfig
    ) {
      nodes.push(renderColumnsModal(h, this));
    }
    let tableHeight = "";
    if (height && utils.isString(height) && height.indexOf("calc") > -1) {
      tableHeight = height;
    }

    // // 渲染头部搜索表单
    let headSearchForm = "";
    if (searchConfig) {
      // 头部搜索
      headSearchForm = renderHeadSearch(searchConfig, h, this);
    }

    return h(
      "div",
      {
        class: "data-table"
      },
      [
        headSearchForm,
        renderHeadToolbar(h, this),
        h(
          "div",
          {
            style: {
              height: tableHeight
            },
            attrs: {
              "table-index": this.tableIndex.toString()
            }
          },
          [
            h("vxe-grid", {
              ...tableProps,
              props: { ...tableProps.props, columns: this.tableColumns }
            })
          ]
        )
      ].concat(nodes)
    );
  }
};
