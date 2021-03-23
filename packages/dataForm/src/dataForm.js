import utils from "../../utils";
import inputs from "./index";
import config from "../conf";
import enquire from "enquire.js";
// import { Button } from "ant-design-vue";
const optionsComponents = ["a-radio-group", "a-checkbox-group", "a-cascader"];
// 回车跳转下一个focus
function nextItemFocus(item, _vm, e = {}) {
  const { enterToNextItemFocusList, setFieldFocus } = _vm;
  if (item.itemRender && item.itemRender.on && item.itemRender.on.enter) {
    const enterRes = item.itemRender.on.enter(e);
    if (enterRes == false) {
      return;
    }
  }
  const fieldIndex = enterToNextItemFocusList.indexOf(item.field);
  if (fieldIndex > -1 && fieldIndex < enterToNextItemFocusList.length - 1) {
    const nextField = enterToNextItemFocusList[fieldIndex + 1];
    setFieldFocus(nextField);
  }
}

// 处理统一请求可选数据的请求
function handeUnifyApiGetOptions(unifyList, optionsApiList, _vm) {
  const { getSelectOptions } = _vm;
  // 处理同一请求参数
  const json = {};
  let fields = [];
  unifyList.map(item => {
    const { param } = item.itemRender.props;
    fields.push({
      field: item.field,
      param
    });
    for (const key in param) {
      if (json[key] && utils.isArray(json[key])) {
        json[key].push(param[key]);
      } else if (json[key] && !utils.isArray(json[key])) {
        json[key] = [json[key], param[key]];
      } else {
        json[key] = param[key];
      }
    }
  });
  const unifyApi =
    getSelectOptions && getSelectOptions.api
      ? getSelectOptions.api
      : config.getSelectOptions.api;
  if (unifyApi) {
    optionsApiList.push({
      api: unifyApi,
      param: json,
      fields
    });
  }
  fetchItemPropsOptionsApiList(optionsApiList, _vm);
}

// 请求表单项可选数据
const fetchItemPropsOptionsApiList = async function(list, _vm) {
  const { setFieldsOptions, onOptionsAllLoad, onOptionsLoadBefore } = _vm;
  if (onOptionsLoadBefore) {
    const beforeRes = onOptionsLoadBefore(list);
    if (beforeRes === false) {
      return false;
    } else if (beforeRes) {
      list = beforeRes;
    }
  }
  let promises = list.map(item => {
    const { api, param } = item;
    return api(param);
  });
  Promise.all(promises)
    .then(res => {
      let json = {};
      list.forEach((item, index) => {
        const { field, fields } = item;
        const itemData = res[index];
        if (fields && fields.length) {
          // 统一请求可选数据 赋值到指定字段的处理
          fields.forEach(element => {
            const optionsData = handlefieldOptionsDataField(
              element.field,
              itemData,
              _vm
            );
            json[element.field] = optionsData;
          });
        } else {
          // 字段单独配置api的可选数据的处理
          const optionsData = handlefieldOptionsDataField(field, itemData, _vm);
          json[field] = optionsData;
          // json[field] = itemData;
        }
      });
      if (onOptionsAllLoad) {
        const onLoadRes = onOptionsAllLoad(json);
        if (onLoadRes) {
          json = onLoadRes;
        }
      }
      setFieldsOptions(json);
    })
    .catch(() => {});
};

function handlefieldOptionsDataField(field, json, _vm) {
  const { itemsOptions } = _vm;
  const fieldItem = itemsOptions.find(p => p.field === field);
  let optionData = json;
  if (fieldItem && fieldItem.itemRender && fieldItem.itemRender.props) {
    const itemProps = fieldItem.itemRender.props;
    const df =
      itemProps.dataField != undefined
        ? itemProps.dataField
        : config.getSelectOptions.dataField;
    optionData = utils.getObjData(df, json);
  }
  return optionData;
}

