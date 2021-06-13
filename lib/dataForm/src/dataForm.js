"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.find-index");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/asyncToGenerator"));

var _utils = _interopRequireDefault(require("../../utils"));

var _index = _interopRequireDefault(require("./index"));

var _conf = _interopRequireDefault(require("../conf"));

var _enquire = _interopRequireDefault(require("enquire.js"));

var _actionModal = _interopRequireDefault(require("./actionModal"));

// import { Button } from "ant-design-vue";
var optionsComponents = ["a-radio-group", "a-checkbox-group", "a-cascader"]; // 回车跳转下一个focus

function nextItemFocus(item, _vm) {
  var e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var enterToNextItemFocusList = _vm.enterToNextItemFocusList,
      setFieldFocus = _vm.setFieldFocus;

  if (item.itemRender && item.itemRender.on && item.itemRender.on.enter) {
    var enterRes = item.itemRender.on.enter(e);

    if (enterRes == false) {
      return;
    }
  }

  var fieldIndex = enterToNextItemFocusList.indexOf(item.field);

  if (fieldIndex > -1 && fieldIndex < enterToNextItemFocusList.length - 1) {
    var nextField = enterToNextItemFocusList[fieldIndex + 1];
    setFieldFocus(nextField);
  }
} // 处理统一请求可选数据的请求


function handeUnifyApiGetOptions(unifyList, optionsApiList, _vm) {
  var formData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var callback = arguments.length > 4 ? arguments[4] : undefined;
  var getSelectOptions = _vm.getSelectOptions; // 处理同一请求参数

  var json = {};
  var fields = [];
  unifyList.map(function (item) {
    var _item$itemRender$prop = item.itemRender.props,
        param = _item$itemRender$prop.param,
        autoLoadOptionsId = _item$itemRender$prop.autoLoadOptionsId;
    fields.push({
      field: item.field,
      param: param
    });

    for (var key in param) {
      if (json[key] && _utils.default.isArray(json[key])) {
        json[key].push(param[key]);
      } else if (json[key] && !_utils.default.isArray(json[key])) {
        json[key] = [json[key], param[key]];
      } else {
        json[key] = param[key];
      }
    } // 添加表单字段参数


    if (formData && formData[item.field] && _conf.default.getSelectOptions && _conf.default.getSelectOptions.loadOptionsIdField && autoLoadOptionsId !== false) {
      json[_conf.default.getSelectOptions.loadOptionsIdField] = formData[item.field];
    }
  });
  var unifyApi = getSelectOptions && getSelectOptions.api ? getSelectOptions.api : _conf.default.getSelectOptions.api;

  if (unifyApi) {
    optionsApiList.push({
      api: unifyApi,
      param: json,
      fields: fields
    });
  }

  fetchItemPropsOptionsApiList(optionsApiList, _vm, formData, callback);
} // 请求表单项可选数据


