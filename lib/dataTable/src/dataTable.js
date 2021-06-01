"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find-index");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.search");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var _vue = _interopRequireDefault(require("vue"));

require("vxe-table/lib/index.css");

var _utils = _interopRequireDefault(require("../../utils"));

var _vxeTable = require("vxe-table");

var _dataForm = require("../../dataForm");

var _conf = _interopRequireDefault(require("../conf"));

var _setColums = _interopRequireDefault(require("./setColums"));

var tablePropKeys = Object.keys(_vxeTable.Table.props);
var methods = {};
Object.keys(_vxeTable.Table.methods).forEach(function (name) {
  methods[name] = function () {
    var _this$$refs$dataGrid;

    return this.$refs.dataGrid && (_this$$refs$dataGrid = this.$refs.dataGrid)[name].apply(_this$$refs$dataGrid, arguments);
  };
}); // 渲染头部搜索表单

function renderHeadSearch(searchConfig, h, _vm) {
  var onSearchSubmit = _vm.onSearchSubmit,
      onButtonActionClick = _vm.onButtonActionClick,
      $scopedSlots = _vm.$scopedSlots;
  var items = searchConfig.items;
  var form = h("data-form", {
    ref: "headSearchForm",
    props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, searchConfig), {}, {
      items: items
    }),
    class: "head-search-form",
    style: searchConfig.style,
    on: (0, _objectSpread2.default)((0, _objectSpread2.default)({
      submit: onSearchSubmit
    }, searchConfig.on), {}, {
      buttonActionClick: onButtonActionClick
    }),
    scopedSlots: $scopedSlots
  });
  return form;
} // 渲染头部工具条搜索表单


function renderHeadToolbarSearch(searchConfig, h, _vm) {
  var onSearchSubmit = _vm.onSearchSubmit,
      onButtonActionClick = _vm.onButtonActionClick,
      $scopedSlots = _vm.$scopedSlots;

  var cloneSearchConfig = _utils.default.clone(searchConfig, true);

  var items = cloneSearchConfig.items.filter(function (item) {
    return !item.folding;
  }); // 生成查询按钮

  var actionButtons = [];

  if (cloneSearchConfig.submitButtonProps !== false) {
    var submitButtonProps = cloneSearchConfig.submitButtonProps && _utils.default.isObject(cloneSearchConfig.submitButtonProps) ? cloneSearchConfig.submitButtonProps : {};
    actionButtons.push({
      props: (0, _objectSpread2.default)({
        action: "submit",
        content: "查询",
        type: "primary"
      }, submitButtonProps)
    });
  } // 高级查询按钮


  var hasFolding = cloneSearchConfig.items.findIndex(function (p) {
    return p.folding;
  }) > -1;

  if (hasFolding && cloneSearchConfig.advancedSearchButtonProps !== false) {
    var advancedSearchButtonProps = cloneSearchConfig.advancedSearchButtonProps && _utils.default.isObject(cloneSearchConfig.advancedSearchButtonProps) ? cloneSearchConfig.advancedSearchButtonProps : {};
    actionButtons.push({
      props: (0, _objectSpread2.default)({
        action: "advancedQuery",
        content: "高级查询"
      }, advancedSearchButtonProps)
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

  var form = h("data-form", {
    ref: "headSearch",
    props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, cloneSearchConfig), {}, {
      submitButtonProps: false,
      items: items
    }),
    class: "headtoolbar-search-form",
    on: (0, _objectSpread2.default)((0, _objectSpread2.default)({
      submit: onSearchSubmit
    }, cloneSearchConfig.on), {}, {
      buttonActionClick: onButtonActionClick
    }),
    style: (0, _objectSpread2.default)({}, cloneSearchConfig.style),
    scopedSlots: $scopedSlots
  });
  return form;
} // 渲染高级查询窗口


function renderAdvancedSearch(searchConfig, h, _vm) {
  var onSearchSubmit = _vm.onSearchSubmit,
      advancedVisible = _vm.advancedVisible,
      onAdvancedcancel = _vm.onAdvancedcancel,
      onAdvancedSubmit = _vm.onAdvancedSubmit,
      $scopedSlots = _vm.$scopedSlots;

  var cloneSearchConfig = _utils.default.clone(searchConfig, true);

  var items = cloneSearchConfig.items.filter(function (item) {
    return item.folding !== false;
  });
  var formItems = items.map(function (p) {
    delete p.folding;
    return p;
  });
  var formProps = cloneSearchConfig.advancedSearchForm && cloneSearchConfig.advancedSearchForm.props ? cloneSearchConfig.advancedSearchForm.props : {};
  var form = h("data-form", {
    ref: "advancedSearch",
    props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, formProps), {}, {
      items: formItems,
      submitButtonProps: false
    }),
    class: "advanced-search-form",
    on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, cloneSearchConfig.on), {}, {
      submit: onSearchSubmit
    }),
    scopedSlots: $scopedSlots
  });
  var modalProps = cloneSearchConfig.advancedSearchModal && cloneSearchConfig.advancedSearchModal.props ? cloneSearchConfig.advancedSearchModal.props : {};
  return h("a-modal", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, cloneSearchConfig.advancedSearchModal), {}, {
    props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, modalProps), {}, {
      title: modalProps.title ? modalProps.title : "高级查询",
      visible: advancedVisible
    }),
    on: {
      cancel: onAdvancedcancel,
      ok: onAdvancedSubmit
    },
    class: "advanced-search-modal"
  }), [form]);
} // 渲染设置表头窗口


