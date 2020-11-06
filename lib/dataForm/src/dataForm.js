"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.function.name");

require("core-js/modules/es.number.constructor");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/asyncToGenerator"));

var _utils = _interopRequireDefault(require("../../utils"));

var _index = _interopRequireDefault(require("./index"));

var _conf = _interopRequireDefault(require("../conf"));

// let is = false;
var optionsComponents = ["a-select", "a-radio-group", "a-checkbox-group", "a-cascader", "a-tree-select"]; // 回车跳转下一个focus

function nextItemFocus(item, _vm) {
  var enterToNextItemFocusList = _vm.enterToNextItemFocusList,
      setFieldFocus = _vm.setFieldFocus;
  var fieldIndex = enterToNextItemFocusList.indexOf(item.field);

  if (fieldIndex > -1 && fieldIndex < enterToNextItemFocusList.length - 1) {
    var nextField = enterToNextItemFocusList[fieldIndex + 1];
    setFieldFocus(nextField);
  }
} // 处理统一请求可选数据的请求


function handeUnifyApiGetOptions(unifyList, optionsApiList, _vm) {
  var getSelectOptions = _vm.getSelectOptions; // 处理同一请求参数

  var json = {};
  var fields = [];
  unifyList.map(function (item) {
    var param = item.itemRender.props.param;
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

  fetchItemPropsOptionsApiList(optionsApiList, _vm);
} // 请求表单项可选数据


var fetchItemPropsOptionsApiList = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(list, _vm) {
    var setFieldsOptions, onOptionsAllLoad, onOptionsLoadBefore, beforeRes, promises;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            setFieldsOptions = _vm.setFieldsOptions, onOptionsAllLoad = _vm.onOptionsAllLoad, onOptionsLoadBefore = _vm.onOptionsLoadBefore;

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
                  param = item.param;
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

              if (onOptionsAllLoad) {
                var onLoadRes = onOptionsAllLoad(json);

                if (onLoadRes) {
                  json = onLoadRes;
                }
              }

              setFieldsOptions(json);
            }).catch(function () {});

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchItemPropsOptionsApiList(_x, _x2) {
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
  }, titleText);
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

    if (renderName === "buttons") {
      if (props.props) {
        props.props.itemClick = onButtonClick;
      } else {
        props.props = {
          itemClick: onButtonClick
        };
      }

      props.props.items = item.itemRender.items;
    } else if (optionsComponents.includes(renderName)) {
      // 有可选数据的组件
      props.props.renderName = renderName;
      renderName = "options-component";
    }

    inputDom = h(renderName, props);
  }

  return inputDom;
} // 渲染每个表单项内容