var fetchItemPropsOptionsApiList = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(list, _vm, formData, callback) {
    var setFieldsOptions, onOptionsAllLoad, onOptionsLoadBefore, autoSetDefaultValue, setFieldsOptionsDefaultValues, beforeRes, promises;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            setFieldsOptions = _vm.setFieldsOptions, onOptionsAllLoad = _vm.onOptionsAllLoad, onOptionsLoadBefore = _vm.onOptionsLoadBefore, autoSetDefaultValue = _vm.autoSetDefaultValue, setFieldsOptionsDefaultValues = _vm.setFieldsOptionsDefaultValues;

            if (!onOptionsLoadBefore) {
              _context.next = 8;
              break;
            }

            beforeRes = onOptionsLoadBefore(list);

            if (!(beforeRes === false)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", false);

          case 7:
            if (beforeRes) {
              list = beforeRes;
            }

          case 8:
            promises = list.map(function (item) {
              var api = item.api,
                  param = item.param; // 添加表单字段参数

              if (item.field && formData && formData[item.field] && _conf.default.getSelectOptions && _conf.default.getSelectOptions.loadOptionsIdField && (item.props && item.props.autoLoadOptionsId !== false || !item.props)) {
                param[_conf.default.getSelectOptions.loadOptionsIdField] = formData[item.field];
              }

              return api(param);
            });
            Promise.all(promises).then(function (res) {
              var json = {};
              list.forEach(function (item, index) {
                var field = item.field,
                    fields = item.fields;
                var itemData = res[index];

                if (fields && fields.length) {
                  // 统一请求可选数据 赋值到指定字段的处理
                  fields.forEach(function (element) {
                    var optionsData = handlefieldOptionsDataField(element.field, itemData, _vm);
                    json[element.field] = optionsData;
                  });
                } else {
                  // 字段单独配置api的可选数据的处理
                  var optionsData = handlefieldOptionsDataField(field, itemData, _vm);
                  json[field] = optionsData; // json[field] = itemData;
                }
              });
              setFieldsOptions(json);

              if (onOptionsAllLoad) {
                var onLoadRes = onOptionsAllLoad(json);

                if (onLoadRes) {
                  json = onLoadRes;
                }
              }

              if (autoSetDefaultValue) {
                setFieldsOptionsDefaultValues();
              }

              callback && callback();
            }).catch(function () {});

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchItemPropsOptionsApiList(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

function handlefieldOptionsDataField(field, json, _vm) {
  var itemsOptions = _vm.itemsOptions;
  var fieldItem = itemsOptions.find(function (p) {
    return p.field === field;
  });
  var optionData = json;

  if (fieldItem && fieldItem.itemRender && fieldItem.itemRender.props) {
    var itemProps = fieldItem.itemRender.props;
    var df = itemProps.dataField != undefined ? itemProps.dataField : _conf.default.getSelectOptions.dataField;
    optionData = _utils.default.getObjData(df, json);
  }

  return optionData;
} // 渲染标题


function renderItemTitle(item, h, _vm) {
  var titleColon = _vm.titleColon,
      titleWidth = _vm.titleWidth,
      titleAlign = _vm.titleAlign; //是否必填

  var isRequired = false;

  if (item.option && item.option.rules && item.option.rules.length) {
    for (var i = 0; i < item.option.rules.length; i++) {
      var rulesItem = item.option.rules[i];

      if (rulesItem.required) {
        isRequired = true;
        break;
      }
    }
  } //标题内容


  var titleText = "";

  if (typeof item.title === "function") {
    titleText = [item.title()];
  } else {
    titleText = item.title;
  }

  var titleWidthStr = item.titleWidth || item.titleWidth === 0 ? item.titleWidth : titleWidth;

  if (_utils.default.isNumber(titleWidthStr)) {
    titleWidthStr = "".concat(titleWidthStr, "px");
  } // tooltip


  var tooltip = "";

  if (item.tooltip) {
    tooltip = h("a-tooltip", {
      props: {
        title: item.tooltip
      },
      style: {
        marginLeft: "5px"
      }
    }, [h("a-icon", {
      props: {
        type: "question-circle"
      },
      style: {
        color: "#999"
      }
    })]);
  }

  return h("div", {
    class: ["data-form-item-title", titleAlign, {
      colon: item.colon === false ? item.colon : titleColon
    }, {
      required: isRequired
    }],
    style: {
      width: titleWidthStr
    }
  }, [titleText, tooltip]);
} // 渲染input表单项


function renderItemInput(item, h, _vm) {
  var $slots = _vm.$slots,
      $scopedSlots = _vm.$scopedSlots,
      readonly = _vm.readonly,
      onButtonClick = _vm.onButtonClick,
      items = _vm.items;
  var vDecorator = [item.field];

  if (item.option) {
    vDecorator.push(item.option);
  }

  var props = (0, _objectSpread2.default)((0, _objectSpread2.default)({
    props: {
      fieldName: item.field
    }
  }, item.itemRender), {}, {
    ref: "input_" + item.field,
    directives: [{
      name: "decorator",
      value: vDecorator
    }]
  }); // 只读

  if (readonly || item.itemRender && item.itemRender.props && item.itemRender.props.readonly) {
    if (props.class) {
      if (_utils.default.isArray(props.class)) {
        props.class.push("input_readonly");
      } else if (_utils.default.isString(props.class)) {
        props.class = "".concat(props.class, " input_readonly");
      }
    } else {
      props.class = ["input_readonly"];
    }

    if (props.props) {
      props.props.disabled = true;
      props.props.placeholder = null;
    } else {
      props.props = {
        disabled: true,
        placeholder: ""
      };
    }
  } else {
    var find = items.find(function (p) {
      return p.field === item.field;
    });

    if (find && find.itemRender && find.itemRender.props && find.itemRender.props.disabled) {
      props.props.disabled = find.itemRender.props.disabled;
    } else {
      props.props.disabled = false;
    } // TODO 切换只读的处理
    // if (props.props && props.props.disabled !==true) {
    //   props.props.disabled=false;
    // }

  }

  var inputDom = "";

  if (item.itemRender && item.itemRender.slot) {
    // 插槽
    if ($slots[item.itemRender.slot]) {
      inputDom = $slots[item.itemRender.slot];
    } else if ($scopedSlots[item.itemRender.slot]) {
      props.scopedSlots = {
        default: $scopedSlots[item.itemRender.slot]
      }, inputDom = h("a-scopedSlots", props);
    }
  } else if (item.itemRender && item.itemRender.customRender) {
    // 自定义渲染内容
    if (item.itemRender && item.itemRender.props) {
      props.props["customRender"] = item.itemRender.customRender;
    } else {
      props.props = {
        customRender: item.itemRender.customRender
      };
    }

    inputDom = h("a-customRender", props);
  } else {
    // 根据name渲染组件
    var renderName = item.itemRender && item.itemRender.name && item.itemRender.name !== "hidden" ? "".concat(item.itemRender.name) : "a-input";

    if (renderName.indexOf("a-") > -1) {
      var configKey = "";
      configKey = renderName.split("a-")[1];
      configKey = _utils.default.lineToUpperCase(configKey, "-");
      var configProps = _conf.default.defaultProps[configKey] ? _conf.default.defaultProps[configKey] : {};
      props.props = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, configProps), props.props);
    }

    if (renderName === "buttons") {
      if (props.props) {
        props.props.itemClick = onButtonClick;
      } else {
        props.props = {
          itemClick: onButtonClick
        };
      }

      props.props.items = item.itemRender.items;
    } else if (renderName == "a-select") {
      // 有可选数据的组件
      renderName = "opu-select";
    } else if (renderName === "a-date-picker") {
      renderName = "opu-date-picker";

      if (props.on && _utils.default.isObject(props.on)) {
        props.on.inputPressEnter = function (e) {
          nextItemFocus(item, _vm, e);
        };
      } else {
        props.on = {
          inputPressEnter: function inputPressEnter(e) {
            nextItemFocus(item, _vm, e);
          }
        };
      }
    } else if (renderName === "a-time-picker") {
      renderName = "opu-time-picker";

      if (props.on && _utils.default.isObject(props.on)) {
        props.on.inputPressEnter = function (e) {
          nextItemFocus(item, _vm, e);
        };
      } else {
        props.on = {
          inputPressEnter: function inputPressEnter(e) {
            nextItemFocus(item, _vm, e);
          }
        };
      }
    } else if (renderName === "a-range-picker-split") {
      if (props.on && _utils.default.isObject(props.on)) {
        props.on.inputPressEnter = function (e) {
          nextItemFocus(item, _vm, e);
        };
      } else {
        props.on = {
          inputPressEnter: function inputPressEnter(e) {
            nextItemFocus(item, _vm, e);
          }
        };
      }
    } else if (renderName === "a-input-number-split") {
      if (props.on && _utils.default.isObject(props.on)) {
        props.on.inputPressEnter = function (e) {
          nextItemFocus(item, _vm, e);
        };
      } else {
        props.on = {
          inputPressEnter: function inputPressEnter(e) {
            nextItemFocus(item, _vm, e);
          }
        };
      }
    } else if (renderName === "a-switch") {
      renderName = "opu-switch";
    } else if (renderName === "a-checkbox") {
      renderName = "opu-checkbox";
    } else if (renderName === "a-tree-select") {
      renderName = "opu-tree-select";
    } else if (renderName === "a-select-group") {
      renderName = "opu-select-group";
    } else if (optionsComponents.includes(renderName)) {
      // 有可选数据的组件
      props.props.componentPropsData = props.props;
      props.props.renderName = renderName;
      renderName = "options-component";
    }

    inputDom = h(renderName, props);
  }

  return inputDom;
} // 渲染每个表单项内容


function renderItemContent(item, h, _vm) {
  var titleWidth = _vm.titleWidth,
      $scopedSlots = _vm.$scopedSlots;
  var before = item.itemRender && item.itemRender.before ? item.itemRender.before() : "";
  var after = item.itemRender && item.itemRender.after ? item.itemRender.after() : "";

  if (item.actions && item.actions.length && !(item.itemRender && item.itemRender.props && item.itemRender.props.disabled)) {
    after = item.actions.map(function (p) {
      var actionButton = "";

      if (_utils.default.isFunction(p.button)) {
        actionButton = p.button();
      } else {
        var buttonProps = p.button && p.button.props ? _utils.default.clone(p.button.props) : {};
        var buttonContent = buttonProps.content ? buttonProps.content : "";
        var buttonOn = {
          click: function click(e) {
            if (p.button && p.button.on && p.button.on.click) {
              var onClickRes = p.button.on.click(e);

              if (onClickRes === false) {
                return false;
              }
            }

            if (p.modal) {
              var modalProps = p.modal && p.modal.props ? p.modal.props : {};
              (0, _actionModal.default)({
                modalProps: (0, _objectSpread2.default)({}, modalProps),
                content: p.modal.content,
                form: p.modal.form,
                slots: $scopedSlots
              });
            }
          }
        };
        actionButton = h("a-button", (0, _objectSpread2.default)({}, {
          props: (0, _objectSpread2.default)({}, buttonProps),
          on: (0, _objectSpread2.default)({}, buttonOn),
          style: (0, _objectSpread2.default)({}, p.button.style)
        }), [buttonContent]);
      }

      return actionButton;
    });
  }

  return h("div", {
    style: {
      width: titleWidth
    },
    class: "data-form-item-content"
  }, [h("div", {
    class: "data-form-item-before"
  }, [before]), h("div", {
    class: "data-form-item-input"
  }, [renderItemInput(item, h, _vm)]), h("div", {
    class: "data-form-item-after"
  }, [after])]);
} // 渲染items


function renderItems(h, _vm) {
  var itemsOptions = _vm.itemsOptions,
      $slots = _vm.$slots,
      layout = _vm.layout,
      currentColspan = _vm.currentColspan,
      $scopedSlots = _vm.$scopedSlots,
      focusItemTypes = _vm.focusItemTypes,
      currentScreen = _vm.currentScreen;
  return itemsOptions ? itemsOptions.map(function (item) {
    var formItemProps = {
      key: item.field,
      props: item,
      style: item.style ? item.style : {},
      class: item.class,
      scopedSlots: {}
    };
    var formItemContent = "";

    if (item.slot && $slots[item.slot]) {
      // 插槽
      formItemContent = $slots[item.slot];
    } else if (item.slot && $scopedSlots[item.slot]) {
      // 作用域插槽
      var vDecorator = [item.field];

      if (item.option) {
        vDecorator.push(item.option);
      }

      formItemContent = h("a-scopedSlots", {
        props: {
          fieldName: item.field
        },
        scopedSlots: {
          default: $scopedSlots[item.slot]
        },
        directives: [{
          name: "decorator",
          value: vDecorator
        }]
      });
    } else if (item.itemRender && item.itemRender.name === "hidden") {
      formItemContent = [renderItemContent(item, h, _vm)];
      formItemProps.style["display"] = "none";
    } else {
      formItemProps.scopedSlots.label = function () {
        return renderItemTitle(item, h, _vm);
      };

      formItemContent = [renderItemContent(item, h, _vm)];
    }

    if (layout === "grid") {
      // grid模式下每个单元格所占格
      if (item.colspan) {
        var itemColspan = "";

        if (_utils.default.isObject(item.colspan)) {
          itemColspan = item.colspan[currentScreen];
        } else {
          itemColspan = item.colspan;
        } // that.currentScreen


        formItemProps.style["gridColumn"] = "span " + itemColspan;
      }

      if (item.rowspan && item.rowspan > 1) {
        formItemProps.style["gridRow"] = "span " + item.rowspan;
      }
    } else if (layout === "flex") {
      // 当flex模式下的宽度
      var colWidth = 100 / currentColspan;

      if (item.width) {
        formItemProps.style["width"] = item.width;
      } else if (item.colspan && item.colspan > 1) {
        formItemProps.style["width"] = "".concat(colWidth * item.colspan, "%");
      } else {
        formItemProps.style["width"] = "".concat(colWidth, "%");
      }
    }

    var wrapperProps = {
      class: ["data-form-item-wrapper", item.align],
      on: {}
    };

    if ((item.itemRender && focusItemTypes.includes(item.itemRender.name) || !(item.itemRender && item.itemRender.name)) && !(item.itemRender && item.itemRender.name == "a-input-number-split")) {
      wrapperProps.on.keyup = function (e) {
        var keyCode = e.keyCode;
        e.stopPropagation();

        if (keyCode === 13) {
          nextItemFocus(item, _vm, e);
        }
      };
    }

    return h("a-form-item", formItemProps, [h("div", wrapperProps, [formItemContent])]);
  }) : [];
} // 渲染提交等操作按钮


function renderActionButtons(h, _vm) {
  var $listeners = _vm.$listeners,
      submitButtonProps = _vm.submitButtonProps,
      cancelButtonProps = _vm.cancelButtonProps,
      foldingButtonProps = _vm.foldingButtonProps,
      loading = _vm.loading,
      onSubmit = _vm.onSubmit,
      resetFields = _vm.resetFields,
      titleWidth = _vm.titleWidth,
      layout = _vm.layout,
      expand = _vm.expand,
      onExpandClick = _vm.onExpandClick,
      items = _vm.items,
      currentColspan = _vm.currentColspan;

  if ($listeners && $listeners.submit && submitButtonProps !== false) {
    // 添加提交按钮
    var submitText = submitButtonProps && submitButtonProps.content ? submitButtonProps.content : _conf.default.submitButtonProps.content;
    var cancelText = cancelButtonProps && cancelButtonProps.content ? cancelButtonProps.content : _conf.default.cancelButtonProps.content;
    var submitButton = h("a-button", {
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.submitButtonProps), submitButtonProps), {}, {
        loading: loading
      }),
      on: {
        click: onSubmit
      }
    }, [submitText]);
    var cancelButton = "";

    if (cancelButtonProps !== false) {
      cancelButton = h("a-button", {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.cancelButtonProps), cancelButtonProps),
        on: {
          click: function click() {
            resetFields();
          }
        }
      }, [cancelText]);
    } // 渲染展开/收起按钮


    var hasFolding = items.findIndex(function (p) {
      return p.folding;
    }) > -1;
    var foldingButton = "";

    if (hasFolding && foldingButtonProps !== false) {
      var openText = foldingButtonProps && foldingButtonProps.openText ? foldingButtonProps.openText : _conf.default.foldingButtonProps.openText;
      var hideText = foldingButtonProps && foldingButtonProps.hideText ? foldingButtonProps.hideText : _conf.default.foldingButtonProps.hideText;
      var openIcon = foldingButtonProps && foldingButtonProps.openIcon ? foldingButtonProps.openIcon : _conf.default.foldingButtonProps.openIcon;
      var hideIcon = foldingButtonProps && foldingButtonProps.hideIcon ? foldingButtonProps.hideIcon : _conf.default.foldingButtonProps.hideIcon;
      var foldingText = expand ? hideText : openText;
      var foldingIcon = expand ? hideIcon : openIcon;
      foldingButton = h("a-button", {
        props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.foldingButtonProps), foldingButtonProps),
        on: {
          click: onExpandClick
        }
      }, [foldingText, h("a-icon", {
        props: {
          type: foldingIcon
        }
      })]);
    }

    var titleWidthStr = 0;
    var buttonStyle = {};

    if (layout != "inline") {
      if (_utils.default.isNumber(titleWidth)) {
        titleWidthStr = "".concat(titleWidth, "px");
      } else {
        titleWidthStr = titleWidth;
      }
    }

    if (layout === "grid" && currentColspan && currentColspan > 1) {
      buttonStyle["gridColumn"] = "span " + currentColspan;
    } else if (layout === "flex") {
      buttonStyle["width"] = "100%";
    }

    return h("div", {
      class: "data-form-buttons",
      style: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, buttonStyle), {}, {
        marginLeft: titleWidthStr
      })
    }, [submitButton, cancelButton, foldingButton]);
  }
} // 响应式


