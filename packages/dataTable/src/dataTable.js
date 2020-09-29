import Vue from "vue";
import "vxe-table/lib/index.css";
import utils from "../../utils";
import { Table } from "vxe-table";
import { DataForm } from "../../dataForm";
import config from "../conf";
import SetColums from "./setColums";

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
  const items = searchConfig.items.filter(item => !item.folding);
  let form = h("data-form", {
    ref: "headSearch",
    props: {
      ...searchConfig,
      items
      // onButtonActionClick: onButtonActionClick
    },
    class: "head-search-form",
    on: {
      ...searchConfig.on,
      buttonActionClick: onButtonActionClick,
      submit: onSearchSubmit
    },
    scopedSlots: $scopedSlots
  });

  return form;
}
// 渲染高级查询窗口
function renderAdvancedSearch(searchConfig, h, _vm) {
  const {
    onSearchSubmit,
    advancedVisible,
    onAdvancedcancel,
    onAdvancedSubmit,
    $scopedSlots
  } = _vm;
  const items = searchConfig.items.filter(item => item.folding !== false);
  const formProps =
    searchConfig.advancedSearchForm && searchConfig.advancedSearchForm.props
      ? searchConfig.advancedSearchForm.props
      : {};
  let form = h("data-form", {
    ref: "advancedSearch",
    props: {
      ...formProps,
      items,
      layout: searchConfig.foldingLayout ? searchConfig.foldingLayout : "flex"
    },
    class: "advanced-search-form",
    on: {
      ...searchConfig.on,
      submit: onSearchSubmit
    },
    scopedSlots: $scopedSlots
  });

  const modalProps =
    searchConfig.advancedSearchModal && searchConfig.advancedSearchModal.props
      ? searchConfig.advancedSearchModal.props
      : {};

  return h(
    "a-modal",
    {
      ...searchConfig.advancedSearchModal,
      props: {
        ...modalProps,
        title: modalProps.title ? modalProps.title : "高级搜索",
        visible: advancedVisible
      },
      on: {
        cancel: onAdvancedcancel,
        ok: onAdvancedSubmit
      },
      class: "advanced-search-modal"
    },
    [form]
  );
}