// 渲染标题
function renderItemTitle(item, h, _vm) {
  const { titleColon, titleWidth, titleAlign } = _vm;
  //是否必填
  let isRequired = false;
  if (item.option && item.option.rules && item.option.rules.length) {
    for (let i = 0; i < item.option.rules.length; i++) {
      const rulesItem = item.option.rules[i];
      if (rulesItem.required) {
        isRequired = true;
        break;
      }
    }
  }
  //标题内容
  let titleText = "";
  if (typeof item.title === "function") {
    titleText = [item.title()];
  } else {
    titleText = item.title;
  }
  let titleWidthStr =
    item.titleWidth || item.titleWidth === 0 ? item.titleWidth : titleWidth;
  if (utils.isNumber(titleWidthStr)) {
    titleWidthStr = `${titleWidthStr}px`;
  }
  return h(
    "div",
    {
      class: [
        "data-form-item-title",
        titleAlign,
        { colon: item.colon === false ? item.colon : titleColon },
        { required: isRequired }
      ],
      style: {
        width: titleWidthStr
      }
    },
    titleText
  );
}

// 渲染input表单项
function renderItemInput(item, h, _vm) {
  const { $slots, $scopedSlots, readonly, onButtonClick, items } = _vm;
  const vDecorator = [item.field];
  if (item.option) {
    vDecorator.push(item.option);
  }
  const props = {
    props: {
      fieldName: item.field
    },
    ...item.itemRender,
    ref: "input_" + item.field,
    directives: [
      {
        name: "decorator",
        value: vDecorator
      }
    ]
  };

  // 只读
  if (
    readonly ||
    (item.itemRender && item.itemRender.props && item.itemRender.props.readonly)
  ) {
    if (props.class) {
      if (utils.isArray(props.class)) {
        props.class.push("input_readonly");
      } else if (utils.isString(props.class)) {
        props.class = `${props.class} input_readonly`;
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
    const find = items.find(p => p.field === item.field);
    if (
      find &&
      find.itemRender &&
      find.itemRender.props &&
      find.itemRender.props.disabled
    ) {
      props.props.disabled = find.itemRender.props.disabled;
    } else {
      props.props.disabled = false;
    }
    // TODO 切换只读的处理
    // if (props.props && props.props.disabled !==true) {
    //   props.props.disabled=false;
    // }
  }
  let inputDom = "";
  if (item.itemRender && item.itemRender.slot) {
    // 插槽
    if ($slots[item.itemRender.slot]) {
      inputDom = $slots[item.itemRender.slot];
    } else if ($scopedSlots[item.itemRender.slot]) {
      (props.scopedSlots = {
        default: $scopedSlots[item.itemRender.slot]
      }),
        (inputDom = h("a-scopedSlots", props));
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
    let renderName =
      item.itemRender &&
      item.itemRender.name &&
      item.itemRender.name !== "hidden"
        ? `${item.itemRender.name}`
        : "a-input";
    if (renderName.indexOf("a-") > -1) {
      let configKey = "";
      configKey = renderName.split("a-")[1];
      configKey = utils.lineToUpperCase(configKey, "-");
      const configProps = config.defaultProps[configKey]
        ? config.defaultProps[configKey]
        : {};
      props.props = {
        ...configProps,
        ...props.props
      };
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
      if (props.on && utils.isObject(props.on)) {
        props.on.inputPressEnter = e => {
          nextItemFocus(item, _vm, e);
        };
      } else {
        props.on = {
          inputPressEnter: e => {
            nextItemFocus(item, _vm, e);
          }
        };
      }
    } else if (renderName === "a-time-picker") {
      renderName = "opu-time-picker";
      if (props.on && utils.isObject(props.on)) {
        props.on.inputPressEnter = e => {
          nextItemFocus(item, _vm, e);
        };
      } else {
        props.on = {
          inputPressEnter: e => {
            nextItemFocus(item, _vm, e);
          }
        };
      }
    } else if (renderName === "a-range-picker-split") {
      if (props.on && utils.isObject(props.on)) {
        props.on.inputPressEnter = e => {
          nextItemFocus(item, _vm, e);
        };
      } else {
        props.on = {
          inputPressEnter: e => {
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
    } else if (optionsComponents.includes(renderName)) {
      // 有可选数据的组件
      props.props.componentPropsData = props.props;
      props.props.renderName = renderName;
      renderName = "options-component";
    }

    inputDom = h(renderName, props);
  }

  return inputDom;
}

// 渲染每个表单项内容
function renderItemContent(item, h, _vm) {
  const { titleWidth } = _vm;
  const before =
    item.itemRender && item.itemRender.before ? item.itemRender.before() : "";
  const after =
    item.itemRender && item.itemRender.after ? item.itemRender.after() : "";

  return h(
    "div",
    {
      style: { width: titleWidth },
      class: "data-form-item-content"
    },
    [
      h(
        "div",
        {
          class: "data-form-item-before"
        },
        [before]
      ),
      h(
        "div",
        {
          class: "data-form-item-input"
        },
        [renderItemInput(item, h, _vm)]
      ),
      h(
        "div",
        {
          class: "data-form-item-after"
        },
        [after]
      )
    ]
  );
}

// 渲染items
function renderItems(h, _vm) {
  const {
    itemsOptions,
    $slots,
    layout,
    currentColspan,
    $scopedSlots,
    focusItemTypes
    // $listeners,
    // submitButtonProps
  } = _vm;

  return itemsOptions
    ? itemsOptions.map(item => {
        const formItemProps = {
          key: item.field,
          props: item,
          style: {},
          class: item.class,
          scopedSlots: {}
        };

        let formItemContent = "";
        if (item.slot && $slots[item.slot]) {
          // 插槽
          formItemContent = $slots[item.slot];
        } else if (item.slot && $scopedSlots[item.slot]) {
          // 作用域插槽
          const vDecorator = [item.field];
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
            directives: [
              {
                name: "decorator",
                value: vDecorator
              }
            ]
          });
        } else if (item.itemRender && item.itemRender.name === "hidden") {
          formItemContent = [renderItemContent(item, h, _vm)];
          formItemProps.style["display"] = "none";
        } else {
          formItemProps.scopedSlots.label = () => {
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
          const colWidth = 100 / currentColspan;
          if (item.width) {
            formItemProps.style["width"] = item.width;
          } else if (item.colspan && item.colspan > 1) {
            formItemProps.style["width"] = `${colWidth * item.colspan}%`;
          } else {
            formItemProps.style["width"] = `${colWidth}%`;
          }
        }

        let wrapperProps = {
          class: ["data-form-item-wrapper", item.align],
          on: {}
        };
        if (
          (item.itemRender && focusItemTypes.includes(item.itemRender.name)) ||
          !(item.itemRender && item.itemRender.name)
        ) {
          wrapperProps.on.keyup = e => {
            const { keyCode } = e;
            e.stopPropagation();
            if (keyCode === 13) {
              nextItemFocus(item, _vm, e);
            }
          };
        }

        return h("a-form-item", formItemProps, [
          h("div", wrapperProps, [formItemContent])
        ]);
      })
    : [];
}

// 渲染提交等操作按钮
function renderActionButtons(h, _vm) {
  const {
    $listeners,
    submitButtonProps,
    cancelButtonProps,
    foldingButtonProps,
    loading,
    onSubmit,
    resetFields,
    titleWidth,
    layout,
    expand,
    onExpandClick,
    items,
    currentColspan
  } = _vm;

  if ($listeners && $listeners.submit && submitButtonProps !== false) {
    // 添加提交按钮
    const submitText =
      submitButtonProps && submitButtonProps.content
        ? submitButtonProps.content
        : config.submitButtonProps.content;
    const cancelText =
      cancelButtonProps && cancelButtonProps.content
        ? cancelButtonProps.content
        : config.cancelButtonProps.content;

    const submitButton = h(
      "a-button",
      {
        props: {
          ...config.submitButtonProps,
          ...submitButtonProps,
          loading: loading
        },
        on: {
          click: onSubmit
        }
      },
      [submitText]
    );
    let cancelButton = "";
    if (cancelButtonProps !== false) {
      cancelButton = h(
        "a-button",
        {
          props: {
            ...config.cancelButtonProps,
            ...cancelButtonProps
          },
          on: {
            click: () => {
              resetFields();
            }
          }
        },
        [cancelText]
      );
    }

    // 渲染展开/收起按钮
    const hasFolding = items.findIndex(p => p.folding) > -1;
    let foldingButton = "";
    if (hasFolding && foldingButtonProps !== false) {
      const openText =
        foldingButtonProps && foldingButtonProps.openText
          ? foldingButtonProps.openText
          : config.foldingButtonProps.openText;
      const hideText =
        foldingButtonProps && foldingButtonProps.hideText
          ? foldingButtonProps.hideText
          : config.foldingButtonProps.hideText;

      const openIcon =
        foldingButtonProps && foldingButtonProps.openIcon
          ? foldingButtonProps.openIcon
          : config.foldingButtonProps.openIcon;
      const hideIcon =
        foldingButtonProps && foldingButtonProps.hideIcon
          ? foldingButtonProps.hideIcon
          : config.foldingButtonProps.hideIcon;

      const foldingText = expand ? hideText : openText;
      const foldingIcon = expand ? hideIcon : openIcon;
      foldingButton = h(
        "a-button",
        {
          props: {
            ...config.foldingButtonProps,
            ...foldingButtonProps
          },
          on: {
            click: onExpandClick
          }
        },
        [foldingText, h("a-icon", { props: { type: foldingIcon } })]
      );
    }
    let titleWidthStr = 0;
    let buttonStyle = {};
    if (layout != "inline") {
      if (utils.isNumber(titleWidth)) {
        titleWidthStr = `${titleWidth}px`;
      } else {
        titleWidthStr = titleWidth;
      }
    }
    if (layout === "grid" && currentColspan && currentColspan > 1) {
      buttonStyle["gridColumn"] = "span " + currentColspan;
    } else if (layout === "flex") {
      buttonStyle["width"] = `100%`;
    }
    return h(
      "div",
      {
        class: "data-form-buttons",
        style: {
          ...buttonStyle,
          marginLeft: titleWidthStr
        }
      },
      [submitButton, cancelButton, foldingButton]
    );
  }
}

// 响应式
const responsiveMap = {
  xs: "(max-width: 575px)",
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1600px)"
};

export default {
  name: "DataForm",
  components: {
    ...inputs
  },
  props: {
    // 表单内容
    items: {
      type: Array,
      default: () => []
    },
    // 布局，'horizontal'|'vertical'|'inline'|'grid'|'flex'
    layout: {
      type: String,
      default: config.layout
    },

    // grid、flex布局时的列数
    colspan: {
      type: [Number, Object],
      default: config.colspan
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 所有项的标题对齐方式
    titleAlign: {
      type: String,
      default: config.titleAlign
    },
    // 所有项的标题宽度
    titleWidth: {
      type: [String, Number],
      default: config.titleWidth
    },
    // 是否显示标题冒号
    titleColon: {
      type: Boolean,
      default: config.titleColon
    },

    // 可选数据全部请求完后回调
    onOptionsAllLoad: {
      type: Function,
      default: () => {}
    },
    // 可选数据请求前回调
    onOptionsLoadBefore: {
      type: Function,
      default: () => {}
    },
    // 获取数据时是否清除空值字段值
    filterNullValues: {
      type: [Boolean, String],
      default: ""
    },
    getSelectOptions: Object,
    submitButtonProps: {
      type: [Boolean, Object],
      default: () => {}
    },
    cancelButtonProps: {
      type: [Boolean, Object],
      default: () => {}
    },
    foldingButtonProps: {
      type: [Boolean, Object],
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 自动获得焦点，string时为指定获得焦点的字段
    autoFocus: {
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      itemsOptions: [],
      expand: false, //折叠展开
      currentColspan: 1,
      // 支持回车活动焦点的组件
      focusItemTypes: [
        "a-input",
        "a-password",
        "a-input-number",
        "a-select",
        "a-date-picker",
        "a-time-picker",
        "a-month-picker",
        "a-week-picker",
        "a-range-picker",
        "a-cascader",
        "a-tree-select",
        "a-textarea",
        "a-range-picker-split"
      ]
    };
  },
  computed: {
    // 回车跳转下一个表单项获得焦点的字段列表
    enterToNextItemFocusList() {
      return this.items
        .map(item => {
          if (
            item.itemRender &&
            this.focusItemTypes.includes(item.itemRender.name) &&
            (!(
              item.itemRender.props &&
              (item.itemRender.props.disabled == true ||
                item.itemRender.props.readonly == true)
            ) ||
              !item.itemRender.props)
          ) {
            // 可获得焦点的组件
            return item.field;
          } else if (!(item.itemRender && item.itemRender.name)) {
            // 可获得焦点的组件
            return item.field;
          }
          return "";
        })
        .filter(p => p !== "");
    }
  },
  watch: {
    items(items) {
      this.cloneItems(items);
    },
    colspan(val) {
      this.currentColspan = val;
    }
  },
  created() {
    this.currentColspan = this.colspan;
    this.cloneItems(this.items);
  },
  mounted() {
    const that = this;
    // 响应式布局
    if (utils.isObject(this.colspan)) {
      this.$nextTick(() => {
        const keys = Object.keys(responsiveMap);
        keys.map(screen =>
          enquire.register(responsiveMap[screen], {
            match: () => {
              that.currentColspan = that.colspan[screen];
            },
            unmatch: () => {
              const keyIndex = keys.findIndex(p => p === screen);
              if (keyIndex > 0) {
                const newKeyIndex = keyIndex - 1;
                that.currentColspan = that.colspan[keys[newKeyIndex]];
              }
            },
            // Keep a empty destory to avoid triggering unmatch when unregister
            destroy() {}
          })
        );
      });
    }
    if (this.autoFocus && this.enterToNextItemFocusList.length) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (typeof this.autoFocus === "string") {
            this.setFieldFocus(this.autoFocus);
          } else {
            this.setFieldFocus(this.enterToNextItemFocusList[0]);
          }
        }, 400);
      });
    }
  },
  beforeDestroy() {
    Object.keys(responsiveMap).map(screen =>
      enquire.unregister(responsiveMap[screen])
    );
  },
  methods: {
    cloneItems(items) {
      const { expand } = this;
      const clone = utils.clone(items, true);
      const getItemPropsOptionsApiList = [];
      const unifyApiGetOptions = [];
      let cloneData = [];
      if (!expand) {
        cloneData = clone.filter(p => !p.folding);
      } else {
        cloneData = clone;
      }
      const data = cloneData.map(item => {
        const oldItem = this.itemsOptions.find(p => p.field === item.field);
        if (
          oldItem &&
          oldItem.itemRender &&
          oldItem.itemRender.props &&
          item.itemRender &&
          item.itemRender.props &&
          oldItem.itemRender.props.api === item.itemRender.props.api &&
          utils.isEqual(
            oldItem.itemRender.props.param,
            item.itemRender.props.param
          )
        ) {
          return item;
        }
        if (
          item.itemRender &&
          item.itemRender.props &&
          item.itemRender.props.api
        ) {
          getItemPropsOptionsApiList.push({
            field: item.field,
            api: item.itemRender.props.api,
            param: item.itemRender.props.param
          });
        } else if (
          item.itemRender &&
          item.itemRender.props &&
          item.itemRender.props.param &&
          !item.itemRender.props.api
        ) {
          unifyApiGetOptions.push(item);
        }
        return item;
      });
      if (unifyApiGetOptions.length) {
        handeUnifyApiGetOptions(
          unifyApiGetOptions,
          getItemPropsOptionsApiList,
          this
        );
      } else if (getItemPropsOptionsApiList.length) {
        fetchItemPropsOptionsApiList(getItemPropsOptionsApiList, this);
      }

      this.itemsOptions = data;
    },
    // 获取表单数据，不验证
    getData() {
      return this.form.getFieldsValue();
    },
    // 设置表单值
    setData(values) {
      const { items } = this;
      // 过滤掉formitems未定义的字段
      const formFields = items.map(item => item.field);
      let formData = {};
      for (const key in values) {
        if (formFields.includes(key)) {
          formData[key] = values[key];
        }
      }
      this.form.setFieldsValue(formData);
    },
    // 校验并获取一组输入域的值
    validateFields(fields) {
      const { filterNullValues } = this;
      return new Promise((resolve, reject) => {
        this.form.validateFields(fields, (err, values) => {
          if (!err) {
            let json = {
              ...values
            };
            const hasFilterNullValues =
              !filterNullValues && filterNullValues !== false
                ? config.filterNullValues
                : false;
            if (hasFilterNullValues) {
              for (const key in json) {
                if (!(json[key] || json[key] == 0)) {
                  delete json[key];
                }
              }
            }
            json = this.formatSubmitValues(json);
            resolve(json);
          } else {
            reject();
          }
        });
      });
    },
    // 格式化提交数据，上传对象转成url
    formatSubmitValues(values) {
      const { items } = this;
      items.forEach(item => {
        // 将上传组件的对象值转换成url字符串
        if (
          item.itemRender &&
          item.itemRender.name === "upload" &&
          values[item.field]
        ) {
          const value = values[item.field];
          if (value.fileList && value.fileList.length) {
            const list = value.fileList
              .map(p => {
                if (p.url) {
                  return p.url;
                } else if (p.response) {
                  const responseUrlField =
                    item.itemRender.props &&
                    item.itemRender.props.responseUrlField
                      ? item.itemRender.props.responseUrlField
                      : "data";
                  const url = utils.getObjData(responseUrlField, p.response);
                  if (url) {
                    return url;
                  }
                  return p;
                } else if (p.status !== "done") {
                  return "";
                }
                return p;
              })
              .filter(p => p !== "");
            values[item.field] = list && list.length ? list : undefined;
          } else if (value.fileList && value.fileList.length === 0) {
            values[item.field] = undefined;
          }
        }
      });
      return values;
    },
    // 提交
    onSubmit(e) {
      if (e) {
        e.preventDefault();
      }
      // this.loading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          let json = {
            ...values
          };
          json = this.formatSubmitValues(json);
          this.$emit("submit", json);
        }
      });
    },
    // 重置
    resetFields(fields) {
      this.form.resetFields(fields);
    },
    // 设置字段获得焦点
    setFieldFocus(field) {
      const refName = `input_${field}`;
      const item = this.$refs[refName];
      if (item && item.focus) {
        item.focus();
      }
    },
    // 设置一组字段的options数据
    setFieldsOptions(data) {
      const formData = this.getData();
      for (const key in data) {
        const options = data[key];
        const item = this.itemsOptions.find(p => p.field === key);
        if (item && item.itemRender && item.itemRender.props) {
          const itemProps = item.itemRender.props;
          const inputRef = "input_" + item.field;
          const input = this.$refs[inputRef];
          if (input && input.setOptionsData) {
            input.setOptionsData(options);
          }
          if (formData[key]) {
            const vF =
              itemProps.valueField != undefined
                ? itemProps.valueField
                : config.getSelectOptions.valueField;
            if (utils.isArray(formData[key])) {
              // 数组的值
              const arrValue = [];
              for (let i = 0; i < options.length; i++) {
                const el = options[i];
                if (formData[key].includes(el[vF])) {
                  arrValue.push(el[vF]);
                }
              }
              formData[key] = arrValue;
            } else {
              const valueRow = options.find(p => p[vF] == formData[key]);
              if (!valueRow) {
                formData[key] = "";
              }
            }
          }
        }
      }
      // 清除赋值字段的值
      this.setData(formData);
    },

    // 设置下拉框默认值，从下拉数据中获得默认选项,names = 指定要设置默认的字段，为空则设置全部
    setFieldsOptionsDefaultValues(fields = [], defaultData = {}) {
      const formData = {};
      this.itemsOptions.forEach(item => {
        if (
          item &&
          item.itemRender &&
          item.itemRender.props &&
          ((fields.length && fields.includes(item.field)) ||
            fields.length === 0)
        ) {
          const defaultKey = item.itemRender.props.defaultField
            ? item.itemRender.props.defaultField
            : config.getSelectOptions.defaultField;
          const valueField = item.itemRender.props.valueField
            ? item.itemRender.props.valueField
            : config.getSelectOptions.valueField;
          const inputRef = "input_" + item.field;
          const input = this.$refs[inputRef];
          if (input && input.getOptionsData) {
            const options = input.getOptionsData();
            const defaultValue = options
              .map(p => {
                if (p[defaultKey]) {
                  return p[valueField];
                }
                return "";
              })
              .filter(p => p !== "");
            if (defaultValue.length) {
              const valueArrayTypes = [
                "a-checkbox-group",
                "a-radio-group",
                "a-select"
              ];
              let value = defaultValue;
              if (
                !valueArrayTypes.includes(item.itemRender.name) &&
                defaultValue.length === 1
              ) {
                value = defaultValue[0];
              }
              formData[item.field] = value;
            }
          }
        }
      });
      const json = {
        ...defaultData,
        ...formData
      };
      this.setData(json);
    },
    // 渲染的按钮点击事件
    onButtonClick(action,e) {
      const { onSubmit, resetFields } = this;
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
      this.$emit("buttonActionClick", action,e);
    },
    // 获取某个输入控件的 Error
    getFieldError(field) {
      return this.form.getFieldError(field);
    },
    // 获取一组输入控件的 Error ，如不传入参数，则获取全部组件的 Error
    getFieldsError(fields) {
      return this.form.getFieldsError(fields);
    },
    // 获取一个输入控件的值
    getFieldValue(field) {
      return this.form.getFieldValue(field);
    },
    // 判断是否任一输入控件经历过 getFieldDecorator 或 v-decorator 的值收集时机 options.trigger
    isFieldsTouched(fields) {
      return this.form.isFieldsTouched(fields);
    },
    // 判断一个输入控件是否经历过 getFieldDecorator 或 v-decorator 的值收集时机 options.trigger
    isFieldTouched(fields) {
      return this.form.isFieldTouched(fields);
    },
    // 判断一个输入控件是否在校验状态
    isFieldValidating(fields) {
      return this.form.isFieldValidating(fields);
    },
    // 设置一组输入控件的值与错误状态。
    setFields(fields) {
      return this.form.setFields(fields);
    },
    // 展开、关闭折叠
    setExpand(flag) {
      this.expand = flag;
      this.cloneItems(this.items);
    },
    onExpandClick() {
      const expand = !this.expand;
      this.setExpand(expand);
    }
  },
  render(h) {
    const { form, layout, currentColspan, readonly, onSubmit } = this;
    // ant design form的layout属性
    const antdLayouts = ["horizontal", "vertical", "inline"];
    // form表单的参数
    const formProps = {
      props: {
        ...config.props,
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
      let formColnumStyle = "";
      for (let i = 0; i < currentColspan; i++) {
        formColnumStyle += " 1fr";
      }
      formProps.style["grid-template-columns"] = formColnumStyle;
    }
    return h("a-form", formProps, [
      renderItems(h, this),
      renderActionButtons(h, this)
    ]);
  }
};