function renderColumnsModal(h, _vm) {
  var backupColumns = _vm.backupColumns,
      setTableColumns = _vm.setTableColumns,
      setColumnsOpt = _vm.setColumnsOpt;
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
} // 渲染工具栏按钮


function renderButton(item, h, hasDropdown, _vm) {
  var name = item.name,
      icon = item.icon,
      disabled = item.disabled,
      code = item.code,
      on = item.on;
  var onToobarButtonClick = _vm.onToobarButtonClick;
  var iconContent = "";

  if (icon) {
    iconContent = h("a-icon", {
      props: {
        type: icon
      }
    });
  }

  var onClick = function onClick(e) {
    if (e) e.target.blur();
    onToobarButtonClick(code);

    if (on && on.click) {
      on.click(e);
    }
  }; // 下拉按钮


  if (hasDropdown) {
    return h("a-menu-item", {
      key: code,
      props: {
        disabled: disabled
      },
      on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, on), {}, {
        click: onClick
      })
    }, [iconContent, name]);
  }

  return h("a-button", {
    key: code,
    props: {
      type: item.type,
      disabled: disabled
    },
    on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, on), {}, {
      click: onClick
    })
  }, [iconContent, name]);
} // 渲染工具栏按钮组


function renderButtons(buttons, h, _vm) {
  return buttons ? buttons.map(function (item) {
    if (Object.prototype.toString.call(item) === "[object Array]") {
      // 数组，渲染按钮组
      var buttonGroups = item.map(function (p) {
        return renderButton(p, h, false, _vm);
      });
      return h("a-button-group", {}, [buttonGroups]);
    } else if (item.dropdowns && item.dropdowns.length) {
      var _buttonGroups = item.dropdowns.map(function (p) {
        return renderButton(p, h, true, _vm);
      });

      var menus = h("a-menu", {
        slot: "overlay"
      }, [_buttonGroups]);
      return h("a-dropdown", {
        props: {
          disabled: item.disabled
        },
        scopedSlots: {
          overlay: function overlay() {
            return menus;
          }
        }
      }, [h("a-button", {}, [item.name, h("a-icon", {
        props: {
          type: "down"
        }
      })])]);
    } else if (Object.prototype.toString.call(item) === "[object Object]") {
      // 对象，渲染单个按钮
      return renderButton(item, h, false, _vm);
    }
  }) : [];
} // 渲染头部工具栏