// 渲染设置表头窗口
function renderColumnsModal(h, _vm) {
  const { backupColumns, setTableColumns, setColumnsOpt } = _vm;

  return h("SetColums", {
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
    setcolumnsConfig
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
  if (headToolbar.buttons) {
    const buttons = renderButtons(headToolbar.buttons, h, _vm);
    headToolbarProps.scopedSlots.buttons = () => {
      return buttons;
    };
  }
  let advancedSearch = "";
  let headSearchTools = "";
  // 渲染头部搜索表单
  if (headToolbar.search) {
    headSearchTools = renderHeadSearch(headToolbar.search, h, _vm);
    advancedSearch = renderAdvancedSearch(headToolbar.search, h, _vm);
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
  if (!headToolbarProps.scopedSlots.tools && headSearchTools) {
    headToolbarProps.scopedSlots.tools = () => {
      return headSearchTools;
    };
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
function handleColumnsData(data, columns, configProps) {
  let copyColumns = utils.clone(columns);
  const apiColumns = data.map(item => {
    // 替换字段
    let obj = {
      ...item
    };
    for (const key in configProps) {
      if (key !== "list") {
        obj[key] = item[configProps[key]];
      }
    }
    // 合并传入的定义
    if (copyColumns && copyColumns.length) {
      const findIndex = copyColumns.findIndex(p => p.field === obj.field);
      if (findIndex > -1) {
        const find = copyColumns[findIndex];
        obj = { ...obj, ...find };
        copyColumns.splice(findIndex, 1);
      }
    }
    if (obj.children && obj.children.length) {
      obj.children = handleColumnsData(obj.children, obj.children, configProps);
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
    SetColums
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
    proxyColumns: Object
  },
  watch: {
    columns(val) {
      // this.tableColumns = val;
      this.setTableColumns(val);
    }
  },
  data() {
    return {
      backupColumns: [],
      tableColumns: [],
      advancedVisible: false,
      searchData: {}
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
        return {
          modal: {
            props: {
              ...config.setColumns.modal.props,
              ...modalProps
            }
          },
          proxyConfig: {
            props: {
              ...config.setColumns.proxyConfig.props,
              ...proxyConfigProps
            },
            ajax: {
              ...config.setColumns.proxyConfig.ajax,
              ...proxyConfigAjax
            }
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
      const {
        $listeners,
        $scopedSlots,
        tableExtendProps,
        handleTableQuery,
        tableColumns,
        renderCheckbox,
        pagerConfigOpt,
        proxyConfigOpt
      } = this;
      const propsData = this.$options.propsData;
      const props = Object.assign({}, tableExtendProps);

      const columns = tableColumns.map(item => {
        if (
          item.editRender &&
          item.editRender.name &&
          item.editRender.name === "ACheckbox"
        ) {
          item.slots = {
            default: "a_checkbox",
            edit: "a_checkbox"
          };
          this.$scopedSlots["a_checkbox"] = renderCheckbox;
        }
        return item;
      });

      Object.assign(props, {
        props: {
          ...config.props,
          ...propsData,
          proxyConfig: proxyConfigOpt,
          columns: columns
        }
      });
      const ons = {};
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          this.$emit(type, ...args);
        };
      });
      let hasAjax = false;
      if (
        props.props.proxyConfig &&
        props.props.proxyConfig.ajax &&
        props.props.proxyConfig.ajax.query
      ) {
        hasAjax = true;
        const query = props.props.proxyConfig.ajax.query;
        props.props.proxyConfig.ajax.query = arr => {
          const json = handleTableQuery(arr);
          if (json === false) {
            return false;
          } else if (json) {
            arr = json;
          }
          return query(arr);
        };
      }
      // 默认添加分页
      if (
        !props.props.pagerConfig &&
        props.props.pagerConfig !== false &&
        hasAjax
      ) {
        props.props.pagerConfig = pagerConfigOpt;
      }
      props.on = ons;
      props.ref = "dataGrid";
      props.scopedSlots = $scopedSlots;
      return props;
    }
  },
  created() {
    const { columns, proxyColumns, fetchColumns } = this;
    if (proxyColumns) {
      // 表头代理
      fetchColumns(proxyColumns);
    }
    this.tableColumns = columns ? columns : [];
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    ...methods,
    reload() {
      const { proxyConfig } = this;
      if (proxyConfig && proxyConfig.ajax && proxyConfig.ajax.query) {
        this.$refs.dataGrid.commitProxy("reload");
      }
    },
    onSearchSubmit(values) {
      this.searchData = values;
      this.$refs.dataGrid.commitProxy("reload");
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
        const currentPageField = pagerConfigOpt.props.currentPage;
        pageData[currentPageField] = arr.page.currentPage;

        const pageSizeField = pagerConfigOpt.props.pageSize;
        pageData[pageSizeField] = arr.page.pageSize;
      }

      const json = {
        ...searchData,
        ...pageData
      };
      return json;
    },
    onButtonActionClick(action) {
      const { searchData } = this;
      if (action === "advancedQuery") {
        // 显示高级查询
        this.advancedVisible = true;
        this.$nextTick(() => {
          this.$refs.advancedSearch.setData(searchData);
        });
      }
    },
    onAdvancedSubmit() {
      const { $refs, onAdvancedcancel } = this;
      $refs.advancedSearch.validateFields().then(values => {
        //同步值到headform
        const headSearchForm = this.$refs.headSearch;
        headSearchForm.setData(values);
        // reload
        this.searchData = values;
        $refs.dataGrid.commitProxy("reload");
        // cancel
        onAdvancedcancel();
      });
    },

    onAdvancedcancel() {
      this.advancedVisible = false;
    },
    // 显示表头设置窗口
    showSetColumns() {
      // const toolbar = this.$refs.headToolbar;
      this.$refs.setColumsModal.show();
    },
    // 设置表头
    setTableColumns(data) {
      const { proxyColumns, fetchColumns } = this;

      if (data) {
        this.backupColumns = utils.clone(data);
        const configProps =
          proxyColumns.props && utils.isObject(proxyColumns.props)
            ? { ...config.proxyColumns.props, ...proxyColumns.props }
            : config.proxyColumns.props;
        this.tableColumns = data.filter(p => p[configProps.show] !== false);
      } else if (proxyColumns) {
        fetchColumns(proxyColumns);
      }
    },
    // 渲染ACheckbox编辑组件
    renderCheckbox(scope) {
      const vm = new Vue();
      const h = vm.$createElement;
      return h("a-checkbox", {
        props: {
          checked: scope.row[scope.column.property]
        },
        on: {
          input(val) {
            scope.row[scope.column.property] = val;
          }
        }
      });
    },
    // api获取表头
    fetchColumns(opt) {
      const { columns } = this;
      if (opt.ajax && opt.ajax.query) {
        opt.ajax.query().then(res => {
          const configProps =
            opt.props && utils.isObject(opt.props)
              ? { ...config.proxyColumns.props, ...opt.props }
              : config.proxyColumns.props;
          const data = utils.getObjData(configProps.list, res);
          const tableColumns = handleColumnsData(data, columns, configProps);
          this.backupColumns = utils.clone(tableColumns);
          this.tableColumns = tableColumns.filter(
            p => p[configProps.show] !== false
          );
        });
      }
    },
    // 工具条按钮点击
    onToobarButtonClick(code) {
      this.$emit("toobarButtonClick", code);
    }
  },
  render(h) {
    const { tableProps, headToolbar, setcolumnsConfig } = this;

    const nodes = [];
    if (
      (headToolbar && headToolbar.tools && headToolbar.tools.setColumns) ||
      setcolumnsConfig
    ) {
      nodes.push(renderColumnsModal(h, this));
    }
    return h(
      "div",
      {
        class: "data-table"
      },
      [renderHeadToolbar(h, this), h("vxe-grid", tableProps)].concat(nodes)
    );
  }
};