function renderItemContent(item, h, _vm) {
  var titleWidth = _vm.titleWidth;
  var before = item.itemRender.before ? item.itemRender.before() : "";
  var after = item.itemRender.after ? item.itemRender.after() : "";
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
      colspan = _vm.colspan,
      $scopedSlots = _vm.$scopedSlots,
      focusItemTypes = _vm.focusItemTypes;
  return itemsOptions ? itemsOptions.map(function (item) {
    var formItemProps = {
      key: item.field,
      props: item,
      style: {},
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
      if (item.colspan && item.colspan > 1) {
        formItemProps.style["gridColumn"] = "span " + item.colspan;
      }

      if (item.rowspan && item.rowspan > 1) {
        formItemProps.style["gridRow"] = "span " + item.rowspan;
      }
    } else if (layout === "flex") {
      // 当flex模式下的宽度
      var colWidth = 100 / colspan;

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

    if (item.itemRender && focusItemTypes.includes(item.itemRender.name) && item.itemRender.name !== "textarea") {
      wrapperProps.on.keydown = function (e) {
        var keyCode = e.keyCode;

        if (keyCode === 13) {
          e.preventDefault();
          nextItemFocus(item, _vm);
        }
      };
    }

    return h("a-form-item", formItemProps, [h("div", wrapperProps, [formItemContent])]);
  }) : [];
}

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
      type: Number,
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
    getSelectOptions: Object
  },
  data: function data() {
    return {
      form: this.$form.createForm(this),
      itemsOptions: [],
      // 支持回车活动焦点的组件
      focusItemTypes: ["input", "password", "number", "select", "datePicker", "monthPicker", "weekPicker", "rangePicker", "cascader", "treeSelect", "textarea"]
    };
  },
  computed: {
    // 回车跳转下一个表单项获得焦点的字段列表
    enterToNextItemFocusList: function enterToNextItemFocusList() {
      var _this = this;

      return this.items.map(function (item) {
        if (item.itemRender && _this.focusItemTypes.includes(item.itemRender.name) && (item.itemRender.props && item.itemRender.props.disabled !== true || !item.itemRender.props)) {
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
    }
  },
  created: function created() {
    this.cloneItems(this.items);
  },
  methods: {
    cloneItems: function cloneItems(items) {
      var _this2 = this;

      var clone = _utils.default.clone(items, true);

      var getItemPropsOptionsApiList = [];
      var unifyApiGetOptions = []; // 处理可选数据

      var data = clone.map(function (item) {
        var oldItem = _this2.itemsOptions.find(function (p) {
          return p.field === item.field;
        });

        if (oldItem && oldItem.itemRender && oldItem.itemRender.props && item.itemRender && item.itemRender.props && oldItem.itemRender.props.api === item.itemRender.props.api && _utils.default.isEqual(oldItem.itemRender.props.param, item.itemRender.props.param)) {
          return item;
        }

        if (item.itemRender && item.itemRender.props && item.itemRender.props.api) {
          getItemPropsOptionsApiList.push({
            field: item.field,
            api: item.itemRender.props.api,
            param: item.itemRender.props.param
          });
        } else if (item.itemRender && item.itemRender.props && item.itemRender.props.param && !item.itemRender.props.api) {
          unifyApiGetOptions.push(item);
        }

        return item;
      });

      if (unifyApiGetOptions.length) {
        handeUnifyApiGetOptions(unifyApiGetOptions, getItemPropsOptionsApiList, this);
      } else if (getItemPropsOptionsApiList.length) {
        fetchItemPropsOptionsApiList(getItemPropsOptionsApiList, this);
      }

      this.itemsOptions = data;
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
      var _this3 = this;

      var filterNullValues = this.filterNullValues;
      return new Promise(function (resolve, reject) {
        _this3.form.validateFields(fields, function (err, values) {
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

            json = _this3.formatSubmitValues(json);
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
      var _this4 = this;

      if (e) {
        e.preventDefault();
      }

      this.form.validateFields(function (err, values) {
        if (!err) {
          var json = (0, _objectSpread2.default)({}, values);
          json = _this4.formatSubmitValues(json);

          _this4.$emit("submit", json);
        }
      });
    },
    // 重置
    resetFields: function resetFields(fields) {
      this.form.resetFields(fields);
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
      var _this5 = this;

      var formData = this.getData();

      var _loop = function _loop(key) {
        var options = data[key];

        var item = _this5.itemsOptions.find(function (p) {
          return p.field === key;
        });

        if (item && item.itemRender && item.itemRender.props) {
          var itemProps = item.itemRender.props;
          var inputRef = "input_" + item.field;
          var input = _this5.$refs[inputRef];

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
      var _this6 = this;

      var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var defaultData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var formData = {};
      this.itemsOptions.forEach(function (item) {
        if (item && item.itemRender && item.itemRender.props && (fields.length && fields.includes(item.field) || fields.length === 0)) {
          var defaultKey = item.itemRender.props.defaultField ? item.itemRender.props.defaultField : _conf.default.getSelectOptions.defaultField;
          var valueField = item.itemRender.props.valueField ? item.itemRender.props.valueField : _conf.default.getSelectOptions.valueField;
          var inputRef = "input_" + item.field;
          var input = _this6.$refs[inputRef];

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

              if (!valueArrayTypes.includes(item.itemRender.name) && defaultValue.length === 1) {
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
    onButtonClick: function onButtonClick(action) {
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

      this.$emit("buttonActionClick", action);
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
    }
  },
  render: function render(h) {
    var form = this.form,
        $slots = this.$slots,
        layout = this.layout,
        colspan = this.colspan,
        readonly = this.readonly,
        onSubmit = this.onSubmit; // ant design form的layout属性

    var antdLayouts = ["horizontal", "vertical", "inline"]; // form表单的参数

    var formProps = {
      props: {
        form: form,
        layout: antdLayouts.includes(layout) ? layout : null
      },
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

      for (var i = 0; i < colspan; i++) {
        formColnumStyle += " 1fr";
      }

      formProps.style["grid-template-columns"] = formColnumStyle;
    }

    return h("a-form", formProps, [].concat($slots.default || renderItems(h, this)));
  }
};
exports.default = _default2;