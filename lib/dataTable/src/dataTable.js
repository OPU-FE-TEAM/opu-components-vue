"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

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
      onButtonActionClick = _vm.onButtonActionClick;
  var items = searchConfig.items.filter(function (item) {
    return !item.folding;
  });
  var form = h('data-form', {
    ref: "headSearch",
    props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, searchConfig), {}, {
      items: items,
      onButtonActionClick: onButtonActionClick
    }),
    class: "head-search-form",
    on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, searchConfig.on), {}, {
      submit: onSearchSubmit
    })
  });
  return form;
} // 渲染高级查询窗口


function renderAdvancedSearch(searchConfig, h, _vm) {
  var onSearchSubmit = _vm.onSearchSubmit,
      advancedVisible = _vm.advancedVisible,
      onAdvancedcancel = _vm.onAdvancedcancel,
      onAdvancedSubmit = _vm.onAdvancedSubmit;
  var items = searchConfig.items.filter(function (item) {
    return item.folding !== false;
  });
  var formProps = searchConfig.advancedSearchForm && searchConfig.advancedSearchForm.props ? searchConfig.advancedSearchForm.props : {};
  var form = h('data-form', {
    ref: "advancedSearch",
    props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, formProps), {}, {
      items: items,
      layout: searchConfig.foldingLayout ? searchConfig.foldingLayout : "flex"
    }),
    class: 'advanced-search-form',
    on: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, searchConfig.on), {}, {
      submit: onSearchSubmit
    })
  });
  var modalProps = searchConfig.advancedSearchModal && searchConfig.advancedSearchModal.props ? searchConfig.advancedSearchModal.props : {};
  return h('a-modal', (0, _objectSpread2.default)((0, _objectSpread2.default)({}, searchConfig.advancedSearchModal), {}, {
    props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, modalProps), {}, {
      title: modalProps.title ? modalProps.title : "高级搜索",
      visible: advancedVisible
    }),
    on: {
      cancel: onAdvancedcancel,
      ok: onAdvancedSubmit
    },
    class: 'advanced-search-modal'
  }), [form]);
} // 渲染设置表头窗口


function renderColumnsModal(setColumns, h, _vm) {
  var reload = _vm.reload;

  if (!(setColumns.proxyConfig && setColumns.proxyConfig.get && setColumns.proxyConfig.get.api && setColumns.proxyConfig.submit && setColumns.proxyConfig.submit.api)) {
    throw new Error('Please Config proxyConfig the get and submit!');
  }

  return h("SetColums", {
    ref: "setColumsModal",
    props: {
      option: setColumns
    },
    on: {
      submit: reload
    }
  });
} // 渲染工具栏按钮


function renderButton(item, h, hasDropdown) {
  var name = item.name,
      icon = item.icon,
      disabled = item.disabled,
      code = item.code,
      on = item.on;
  var iconContent = "";

  if (icon) {
    iconContent = h('a-icon', {
      props: {
        type: icon
      }
    });
  } // 下拉按钮


  if (hasDropdown) {
    return h('a-menu-item', {
      key: code,
      props: {
        disabled: disabled
      },
      on: on
    }, [iconContent, name]);
  }

  return h('a-button', {
    key: code,
    props: {
      type: item.type,
      disabled: disabled
    },
    on: on
  }, [iconContent, name]);
} // 渲染工具栏按钮组


function renderButtons(buttons, h) {
  return buttons ? buttons.map(function (item) {
    if (Object.prototype.toString.call(item) === "[object Array]") {
      // 数组，渲染按钮组
      var buttonGroups = item.map(function (p) {
        return renderButton(p, h);
      });
      return h('a-button-group', {}, [buttonGroups]);
    } else if (item.dropdowns && item.dropdowns.length) {
      var _buttonGroups = item.dropdowns.map(function (p) {
        return renderButton(p, h, true);
      });

      var menus = h('a-menu', {
        slot: "overlay"
      }, [_buttonGroups]);
      return h('a-dropdown', {
        props: {
          disabled: item.disabled
        },
        scopedSlots: {
          overlay: function overlay() {
            return menus;
          }
        }
      }, [h('a-button', {}, [item.name, h('a-icon', {
        props: {
          type: 'down'
        }
      })])]);
    } else if (Object.prototype.toString.call(item) === "[object Object]") {
      // 对象，渲染单个按钮
      return renderButton(item, h);
    }
  }) : [];
} // 渲染头部工具栏