var responsiveMap = {
  xs: "(max-width: 575px)",
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1600px)"
};
var _default2 = {
  name: "DataForm",
  components: (0, _objectSpread2.default)({}, _index.default),
  props: {
    // 表单内容
    items: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    // 布局，'horizontal'|'vertical'|'inline'|'grid'|'flex'
    layout: {
      type: String,
      default: _conf.default.layout
    },
    // grid、flex布局时的列数
    colspan: {
      type: [Number, Object],
      default: _conf.default.colspan
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 所有项的标题对齐方式
    titleAlign: {
      type: String,
      default: _conf.default.titleAlign
    },
    // 所有项的标题宽度
    titleWidth: {
      type: [String, Number],
      default: _conf.default.titleWidth
    },
    // 是否显示标题冒号
    titleColon: {
      type: Boolean,
      default: _conf.default.titleColon
    },
    // 可选数据全部请求完后回调
    onOptionsAllLoad: {
      type: Function,
      default: function _default() {}
    },
    // 可选数据请求前回调
    onOptionsLoadBefore: {
      type: Function,
      default: function _default() {}
    },
    // 获取数据时是否清除空值字段值
    filterNullValues: {
      type: [Boolean, String],
      default: ""
    },
    getSelectOptions: Object,
    submitButtonProps: {
      type: [Boolean, Object],
      default: function _default() {}
    },
    cancelButtonProps: {
      type: [Boolean, Object],
      default: function _default() {}
    },
    foldingButtonProps: {
      type: [Boolean, Object],
      default: function _default() {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 自动获得焦点，string时为指定获得焦点的字段
    autoFocus: {
      type: [Boolean, String],
      default: false
    },
    autoLoadOptionsData: {
      type: [Boolean, String],
      default: ""
    },
    isPartRequest: {
      type: [Boolean, String],
      default: ""
    },
    autoSetDefaultValue: {
      type: [Boolean, String],
      default: ""
    }
  },
  data: function data() {
    return {
      form: this.$form.createForm(this),
      itemsOptions: [],
      expand: false,
      //折叠展开
      currentColspan: 1,
      // 支持回车活动焦点的组件
      focusItemTypes: ["a-input", "a-password", "a-input-number", "a-select", "a-date-picker", "a-time-picker", "a-month-picker", "a-week-picker", "a-range-picker", "a-cascader", "a-tree-select", "a-textarea", "a-range-picker-split", "a-input-number-split", "a-select-group"],
      unifyApiGetOptions: [],
      getItemPropsOptionsApiList: [],
      config: _conf.default,
      currentScreen: "xl"
    };
  },
  computed: {
    // 回车跳转下一个表单项获得焦点的字段列表
    enterToNextItemFocusList: function enterToNextItemFocusList() {
      var _this = this;

      return this.items.map(function (item) {
        if (item.itemRender && item.itemRender.props && item.itemRender.props.disabled) {
          return "";
        } else if (item.itemRender && _this.focusItemTypes.includes(item.itemRender.name) && (!(item.itemRender.props && (item.itemRender.props.disabled == true || item.itemRender.props.readonly == true)) || !item.itemRender.props)) {
          // 可获得焦点的组件
          return item.field;
        } else if (!(item.itemRender && (item.itemRender.name && item.itemRender.name == "hidden" || item.itemRender.slot || item.itemRender.customRender))) {
          // 可获得焦点的组件
          return item.field;
        }

        return "";
      }).filter(function (p) {
        return p !== "";
      });
    }
  },
  watch: {
    items: function items(_items) {
      this.cloneItems(_items);
    },
    colspan: function colspan(val) {
      this.currentColspan = val;
    }
  },
  created: function created() {
    this.currentColspan = this.colspan; // for (const key in config) {
    //   this[key] = config[key];
    // }

    this.cloneItems(this.items);
  },
  mounted: function mounted() {
    var _this2 = this;

    var that = this; // 响应式布局

    if (_utils.default.isObject(this.colspan)) {
      this.$nextTick(function () {
        var keys = Object.keys(responsiveMap);
        keys.map(function (screen) {
          return _enquire.default.register(responsiveMap[screen], {
            match: function match() {
              that.currentScreen = screen;
              that.currentColspan = that.colspan[screen];
            },
            unmatch: function unmatch() {
              var keyIndex = keys.findIndex(function (p) {
                return p === screen;
              });

              if (keyIndex > 0) {
                var newKeyIndex = keyIndex - 1;
                that.currentScreen = keys[newKeyIndex];
                that.currentColspan = that.colspan[keys[newKeyIndex]];
              }
            },
            // Keep a empty destory to avoid triggering unmatch when unregister
            destroy: function destroy() {}
          });
        });
      });
    }

    if (this.autoFocus && this.enterToNextItemFocusList.length) {
      this.$nextTick(function () {
        setTimeout(function () {
          if (typeof _this2.autoFocus === "string") {
            _this2.setFieldFocus(_this2.autoFocus);
          } else {
            _this2.setFieldFocus(_this2.enterToNextItemFocusList[0]);
          }
        }, 400);
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    Object.keys(responsiveMap).map(function (screen) {
      return _enquire.default.unregister(responsiveMap[screen]);
    });
  },
  methods: {
    cloneItems: function cloneItems(items) {
      var _this3 = this;

      var expand = this.expand,
          autoLoadOptionsData = this.autoLoadOptionsData,
          isPartRequest = this.isPartRequest;

      var clone = _utils.default.clone(items, true);

      var getItemPropsOptionsApiList = [];
      var unifyApiGetOptions = [];
      var cloneData = [];
      var isAutoLoadOptionsData = (autoLoadOptionsData === true || autoLoadOptionsData === false) && autoLoadOptionsData !== _conf.default.getSelectOptions.autoLoadOptionsData ? autoLoadOptionsData : _conf.default.getSelectOptions.autoLoadOptionsData;

      if (!expand) {
        cloneData = clone.filter(function (p) {
          return !p.folding;
        });
      } else {
        cloneData = clone;
      }

      var isFormPartRequest = isPartRequest !== "" ? isPartRequest : _conf.default.getSelectOptions.isPartRequest;
      var data = cloneData.map(function (item) {
        var oldItem = _this3.itemsOptions.find(function (p) {
          return p.field === item.field;
        });

        if (oldItem && oldItem.itemRender && oldItem.itemRender.props && item.itemRender && item.itemRender.props && oldItem.itemRender.props.api === item.itemRender.props.api && _utils.default.isEqual(oldItem.itemRender.props.param, item.itemRender.props.param) && isAutoLoadOptionsData) {
          return item;
        }

        if (item.itemRender && item.itemRender.props && (item.itemRender.props.api || item.itemRender.props.param && isFormPartRequest === true)) {
          if (!item.itemRender.props.api) {
            item.itemRender.props.api = _conf.default.getSelectOptions.api;
          }

          getItemPropsOptionsApiList.push({
            field: item.field,
            api: item.itemRender.props.api,
            param: item.itemRender.props.param,
            props: item.itemRender.props
          });
        } else if (item.itemRender && item.itemRender.props && item.itemRender.props.param && !item.itemRender.props.api && isFormPartRequest !== true) {
          unifyApiGetOptions.push(item);
        }

        return item;
      });
      this.unifyApiGetOptions = unifyApiGetOptions;
      this.getItemPropsOptionsApiList = getItemPropsOptionsApiList;

      if (isAutoLoadOptionsData) {
        this.loadOptionsData();
      }

      this.itemsOptions = data;
    },
    loadOptionsData: function loadOptionsData() {
      var formData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      var unifyApiGetOptions = this.unifyApiGetOptions,
          getItemPropsOptionsApiList = this.getItemPropsOptionsApiList;

      if (unifyApiGetOptions.length) {
        handeUnifyApiGetOptions(unifyApiGetOptions, getItemPropsOptionsApiList, this, formData, callback);
      } else if (getItemPropsOptionsApiList.length) {
        fetchItemPropsOptionsApiList(getItemPropsOptionsApiList, this, formData, callback);
      }
    },
    // 获取表单数据，不验证
    getData: function getData() {
      return this.form.getFieldsValue();
    },
    // 设置表单值
    setData: function setData(values) {
      var items = this.items; // 过滤掉formitems未定义的字段

      var formFields = items.map(function (item) {
        return item.field;
      });
      var formData = {};

      for (var key in values) {
        if (formFields.includes(key)) {
          formData[key] = values[key];
        }
      }

      this.form.setFieldsValue(formData);
    },
    // 校验并获取一组输入域的值
    validateFields: function validateFields(fields) {
      var _this4 = this;

      var filterNullValues = this.filterNullValues;
      return new Promise(function (resolve, reject) {
        _this4.form.validateFields(fields, function (err, values) {
          if (!err) {
            var json = (0, _objectSpread2.default)({}, values);
            var hasFilterNullValues = !filterNullValues && filterNullValues !== false ? _conf.default.filterNullValues : false;

            if (hasFilterNullValues) {
              for (var key in json) {
                if (!(json[key] || json[key] == 0)) {
                  delete json[key];
                }
              }
            }

            json = _this4.formatSubmitValues(json);
            resolve(json);
          } else {
            reject();
          }
        });
      });
    },
    // 格式化提交数据，上传对象转成url
    formatSubmitValues: function formatSubmitValues(values) {
      var items = this.items;
      items.forEach(function (item) {
        // 将上传组件的对象值转换成url字符串
        if (item.itemRender && item.itemRender.name === "upload" && values[item.field]) {
          var value = values[item.field];

          if (value.fileList && value.fileList.length) {
            var list = value.fileList.map(function (p) {
              if (p.url) {
                return p.url;
              } else if (p.response) {
                var responseUrlField = item.itemRender.props && item.itemRender.props.responseUrlField ? item.itemRender.props.responseUrlField : "data";

                var url = _utils.default.getObjData(responseUrlField, p.response);

                if (url) {
                  return url;
                }

                return p;
              } else if (p.status !== "done") {
                return "";
              }

              return p;
            }).filter(function (p) {
              return p !== "";
            });
            values[item.field] = list && list.length ? list : undefined;
          } else if (value.fileList && value.fileList.length === 0) {
            values[item.field] = undefined;
          }
        }
      });
      return values;
    },
    // 提交
    onSubmit: function onSubmit(e) {
      var _this5 = this;

      if (e) {
        e.preventDefault();
      } // this.loading = true;


      this.form.validateFields(function (err, values) {
        if (!err) {
          var json = (0, _objectSpread2.default)({}, values);
          json = _this5.formatSubmitValues(json);

          _this5.$emit("submit", json);
        }
      });
    },
    // 重置
    resetFields: function resetFields(fields) {
      this.form.resetFields(fields);
      this.$emit("reset", fields);
    },
    // 设置字段获得焦点
    setFieldFocus: function setFieldFocus(field) {
      var refName = "input_".concat(field);
      var item = this.$refs[refName];

      if (item && item.focus) {
        item.focus();
      }
    },
    // 设置一组字段的options数据
    setFieldsOptions: function setFieldsOptions(data) {
      var _this6 = this;

      var formData = this.getData();

      var _loop = function _loop(key) {
        var options = data[key];

        var item = _this6.itemsOptions.find(function (p) {
          return p.field === key;
        });

        if (item && item.itemRender && item.itemRender.props) {
          var itemProps = item.itemRender.props;
          var inputRef = "input_" + item.field;
          var input = _this6.$refs[inputRef];

          if (input && input.setOptionsData) {
            input.setOptionsData(options);
          }

          if (formData[key]) {
            var vF = itemProps.valueField != undefined ? itemProps.valueField : _conf.default.getSelectOptions.valueField;

            if (_utils.default.isArray(formData[key])) {
              // 数组的值
              var arrValue = [];

              for (var i = 0; i < options.length; i++) {
                var el = options[i];

                if (formData[key].includes(el[vF])) {
                  arrValue.push(el[vF]);
                }
              }

              formData[key] = arrValue;
            } else {
              var valueRow = options.find(function (p) {
                return p[vF] == formData[key];
              });

              if (!valueRow) {
                formData[key] = "";
              }
            }
          }
        }
      };

      for (var key in data) {
        _loop(key);
      } // 清除赋值字段的值


      this.setData(formData);
    },
    // 设置下拉框默认值，从下拉数据中获得默认选项,names = 指定要设置默认的字段，为空则设置全部
    setFieldsOptionsDefaultValues: function setFieldsOptionsDefaultValues() {
      var _this7 = this;

      var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var defaultData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var formData = {};
      this.itemsOptions.forEach(function (item) {
        if (item && item.itemRender && item.itemRender.props && (fields.length && fields.includes(item.field) || fields.length === 0)) {
          var defaultKey = item.itemRender.props.defaultField ? item.itemRender.props.defaultField : _conf.default.getSelectOptions.defaultField;
          var valueField = item.itemRender.props.valueField ? item.itemRender.props.valueField : _conf.default.getSelectOptions.valueField;
          var inputRef = "input_" + item.field;
          var input = _this7.$refs[inputRef];

          if (input && input.getOptionsData) {
            var options = input.getOptionsData();
            var defaultValue = options.map(function (p) {
              if (p[defaultKey]) {
                return p[valueField];
              }

              return "";
            }).filter(function (p) {
              return p !== "";
            });

            if (defaultValue.length) {
              var valueArrayTypes = ["a-checkbox-group", "a-radio-group", "a-select"];
              var value = defaultValue;
              var isSeletctMultiple = item.itemRender.name == "select" && item.itemRender.props && item.itemRender.props.mode == "multiple";

              if ((!valueArrayTypes.includes(item.itemRender.name) || !isSeletctMultiple) && _utils.default.isArray(defaultValue) && defaultValue.length === 1) {
                value = defaultValue[0];
              }

              formData[item.field] = value;
            }
          }
        }
      });
      var json = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, defaultData), formData);
      this.setData(json);
    },
    // 渲染的按钮点击事件
    onButtonClick: function onButtonClick(action, e) {
      var onSubmit = this.onSubmit,
          resetFields = this.resetFields;

      switch (action) {
        case "submit":
          onSubmit();
          break;

        case "reset":
          resetFields();
          break;

        default:
          break;
      }

      this.$emit("buttonActionClick", action, e);
    },
    // 获取某个输入控件的 Error
    getFieldError: function getFieldError(field) {
      return this.form.getFieldError(field);
    },
    // 获取一组输入控件的 Error ，如不传入参数，则获取全部组件的 Error
    getFieldsError: function getFieldsError(fields) {
      return this.form.getFieldsError(fields);
    },
    // 获取一个输入控件的值
    getFieldValue: function getFieldValue(field) {
      return this.form.getFieldValue(field);
    },
    // 判断是否任一输入控件经历过 getFieldDecorator 或 v-decorator 的值收集时机 options.trigger
    isFieldsTouched: function isFieldsTouched(fields) {
      return this.form.isFieldsTouched(fields);
    },
    // 判断一个输入控件是否经历过 getFieldDecorator 或 v-decorator 的值收集时机 options.trigger
    isFieldTouched: function isFieldTouched(fields) {
      return this.form.isFieldTouched(fields);
    },
    // 判断一个输入控件是否在校验状态
    isFieldValidating: function isFieldValidating(fields) {
      return this.form.isFieldValidating(fields);
    },
    // 设置一组输入控件的值与错误状态。
    setFields: function setFields(fields) {
      return this.form.setFields(fields);
    },
    // 展开、关闭折叠
    setExpand: function setExpand(flag) {
      this.expand = flag;
      this.cloneItems(this.items);
    },
    onExpandClick: function onExpandClick() {
      var expand = !this.expand;
      this.setExpand(expand);
    },
    // 加载表单项的下拉数据
    loadItemOptionsData: function loadItemOptionsData(field, params) {
      var _this8 = this;

      var formItem = this.itemsOptions.find(function (p) {
        return p.field === field;
      });

      if (formItem && formItem.itemRender && formItem.itemRender.props && (formItem.itemRender.props.api || formItem.itemRender.props.param)) {
        var api = "";

        if (formItem.itemRender.props.api) {
          api = formItem.itemRender.props.api;
        } else {
          api = _conf.default.getSelectOptions.api;
        }

        api((0, _objectSpread2.default)((0, _objectSpread2.default)({}, formItem.itemRender.props.param), params)).then(function (res) {
          var optionsData = handlefieldOptionsDataField(field, res, _this8);

          _this8.setFieldsOptions((0, _defineProperty2.default)({}, field, optionsData));
        });
      }
    }
  },
  render: function render(h) {
    var form = this.form,
        layout = this.layout,
        currentColspan = this.currentColspan,
        readonly = this.readonly,
        onSubmit = this.onSubmit; // ant design form的layout属性

    var antdLayouts = ["horizontal", "vertical", "inline"]; // form表单的参数

    var formProps = {
      props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, _conf.default.props), {}, {
        form: form,
        layout: antdLayouts.includes(layout) ? layout : null
      }),
      class: ["data-form", layout],
      style: {},
      on: {
        submit: onSubmit
      }
    };

    if (readonly) {
      formProps.class.push("readonly");
    }

    if (layout === "grid") {
      var formColnumStyle = "";

      for (var i = 0; i < currentColspan; i++) {
        formColnumStyle += " 1fr";
      }

      formProps.style["grid-template-columns"] = formColnumStyle;
    }

    return h("a-form", formProps, [renderItems(h, this), renderActionButtons(h, this)]);
  }
};
exports.default = _default2;