function renderHeadToolbar(h, _vm) {
  var headToolbar = _vm.headToolbar,
      $nextTick = _vm.$nextTick,
      $refs = _vm.$refs,
      showSetColumns = _vm.showSetColumns,
      setcolumnsConfig = _vm.setcolumnsConfig,
      $slots = _vm.$slots;

  if (!headToolbar) {
    return false;
  }

  var headToolbarProps = {
    ref: "headToolbar",
    props: {},
    class: "head-toolbar",
    scopedSlots: {}
  }; // 渲染按钮

  var headButtons = "";

  if ($slots.headToolbar_buttons) {
    headButtons = $slots.headToolbar_buttons;
  } else if (headToolbar.buttons) {
    var buttons = renderButtons(headToolbar.buttons, h, _vm);
    headButtons = buttons;
  }

  if (headButtons) {
    if (headToolbar.search && headToolbar.search.position === "left") {
      headToolbarProps.scopedSlots.tools = function () {
        return headButtons;
      };
    } else {
      headToolbarProps.scopedSlots.buttons = function () {
        return headButtons;
      };
    }
  } // 渲染头部搜索表单


  var advancedSearch = "";
  var headSearchTools = "";

  if (headToolbar.search) {
    headSearchTools = renderHeadToolbarSearch(headToolbar.search, h, _vm);
    advancedSearch = renderAdvancedSearch(headToolbar.search, h, _vm);
  }

  if (headSearchTools) {
    if (headToolbar.search.position === "left") {
      headToolbarProps.scopedSlots.buttons = function () {
        return headSearchTools;
      };
    } else {
      headToolbarProps.scopedSlots.tools = function () {
        return headSearchTools;
      };
    }
  } // 渲染头部工具


  var setColumnsModal = "";

  if (headToolbar.tools) {
    headToolbarProps.props = (0, _objectSpread2.default)({}, headToolbar.tools); // 自定义的 setColumns

    if (headToolbar.tools.setColumns) {
      var buttonProps = _utils.default.isObject(headToolbar.tools.setColumns) ? headToolbar.tools.setColumns : {};
      var setColumnsBtn = h("a-button", {
        props: (0, _objectSpread2.default)({
          circle: true,
          icon: "setting",
          shape: "circle"
        }, buttonProps),
        class: "tool-btn-setcolumns",
        style: {
          marginRight: "10px"
        },
        on: {
          click: showSetColumns
        }
      });

      if (headSearchTools) {
        headToolbarProps.scopedSlots.tools = function () {
          return h("div", {
            style: {
              display: "flex"
            }
          }, [headSearchTools, setColumnsBtn]);
        };
      } else {
        headToolbarProps.scopedSlots.tools = function () {
          return setColumnsBtn;
        };
      }

      if (!setcolumnsConfig) {
        setColumnsModal = renderColumnsModal(h, _vm);
      }
    }

    $nextTick(function () {
      $refs.dataGrid.connect($refs.headToolbar);
    });
  }

  return h("div", {
    class: "head-toolbar-box"
  }, [h("vxe-toolbar", headToolbarProps, []), advancedSearch, setColumnsModal]);
} //处理api获取的表头数据


function handleColumnsData(data, columns, configProps) {
  var copyColumns = _utils.default.clone(columns);

  var apiColumns = data.map(function (item) {
    // 替换字段
    var obj = (0, _objectSpread2.default)({}, item);

    for (var key in configProps) {
      if (key !== "list") {
        obj[key] = item[configProps[key]];
      }
    } // 合并传入的定义


    if (copyColumns && copyColumns.length) {
      var findIndex = copyColumns.findIndex(function (p) {
        return p.field === obj.field;
      });

      if (findIndex > -1) {
        var find = copyColumns[findIndex];
        obj = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, obj), find);
        copyColumns.splice(findIndex, 1);
      }
    }

    if (obj.children && obj.children.length) {
      obj.children = handleColumnsData(obj.children, obj.children, configProps);
    }

    return obj;
  }); //处理插入指定位置的传入配置项

  if (copyColumns && copyColumns.length) {
    copyColumns = copyColumns.map(function (item) {
      if (item.colIndex || item.colIndex === 0) {
        apiColumns.splice(item.colIndex, 0, item);
        return "";
      }

      return item;
    }).filter(function (p) {
      return p != "";
    });
  }

  var columnsData = [];

  if (copyColumns && copyColumns.length) {
    columnsData = apiColumns.concat(copyColumns);
  } else {
    columnsData = apiColumns;
  } // this.backupColumns = utils.clone(columnsData);
  // columnsData = columnsData.filter(p => p[configProps.show] !== false);


  return columnsData;
}