function renderHeadToolbar(h, _vm) {
  var headToolbar = _vm.headToolbar,
      $nextTick = _vm.$nextTick,
      $refs = _vm.$refs,
      showSetColumns = _vm.showSetColumns,
      setColumns = _vm.setColumns;

  if (!headToolbar) {
    return false;
  }

  var headToolbarProps = {
    ref: "headToolbar",
    props: {},
    class: 'head-toolbar',
    scopedSlots: {}
  }; // 渲染按钮

  if (headToolbar.buttons) {
    var buttons = renderButtons(headToolbar.buttons, h);

    headToolbarProps.scopedSlots.buttons = function () {
      return buttons;
    };
  }

  var advancedSearch = "";
  var headSearchTools = ""; // 渲染头部搜索表单

  if (headToolbar.searchConfig) {
    headSearchTools = renderHeadSearch(headToolbar.searchConfig, h, _vm);
    advancedSearch = renderAdvancedSearch(headToolbar.searchConfig, h, _vm);
  } // 渲染头部工具


  var setColumnsModal = "";

  if (headToolbar.tools) {
    headToolbarProps.props = (0, _objectSpread2.default)({}, headToolbar.tools); // 自定义的 setColumns 

    if (headToolbar.tools.setColumns) {
      var buttonProps = headToolbar.tools.setColumns.button && headToolbar.tools.setColumns.button.props ? headToolbar.tools.setColumns.button.props : {};
      var setColumnsBtn = h("a-button", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, headToolbar.tools.setColumns.button), {}, {
        props: (0, _objectSpread2.default)({
          circle: true,
          icon: "setting"
        }, buttonProps),
        class: "tool-btn-setcolumns",
        on: {
          click: showSetColumns
        }
      }));

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

      if (!setColumns) {
        setColumnsModal = renderColumnsModal(headToolbar.tools.setColumns, h, _vm);
      }
    }

    $nextTick(function () {
      $refs.dataGrid.connect($refs.headToolbar);
    });
  }

  if (!headToolbarProps.scopedSlots.tools && headSearchTools) {
    headToolbarProps.scopedSlots.tools = function () {
      return headSearchTools;
    };
  }

  return h("div", {
    class: "head-toolbar-box"
  }, [h('vxe-toolbar', headToolbarProps, []), advancedSearch, setColumnsModal]);
}