var _default2 = {
  name: "DataTable",
  components: {
    DataForm: _dataForm.DataForm,
    SetColums: _setColums.default
  },
  props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _vxeTable.Table.props), {}, {
    columns: Array,
    pagerConfig: {
      type: [Boolean, Object],
      default: function _default() {}
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
    highlightCurrentUnselect: Boolean // tableHeight: {
    //   type: String,
    //   default: "auto"
    // }

  }),
  watch: {
    columns: function columns(val) {
      // this.tableColumns = val;
      this.setTableColumns(val);
    }
  },
  data: function data() {
    return {
      backupColumns: [],
      tableColumns: [],
      advancedVisible: false,
      searchData: {},
      tableHeight: "",
      currentRow: {}
    };
  },
  computed: {
    tableExtendProps: function tableExtendProps() {
      var _this = this;

      var rest = {};
      tablePropKeys.forEach(function (key) {
        rest[key] = _this[key];
      });
      return rest;
    },
    pagerConfigOpt: function pagerConfigOpt() {
      if (this.pagerConfig) {
        return (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.pagerConfig), this.pagerConfig);
      } else if (!this.pagerConfig && this.pagerConfig !== false) {
        return _conf.default.pagerConfig;
      }

      return false;
    },
    setColumnsOpt: function setColumnsOpt() {
      if (this.setcolumnsConfig) {
        var modalProps = this.setcolumnsConfig && this.setcolumnsConfig.modal && this.setcolumnsConfig.modal.props ? this.setcolumnsConfig.modal.props : {};
        var proxyConfigProps = this.setcolumnsConfig && this.setcolumnsConfig.proxyConfig && this.setcolumnsConfig.proxyConfig.props ? this.setcolumnsConfig.proxyConfig.props : {};
        var proxyConfigAjax = this.setcolumnsConfig && this.setcolumnsConfig.proxyConfig && this.setcolumnsConfig.proxyConfig.ajax ? this.setcolumnsConfig.proxyConfig.ajax : {};
        return {
          modal: {
            props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.setColumns.modal.props), modalProps)
          },
          proxyConfig: {
            props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.setColumns.proxyConfig.props), proxyConfigProps),
            ajax: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.setColumns.proxyConfig.ajax), proxyConfigAjax)
          }
        };
      } else {
        return _conf.default.setColumns;
      }
    },
    proxyConfigOpt: function proxyConfigOpt() {
      if (this.proxyConfig) {
        var proxyConfigProps = this.proxyConfig && this.proxyConfig.props ? this.proxyConfig.props : {};
        return (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig), this.proxyConfig), {}, {
          props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyConfig.props), proxyConfigProps)
        });
      }
    },
    tableProps: function tableProps() {
      var _this2 = this;

      var $listeners = this.$listeners,
          $scopedSlots = this.$scopedSlots,
          tableExtendProps = this.tableExtendProps,
          handleTableQuery = this.handleTableQuery,
          tableColumns = this.tableColumns,
          renderCheckbox = this.renderCheckbox,
          pagerConfigOpt = this.pagerConfigOpt,
          proxyConfigOpt = this.proxyConfigOpt,
          renderPulldownTable = this.renderPulldownTable,
          renderPulldownTableView = this.renderPulldownTableView,
          renderSwitch = this.renderSwitch,
          height = this.height,
          highlightCurrentUnselect = this.highlightCurrentUnselect,
          onCurrentRowCellClick = this.onCurrentRowCellClick,
          onCurrentRowChange = this.onCurrentRowChange;
      var propsData = this.$options.propsData;
      var props = Object.assign({}, tableExtendProps);
      var columns = tableColumns.map(function (item) {
        if (item.editRender && item.editRender.name && item.editRender.name === "ACheckbox") {
          item.slots = {
            default: "a_checkbox",
            edit: "a_checkbox"
          };
          _this2.$scopedSlots["a_checkbox"] = renderCheckbox;
        } else if (item.editRender && item.editRender.name && item.editRender.name === "ASwitch") {
          item.slots = {
            default: "a_switch",
            edit: "a_switch"
          };
          _this2.$scopedSlots["a_switch"] = renderSwitch;
        } else if (item.editRender && item.editRender.name && item.editRender.name === "pulldownTable") {
          item.slots = {
            default: "pulldownTableView",
            edit: "pulldownTable"
          };
          _this2.$scopedSlots["pulldownTableView"] = renderPulldownTableView;
          _this2.$scopedSlots["pulldownTable"] = renderPulldownTable;
        }

        return item;
      });
      Object.assign(props, {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.props), propsData), {}, {
          proxyConfig: _utils.default.clone(proxyConfigOpt, true),
          columns: columns,
          loading: propsData.loading
        })
      });

      if (height && _utils.default.isString(height) && height.indexOf("calc") > -1) {
        props.props.height = "auto";
      }

      var ons = {};

      _utils.default.each($listeners, function (cb, type) {
        ons[type] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this2.$emit.apply(_this2, [type].concat(args));
        };
      });

      var hasAjax = false;

      if (proxyConfigOpt && proxyConfigOpt.ajax && proxyConfigOpt.ajax.query) {
        hasAjax = true;

        props.props.proxyConfig.ajax.query = function (arr) {
          var json = handleTableQuery(arr);

          if (json === false) {
            return false;
          } else if (json) {
            arr = json;
          }

          return proxyConfigOpt.ajax.query(arr);
        };
      } // 默认添加分页


      if (props.props.pagerConfig !== false && hasAjax) {
        props.props.pagerConfig = pagerConfigOpt;
      } //高亮行反选


      if (highlightCurrentUnselect) {
        ons["cell-click"] = onCurrentRowCellClick;
        ons["current-change"] = onCurrentRowChange;
      }

      props.on = ons;
      props.ref = "dataGrid";
      props.scopedSlots = $scopedSlots;
      return props;
    }
  },
  created: function created() {
    var columns = this.columns,
        proxyColumns = this.proxyColumns,
        fetchColumns = this.fetchColumns;

    if (proxyColumns) {
      // 表头代理
      fetchColumns(proxyColumns);
    }

    this.tableColumns = columns ? columns : [];
  },
  mounted: function mounted() {},
  beforeDestroy: function beforeDestroy() {},
  destroyed: function destroyed() {},
  methods: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, methods), {}, {
    reload: function reload(params) {
      var proxyConfig = this.proxyConfig;

      if (proxyConfig && proxyConfig.ajax && proxyConfig.ajax.query) {
        if (params) {
          this.searchData = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, this.searchData), params);
        }

        this.$refs.dataGrid.commitProxy("reload");
      }
    },
    onSearchSubmit: function onSearchSubmit(values) {
      this.searchData = values;
      this.reload();
    },
    // 处理调用 proxyConfig.ajax 的query查询方法前处理请求参数
    handleTableQuery: function handleTableQuery(arr) {
      var searchData = this.searchData,
          pagerConfigOpt = this.pagerConfigOpt; // 头部搜索表单数据
      // let headSearchFormData = {}
      // if (headToolbar && headToolbar.searchConfig && headToolbar.searchConfig.items) {
      //   const headSearchForm = this.$refs.headSearch;
      //   headSearchFormData = headSearchForm.getData();
      // }
      // 分页参数

      var pageData = {};

      if (pagerConfigOpt && arr.page) {
        var currentPageField = pagerConfigOpt.props.currentPage;

        if (pagerConfigOpt.pageIndex === 0) {
          pageData[currentPageField] = arr.page.currentPage - 1;
        } else if (pagerConfigOpt.pageIndex) {
          pageData[currentPageField] = arr.page.currentPage - 1 + pagerConfigOpt.pageIndex;
        } else {
          pageData[currentPageField] = arr.page.currentPage;
        }

        var pageSizeField = pagerConfigOpt.props.pageSize;
        pageData[pageSizeField] = arr.page.pageSize;
      } else if (arr && arr.$grid) {
        pageData = {};
      } else {
        pageData = arr;
      }

      var json = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, searchData), pageData);
      return json;
    },
    onButtonActionClick: function onButtonActionClick(action, e) {
      var _this3 = this;

      var searchData = this.searchData;

      if (action === "advancedQuery") {
        if (e) e.target.blur(); // 显示高级查询

        this.advancedVisible = true;
        this.$nextTick(function () {
          _this3.$refs.advancedSearch.setData(searchData);
        });
      }
    },
    onAdvancedSubmit: function onAdvancedSubmit() {
      var _this4 = this;

      var $refs = this.$refs,
          onAdvancedcancel = this.onAdvancedcancel;
      $refs.advancedSearch.validateFields().then(function (values) {
        //同步值到headform
        var headSearchForm = _this4.$refs.headSearch;
        headSearchForm.setData(values);
        _this4.searchData = values;

        _this4.reload();

        onAdvancedcancel();
      });
    },
    onAdvancedcancel: function onAdvancedcancel() {
      this.advancedVisible = false;
    },
    // 显示表头设置窗口
    showSetColumns: function showSetColumns() {
      // const toolbar = this.$refs.headToolbar;
      this.$refs.setColumsModal.show();
    },
    // 设置表头
    setTableColumns: function setTableColumns(data) {
      var proxyColumns = this.proxyColumns,
          fetchColumns = this.fetchColumns;

      if (data) {
        this.backupColumns = _utils.default.clone(data);
        var configProps = proxyColumns && proxyColumns.props && _utils.default.isObject(proxyColumns.props) ? (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyColumns.props), proxyColumns.props) : _conf.default.proxyColumns.props;
        this.tableColumns = data.filter(function (p) {
          return p[configProps.show] !== false;
        });
      } else if (proxyColumns) {
        fetchColumns(proxyColumns);
      }
    },
    // 渲染ACheckbox编辑组件
    renderCheckbox: function renderCheckbox(scope) {
      var vm = new _vue.default();
      var h = vm.$createElement;
      var currentColumn = this.tableColumns[scope.columnIndex];
      return h("a-checkbox", {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, currentColumn.editRender.props), {}, {
          checked: scope.row[scope.column.property]
        }),
        on: {
          input: function input(val) {
            scope.row[scope.column.property] = val;

            if (currentColumn.editRender.on && currentColumn.editRender.on.change) {
              currentColumn.editRender.on.change(scope);
            }
          }
        }
      });
    },
    // 渲染ASwitch编辑组件
    renderSwitch: function renderSwitch(scope) {
      var vm = new _vue.default();
      var h = vm.$createElement;
      var currentColumn = this.tableColumns[scope.columnIndex];
      return h("a-switch", {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, currentColumn.editRender.props), {}, {
          checked: scope.row[scope.column.property]
        }),
        on: {
          change: function change(val) {
            scope.row[scope.column.property] = val;

            if (currentColumn.editRender.on && currentColumn.editRender.on.change) {
              currentColumn.editRender.on.change(scope);
            }
          }
        }
      });
    },
    // 渲染下拉面板显示组件
    renderPulldownTableView: function renderPulldownTableView(scope) {
      var vm = new _vue.default();
      var h = vm.$createElement;
      var value = scope.row[scope.column.property];
      var currentColumn = this.tableColumns[scope.columnIndex];
      var taxtField = currentColumn.editRender.props && currentColumn.editRender.props.textField ? currentColumn.editRender.props.textField : "name";
      var text = "";

      if (value && _utils.default.isArray(value)) {
        text = value.map(function (p) {
          return p[taxtField];
        }).join(",");
      } else if (value && _utils.default.isObject(value)) {
        text = value[taxtField];
      } else if (value) {
        text = value;
      }

      return h("div", {}, [text]);
    },
    // 渲染下拉面板组件
    renderPulldownTable: function renderPulldownTable(scope) {
      // const { handlePulldownTableChange } = this;
      var vm = new _vue.default();
      var h = vm.$createElement;
      var currentColumn = this.tableColumns[scope.columnIndex];
      return h("pulldownTable", {
        props: (0, _objectSpread2.default)({}, currentColumn.editRender.props),
        on: {
          change: function change(val) {
            scope.row[scope.column.property] = val;

            if (currentColumn.editRender.on && currentColumn.editRender.on.change) {
              currentColumn.editRender.on.change(scope);
            }
          }
        }
      });
    },
    // api获取表头
    fetchColumns: function fetchColumns(opt) {
      var _this5 = this;

      var columns = this.columns;

      if (opt.ajax && opt.ajax.query) {
        opt.ajax.query().then(function (res) {
          var configProps = opt.props && _utils.default.isObject(opt.props) ? (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.proxyColumns.props), opt.props) : _conf.default.proxyColumns.props;

          var data = _utils.default.getObjData(configProps.list, res);

          var tableColumns = handleColumnsData(data, columns, configProps);
          _this5.backupColumns = _utils.default.clone(tableColumns);
          _this5.tableColumns = tableColumns.filter(function (p) {
            return p[configProps.show] !== false;
          });
        });
      }
    },
    // 工具条按钮点击
    onToobarButtonClick: function onToobarButtonClick(code) {
      this.$emit("toobarButtonClick", code);
    },
    // 设置搜索表单的值
    setSearchData: function setSearchData(values) {
      var headSearchForm = this.$refs.headSearchForm;

      if (headSearchForm && headSearchForm.setData) {
        headSearchForm.setData(values);
      }

      var headToolbarSearch = this.$refs.headSearch;

      if (headToolbarSearch && headToolbarSearch.setData) {
        headToolbarSearch.setData(values);
      }

      this.searchData = values;
    },
    // 获取搜索表单的值
    getSearchData: function getSearchData() {
      return this.searchData;
    },
    // 允许反选高亮行时接管，高亮行选中事件
    onCurrentRowChange: function onCurrentRowChange(e) {
      var that = this;
      setTimeout(function () {
        that.currentRow = e.row;
      }, 10);
      this.$emit("current-change", e);
    },
    // 允许反选高亮行时接管，单元格点击事件
    onCurrentRowCellClick: function onCurrentRowCellClick(e) {
      if (this.currentRow._XID && e.row._XID === this.currentRow._XID) {
        this.$refs.dataGrid.clearCurrentRow();
        this.currentRow = {};
        this.$emit("current-change", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, e), {}, {
          row: null
        }));
      }

      this.$emit("cell-click", e);
    }
  }),
  render: function render(h) {
    var tableProps = this.tableProps,
        headToolbar = this.headToolbar,
        setcolumnsConfig = this.setcolumnsConfig,
        height = this.height,
        searchConfig = this.searchConfig;
    var nodes = [];

    if (headToolbar && headToolbar.tools && headToolbar.tools.setColumns || setcolumnsConfig) {
      nodes.push(renderColumnsModal(h, this));
    }

    var tableHeight = "";

    if (height && _utils.default.isString(height) && height.indexOf("calc") > -1) {
      tableHeight = height;
    } // // 渲染头部搜索表单


    var headSearchForm = "";

    if (searchConfig) {
      // 头部搜索
      headSearchForm = renderHeadSearch(searchConfig, h, this);
    }

    return h("div", {
      class: "data-table"
    }, [headSearchForm, renderHeadToolbar(h, this), h("div", {
      style: {
        height: tableHeight
      }
    }, [h("vxe-grid", (0, _objectSpread2.default)({}, tableProps))])].concat(nodes));
  }
};
exports.default = _default2;