var _default = {
  name: 'DataTable',
  components: {
    DataForm: _dataForm.DataForm,
    SetColums: _setColums.default
  },
  props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _vxeTable.Table.props), {}, {
    columns: Array,
    pagerConfig: [Boolean, Object],
    proxyConfig: Object,
    toolbar: [Boolean, Object],
    formConfig: [Boolean, Object],
    zoomConfig: Object,
    searchConfig: Object,
    headToolbar: Object,
    setColumns: Object
  }),
  data: function data() {
    return {
      tableColumns: [],
      advancedVisible: false,
      searchData: {}
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
    tableProps: function tableProps() {
      var _this2 = this;

      var $listeners = this.$listeners,
          $scopedSlots = this.$scopedSlots,
          tableExtendProps = this.tableExtendProps,
          handleTableQuery = this.handleTableQuery,
          tableColumns = this.tableColumns,
          renderCheckbox = this.renderCheckbox;
      var propsData = this.$options.propsData;
      var props = Object.assign({}, tableExtendProps);
      var columns = tableColumns.map(function (item) {
        if (item.editRender && item.editRender.name && item.editRender.name === "ACheckbox") {
          item.slots = {
            default: "a_checkbox"
          };
          $scopedSlots['a_checkbox'] = renderCheckbox;
        }

        return item;
      });
      Object.assign(props, {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, propsData), {}, {
          columns: columns
        })
      });
      var ons = {};

      _utils.default.each($listeners, function (cb, type) {
        ons[type] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this2.$emit.apply(_this2, [type].concat(args));
        };
      });

      if (props.props.proxyConfig && props.props.proxyConfig.ajax && props.props.proxyConfig.ajax.query) {
        var query = props.props.proxyConfig.ajax.query;

        props.props.proxyConfig.ajax.query = function (arr) {
          var json = handleTableQuery(arr);

          if (json === false) {
            return false;
          } else if (json) {
            arr = json;
          }

          return query(arr);
        };
      }

      props.on = ons;
      props.ref = 'dataGrid';
      props.scopedSlots = $scopedSlots;
      return props;
    }
  },
  created: function created() {
    var columns = this.columns;

    if (columns && columns.length) {
      this.tableColumns = columns;
    }
  },
  mounted: function mounted() {},
  beforeDestroy: function beforeDestroy() {},
  destroyed: function destroyed() {},
  methods: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, methods), {}, {
    reload: function reload() {
      this.$refs.dataGrid.commitProxy('reload');
    },
    onSearchSubmit: function onSearchSubmit(values) {
      this.searchData = values;
      this.$refs.dataGrid.commitProxy('reload');
    },
    // 处理调用 proxyConfig.ajax 的query查询方法前处理请求参数
    handleTableQuery: function handleTableQuery(arr) {
      var pagerConfig = this.pagerConfig,
          searchData = this.searchData; // 头部搜索表单数据
      // let headSearchFormData = {}
      // if (headToolbar && headToolbar.searchConfig && headToolbar.searchConfig.items) {
      //   const headSearchForm = this.$refs.headSearch;
      //   headSearchFormData = headSearchForm.getData();
      // }
      // 分页参数

      var pageData = {};

      if (pagerConfig && arr.page) {
        var currentPageField = pagerConfig.props && pagerConfig.props.currentPage ? pagerConfig.props.currentPage : _conf.default.pagerConfig.props.currentPage;
        pageData[currentPageField] = arr.page.currentPage;
        var pageSizeField = pagerConfig.props && pagerConfig.props.pageSize ? pagerConfig.props.pageSize : _conf.default.pagerConfig.props.pageSize;
        pageData[pageSizeField] = arr.page.pageSize;
      }

      var json = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, searchData), pageData);
      return json;
    },
    onButtonActionClick: function onButtonActionClick(action) {
      var _this3 = this;

      var searchData = this.searchData;

      if (action === "advancedQuery") {
        // 显示高级查询
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
        headSearchForm.setData(values); // reload

        _this4.searchData = values;
        $refs.dataGrid.commitProxy('reload'); // cancel

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
    // 渲染ACheckbox编辑组件
    renderCheckbox: function renderCheckbox(scope) {
      var vm = new _vue.default();
      var h = vm.$createElement;
      return h("a-checkbox", {
        props: {
          checked: scope.row[scope.column.property]
        },
        on: {
          input: function input(val) {
            scope.row[scope.column.property] = val;
          }
        }
      });
    }
  }),
  render: function render(h) {
    var tableProps = this.tableProps,
        setColumns = this.setColumns; // tableProps.scopedSlots.toolbar = ()=>{
    //   return headSearch;
    // }
    // tableProps.props.columns= handleColumns(tableProps.props.columns,h)

    var nodes = [];

    if (setColumns) {
      nodes.push(renderColumnsModal(setColumns, h, this));
    }

    return h('div', {
      class: "data-table"
    }, [renderHeadToolbar(h, this), h('vxe-grid', tableProps)].concat(nodes));
  }
};
exports.default = _default;