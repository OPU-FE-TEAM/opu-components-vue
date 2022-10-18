import utils from "../../utils";
import inputs from "./index";
import DEFAULTCONFIG from "../conf";
import enquire from "enquire.js";
import actionModal from "./actionModal";
import { cloneDeep } from "lodash";

// import { Button } from "ant-design-vue";
const optionsComponents = [
  "a-radio-group",
  "a-checkbox-group",
  "a-cascader",
  "a-cascader-ex"
];
// 回车跳转下一个focus
function nextItemFocus(item, _vm, e = {}) {
  if (e && e.type != "keyup") return;
  const { enterToNextItemFocusList, setFieldFocus } = _vm;
  if (
    ["a-cascader"].includes(item.itemRender.name) &&
    _vm.$refs["input_" + item.field].getVisible()
  ) {
    return false;
  }
  if (item.itemRender.on && item.itemRender.on.enter) {
    const enterRes = item.itemRender.on.enter(e);
    if (enterRes == false) {
      return;
    }
  }

  const fieldIndex = enterToNextItemFocusList.indexOf(item.field);
  if (fieldIndex > -1 && fieldIndex < enterToNextItemFocusList.length - 1) {
    if (["a-tree-select", "a-cascader-ex"].includes(item.itemRender.name)) {
      const item = _vm.$refs[`input_${enterToNextItemFocusList[fieldIndex]}`];
      item.blur && item.blur();
    }
    const nextField = enterToNextItemFocusList[fieldIndex + 1];
    setFieldFocus(nextField);
  }
}

// 处理统一请求可选数据的请求
function handeUnifyApiGetOptions(
  unifyList,
  optionsApiList,
  _vm,
  formData = {},
  callback
) {
  const { getSelectOptions } = _vm;
  // 处理同一请求参数
  const json = {};
  let fields = [];
  unifyList.map(item => {
    const { param, autoLoadOptionsId } = item.itemRender.props;
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
    // 添加表单字段参数
    if (
      formData &&
      formData[item.field] &&
      DEFAULTCONFIG.getSelectOptions &&
      DEFAULTCONFIG.getSelectOptions.loadOptionsIdField &&
      autoLoadOptionsId !== false
    ) {
      json[DEFAULTCONFIG.getSelectOptions.loadOptionsIdField] =
        formData[item.field];
    }
  });

  const unifyApi =
    getSelectOptions && getSelectOptions.api
      ? getSelectOptions.api
      : DEFAULTCONFIG.getSelectOptions.api;
  if (unifyApi) {
    optionsApiList.push({
      api: unifyApi,
      param: json,
      fields
    });
  }
  fetchItemPropsOptionsApiList(optionsApiList, _vm, formData, callback);
}

// 请求表单项可选数据
const fetchItemPropsOptionsApiList = async function(
  list,
  _vm,
  formData,
  callback
) {
  const {
    setFieldsOptions,
    onOptionsAllLoad,
    onOptionsLoadBefore,
    onOptionsLoadAfter,
    autoSetDefaultValue,
    autoSetDefaultFirst,
    setFieldsOptionsDefaultValues
  } = _vm;
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
    const field = item.field;
    // 添加表单字段参数
    if (
      field &&
      formData &&
      formData[field] &&
      DEFAULTCONFIG.getSelectOptions &&
      DEFAULTCONFIG.getSelectOptions.loadOptionsIdField &&
      ((item.props && item.props.autoLoadOptionsId !== false) || !item.props)
    ) {
      param[DEFAULTCONFIG.getSelectOptions.loadOptionsIdField] =
        formData[field];
    }
    return api(param);
  });
  Promise.all(promises)
    .then(res => {
      let json = {};
      let apiFields = [];
      list.forEach((item, index) => {
        const { field, fields } = item;
        const itemData = res[index];
        if (fields && fields.length) {
          // 统一请求可选数据 赋值到指定字段的处理
          fields.forEach(p => {
            const optionsData = handlefieldOptionsDataField(
              p.field,
              itemData,
              _vm
            );
            json[p.field] = optionsData;
            apiFields.push(p.field);
          });
        } else {
          // 字段单独配置api的可选数据的处理
          const optionsData = handlefieldOptionsDataField(field, itemData, _vm);
          json[field] = optionsData;
          apiFields.push(field);
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
      let defaultFormData = {};
      if (autoSetDefaultValue && autoSetDefaultFirst) {
        defaultFormData = setFieldsOptionsDefaultValues(apiFields);
      }
      onOptionsLoadAfter(json, defaultFormData);
      callback && callback(json, defaultFormData);
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
        : DEFAULTCONFIG.getSelectOptions.dataField;
    optionData = utils.getObjData(df, json);
  }
  return optionData;
}

// 渲染标题
function renderItemTitle(item, h, _vm) {
  const { formTitleColon, formTitleWidth, formTitleAlign } = _vm;
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
  if (item.title === false) return "";
  if (typeof item.title === "function") {
    titleText = [item.title()];
  } else {
    titleText = item.title;
  }
  let titleWidthStr =
    item.titleWidth || item.titleWidth === 0 ? item.titleWidth : formTitleWidth;
  if (utils.isNumber(titleWidthStr)) {
    titleWidthStr = `${titleWidthStr}px`;
  }
  // tooltip
  let tooltip = "";
  if (item.tooltip) {
    tooltip = h(
      "a-tooltip",
      { props: { title: item.tooltip }, style: { marginLeft: "5px" } },
      [
        h("a-icon", {
          props: { type: "question-circle" },
          style: { color: "#999" }
        })
      ]
    );
  }
  return h(
    "div",
    {
      class: [
        "data-form-item-title",
        formTitleAlign,
        { colon: item.colon === false ? item.colon : formTitleColon },
        { required: isRequired }
      ],
      style: {
        width: titleWidthStr
      }
    },
    [titleText, tooltip]
  );
}

// 渲染input表单项
function renderItemInput(item, h, _vm) {
  const {
    $slots,
    $scopedSlots,
    readonly,
    items,
    onButtonClick,
    renderNameKeys,
    itemsOptionsIndexs,
    componentsFocusItemTypes
  } = _vm;
  const vDecorator = [item.field];
  if (item.option) {
    vDecorator.push(item.option);
  }
  let itemRender = item.itemRender;
  const props = {
    props: {
      fieldName: item.field
    },
    ...itemRender,
    ref: "input_" + item.field,
    directives: [
      {
        name: "decorator",
        value: vDecorator
      }
    ]
  };

  // 只读
  if (readonly || itemRender.props.readonly) {
    if (props.class) {
      if (utils.isArray(props.class)) {
        props.class.push("input_readonly");
      } else if (utils.isString(props.class)) {
        props.class = `${props.class} input_readonly`;
      }
    } else {
      props.class = ["input_readonly"];
    }
    props.props.disabled = true;
    props.props.placeholder = null;
  } else {
    const find = items[itemsOptionsIndexs[item.field]];
    if (
      find &&
      find.itemRender &&
      find.itemRender.props &&
      find.itemRender.props.disabled
    ) {
      props.props.disabled = itemRender.props.disabled;
    } else {
      props.props.disabled = false;
    }

    // TODO 切换只读的处理
    // if (props.props && props.props.disabled !==true) {
    //   props.props.disabled=false;
    // }
  }

  let inputDom = "";
  if (itemRender.slot) {
    // 插槽
    if ($slots[itemRender.slot]) {
      inputDom = $slots[itemRender.slot];
    } else if ($scopedSlots[itemRender.slot]) {
      (props.scopedSlots = {
        default: $scopedSlots[itemRender.slot]
      }),
        (inputDom = h("a-scopedSlots", props));
    }
  } else if (itemRender.customRender) {
    // 自定义渲染内容
    if (itemRender.props) {
      props.props["customRender"] = itemRender.customRender;
    } else {
      props.props = {
        customRender: itemRender.customRender
      };
    }
    inputDom = h("a-customRender", props);
  } else {
    // 根据name渲染组件
    let renderName =
      itemRender.name && itemRender.name !== "hidden"
        ? `${itemRender.name}`
        : "a-input";
    // if (renderName.indexOf("a-") > -1) {
    let configKey = "";
    if (renderName.indexOf("a-") > -1) {
      configKey = renderName.split("a-")[1];
      configKey = utils.lineToUpperCase(configKey, "-");
    } else {
      configKey = utils.lineToUpperCase(renderName, "-");
    }
    const configProps = DEFAULTCONFIG.defaultProps[configKey]
      ? DEFAULTCONFIG.defaultProps[configKey]
      : {};
    props.props = {
      ...configProps,
      ...props.props
    };
    // }
    if (componentsFocusItemTypes.includes(renderName)) {
      props.on = {
        ...props.on,
        inputPressEnter: e => {
          e.stopPropagation();
          nextItemFocus(item, _vm, e);
        }
      };
    }
    if (renderNameKeys[renderName]) {
      renderName = renderNameKeys[renderName];
    } else if (renderName === "buttons") {
      if (props.props) {
        props.props.itemClick = onButtonClick;
      } else {
        props.props = {
          itemClick: onButtonClick
        };
      }
      props.props.items = itemRender.items;
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
  const { formTitleWidth, $scopedSlots } = _vm;
  const itemRender = item.itemRender;
  const before = itemRender.before ? itemRender.before() : "";
  let after = itemRender.after ? itemRender.after() : "";
  let extend = itemRender.extend ? itemRender.extend(item) : "";
  if (item.actions && item.actions.length && !itemRender.props.disabled) {
    after = item.actions.map(p => {
      let actionButton = "";
      if (utils.isFunction(p.button)) {
        actionButton = p.button();
      } else {
        const buttonProps =
          p.button && p.button.props ? utils.clone(p.button.props) : {};
        const buttonContent = buttonProps.content ? buttonProps.content : "";
        const buttonOn = {
          click: e => {
            if (p.button && p.button.on && p.button.on.click) {
              const onClickRes = p.button.on.click(e);
              if (onClickRes === false) {
                return false;
              }
            }
            if (p.modal) {
              const modalProps = p.modal && p.modal.props ? p.modal.props : {};
              actionModal({
                modalProps: { ...modalProps },
                content: p.modal.content,
                form: p.modal.form,
                slots: $scopedSlots
              });
            }
          }
        };

        actionButton = h(
          "a-button",
          {
            ...{
              props: { ...buttonProps },
              on: { ...buttonOn },
              style: { ...p.button.style }
            }
          },
          [buttonContent]
        );
      }
      return actionButton;
    });
  }

  return h(
    "div",
    {
      style: { width: formTitleWidth },
      class: {
        "data-form-item-content": true,
        "form-item-buttons": itemRender && itemRender.name == "buttons"
      }
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
      ),
      h(
        "div",
        {
          class: "data-form-item-extend"
        },
        [extend]
      )
    ]
  );
}

// 渲染items
function renderItems(h, _vm) {
  const {
    itemsOptions,
    $slots,
    formLayout,
    currentColspan,
    $scopedSlots,
    wrapperFocusItemTypes,
    currentScreen
    // $listeners,
    // submitButtonProps
  } = _vm;

  return itemsOptions
    ? itemsOptions.map(item => {
        const formItemProps = {
          key: item.field,
          props: item,
          style: item.style ? item.style : {},
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
        } else if (item.itemRender.name === "hidden") {
          formItemContent = [renderItemContent(item, h, _vm)];
          formItemProps.style["display"] = "none";
        } else {
          formItemProps.scopedSlots.label = () => {
            return renderItemTitle(item, h, _vm);
          };
          formItemContent = [renderItemContent(item, h, _vm)];
        }
        if (formLayout === "grid") {
          // grid模式下每个单元格所占格
          if (item.colspan) {
            let itemColspan = "";
            if (utils.isObject(item.colspan)) {
              itemColspan = item.colspan[currentScreen];
            } else {
              itemColspan = item.colspan;
            }
            // that.currentScreen
            formItemProps.style["gridColumn"] = "span " + itemColspan;
          }
          if (item.rowspan && item.rowspan > 1) {
            formItemProps.style["gridRow"] = "span " + item.rowspan;
          }
        } else if (formLayout === "flex") {
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
          (wrapperFocusItemTypes.includes(item.itemRender.name) ||
            !item.itemRender.name) &&
          !(item.itemRender.name == "a-input-number-split")
        ) {
          wrapperProps.on.keyup = e => {
            const { keyCode } = e;
            if (e.shiftKey && item.itemRender.name == "a-textarea")
              return false;
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
    formTitleWidth,
    formLayout,
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
        : DEFAULTCONFIG.submitButtonProps.content;
    const cancelText =
      cancelButtonProps && cancelButtonProps.content
        ? cancelButtonProps.content
        : DEFAULTCONFIG.cancelButtonProps.content;

    const submitButton = h(
      "a-button",
      {
        props: {
          ...DEFAULTCONFIG.submitButtonProps,
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
            ...DEFAULTCONFIG.cancelButtonProps,
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
          : DEFAULTCONFIG.foldingButtonProps.openText;
      const hideText =
        foldingButtonProps && foldingButtonProps.hideText
          ? foldingButtonProps.hideText
          : DEFAULTCONFIG.foldingButtonProps.hideText;

      const openIcon =
        foldingButtonProps && foldingButtonProps.openIcon
          ? foldingButtonProps.openIcon
          : DEFAULTCONFIG.foldingButtonProps.openIcon;
      const hideIcon =
        foldingButtonProps && foldingButtonProps.hideIcon
          ? foldingButtonProps.hideIcon
          : DEFAULTCONFIG.foldingButtonProps.hideIcon;

      const foldingText = expand ? hideText : openText;
      const foldingIcon = expand ? hideIcon : openIcon;
      foldingButton = h(
        "a-button",
        {
          props: {
            ...DEFAULTCONFIG.foldingButtonProps,
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
    if (formLayout != "inline") {
      if (utils.isNumber(formTitleWidth)) {
        titleWidthStr = `${formTitleWidth}px`;
      } else {
        titleWidthStr = formTitleWidth;
      }
    }
    if (formLayout === "grid" && currentColspan && currentColspan > 1) {
      buttonStyle["gridColumn"] = "span " + currentColspan;
    } else if (formLayout === "flex") {
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
    /* DEFAULTCONFIG 配置参数 开始 */
    // 布局，'horizontal'|'vertical'|'inline'|'grid'|'flex'
    layout: {
      type: String,
      default: ""
    },
    // grid、flex布局时的列数
    colspan: {
      type: [Number, String, Object],
      default: ""
    },
    // 所有项的标题对齐方式
    titleAlign: {
      type: String,
      default: ""
    },
    // 所有项的标题宽度
    titleWidth: {
      type: [String, Number],
      default: ""
    },
    // 是否显示标题冒号
    titleColon: {
      type: [Boolean, String],
      default: ""
    },
    //是否清空找不到的值
    clearUndefinedValue: {
      type: [Boolean, String],
      default: ""
    },
    /* DEFAULTCONFIG 配置参数 结束 */
    // 表单内容
    items: {
      type: Array,
      default: () => []
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
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
    // 可选数据请求后回调
    onOptionsLoadAfter: {
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
      type: Boolean,
      default: false
    },
    autoSetDefaultFirst: {
      type: Boolean,
      default: false
    },
    autoEnterSelectInput: {
      type: [Boolean, String],
      default: ""
    }
    // //是否缓存option
    // isCacheOption: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      itemsOptions: [],
      expand: false, //折叠展开
      // 支持回车活动焦点的组件
      componentsFocusItemTypes: [
        "a-date-picker",
        "a-time-picker",
        "a-month-picker",
        "a-week-picker",
        "a-range-picker",
        "a-range-picker-split",
        "pulldown-table",
        "a-input-number-split",
        "a-cascader",
        "a-cascader-ex"
      ],
      wrapperFocusItemTypes: [
        "a-input-number",
        "a-input",
        "a-password",
        "a-input-password",
        "a-auto-complete",
        "a-select",
        "a-tree-select",
        "a-textarea",
        "a-select-group",
        "a-cascader-ex"
      ],
      //有返回数据的Form组件名称
      optionsFormTypes: [
        "a-select",
        "a-select-group",
        "a-tree-select",
        "a-radio-group",
        "a-checkbox-group"
      ],
      renderNameKeys: {
        "a-select": "opu-select",
        "a-date-picker": "opu-date-picker",
        "a-time-picker": "opu-time-picker",
        "a-switch": "opu-switch",
        "a-checkbox": "opu-checkbox",
        "a-tree-select": "opu-tree-select",
        "a-select-group": "opu-select-group",
        "a-auto-complete": "opu-auto-complete"
      },
      //老数据
      oldItems: {},
      //有返回数据的item集合索引
      itemsOptionsIndexs: {},
      optionsItemDataIndexs: {},
      unifyApiGetOptions: [],
      getItemPropsOptionsApiList: [],
      DEFAULTCONFIG: DEFAULTCONFIG,
      currentScreen: "xl"
    };
  },
  computed: {
    // 回车跳转下一个表单项获得焦点的字段列表
    enterToNextItemFocusList() {
      return this.itemsOptions
        .map(item => {
          let itemRender = item.itemRender;
          let itemProps = itemRender.props;
          if (
            itemProps.disabled ||
            itemProps.readonly ||
            itemRender.name == "hidden" ||
            itemRender.slot ||
            itemRender.customRender
          ) {
            return "";
          } else if (
            !itemRender.name ||
            [
              ...this.wrapperFocusItemTypes,
              ...this.componentsFocusItemTypes
            ].includes(itemRender.name)
          ) {
            // 可获得焦点的组件
            return item.field;
          }
          return "";
        })
        .filter(p => p !== "");
    },
    //布局
    formLayout() {
      let layout = this.layout;
      if (layout === "") {
        layout = DEFAULTCONFIG.layout;
      }
      return layout;
    },
    // grid、flex布局时的列数
    currentColspan() {
      let colspan = this.colspan;
      if (colspan === "") {
        colspan = DEFAULTCONFIG.colspan;
      }
      if (utils.isObject(colspan)) {
        colspan = colspan[this.currentScreen];
      }
      return colspan;
    },
    // 所有项的标题对齐方式
    formTitleAlign() {
      let titleAlign = this.titleAlign;
      if (titleAlign === "") {
        titleAlign = DEFAULTCONFIG.titleAlign;
      }
      return titleAlign;
    },
    // 所有项的标题宽度
    formTitleWidth() {
      let titleWidth = this.titleWidth;
      if (titleWidth === "") {
        titleWidth = DEFAULTCONFIG.titleWidth;
      }
      return titleWidth;
    },
    // 是否显示标题冒号
    formTitleColon() {
      let titleColon = this.titleColon;
      if (titleColon === "") {
        titleColon = DEFAULTCONFIG.titleColon;
      }
      return titleColon;
    },
    //是否清空找不到的值
    formClearUndefinedValue() {
      let clearUndefinedValue = this.clearUndefinedValue;
      if (clearUndefinedValue === "") {
        clearUndefinedValue = DEFAULTCONFIG.clearUndefinedValue;
      }
      return clearUndefinedValue;
    },
    //enter自动切换下一个
    formAutoEnterSelectInput() {
      let autoEnterSelectInput = this.autoEnterSelectInput;
      if (autoEnterSelectInput === "") {
        autoEnterSelectInput = DEFAULTCONFIG.autoEnterSelectInput;
      }
      return autoEnterSelectInput;
    }
  },
  watch: {
    items(items) {
      this.cloneItems(items);
    }
  },
  created() {
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
              that.currentScreen = screen;
            },
            unmatch: () => {
              const keyIndex = keys.findIndex(p => p === screen);
              if (keyIndex > 0) {
                that.currentScreen = keys[keyIndex - 1];
              }
            },
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
    cloneItems(items, type, callback) {
      let {
        expand,
        autoLoadOptionsData,
        isPartRequest,
        optionsItemDataIndexs,
        oldItems: prevItems
      } = this;
      const clone = utils.clone(items, true);
      const getItemPropsOptionsApiList = [];
      const unifyApiGetOptions = [];
      const isAutoLoadOptionsData =
        (autoLoadOptionsData === true || autoLoadOptionsData === false) &&
        autoLoadOptionsData !==
          DEFAULTCONFIG.getSelectOptions.autoLoadOptionsData
          ? autoLoadOptionsData
          : DEFAULTCONFIG.getSelectOptions.autoLoadOptionsData;

      let cloneData = expand ? clone : clone.filter(p => !p.folding);
      let itemsOptionsIndexs = {};
      let oldItems = {};
      const isFormPartRequest =
        isPartRequest !== ""
          ? isPartRequest
          : DEFAULTCONFIG.getSelectOptions.isPartRequest;
      const data = cloneData.map((item, index) => {
        let field = item.field;
        let itemRender = item.itemRender || {};
        item.itemRender = itemRender;
        itemRender.props = itemRender.props || {};
        let itemProps = itemRender.props;
        itemsOptionsIndexs[field] = index;
        let prevItem = prevItems[field];
        oldItems[field] = cloneDeep(item);
        if (
          isAutoLoadOptionsData &&
          !type &&
          prevItem &&
          prevItem.itemRender.props.api === itemProps.api &&
          utils.isEqual(prevItem.itemRender.props.param, itemProps.param)
        ) {
          return item;
        }
        if (itemProps.api || itemProps.param) {
          if (isFormPartRequest === true && !itemProps.api) {
            itemProps.api = DEFAULTCONFIG.getSelectOptions.api;
          }
          if (itemProps.api) {
            getItemPropsOptionsApiList.push({
              field: field,
              api: itemProps.api,
              param: itemProps.param,
              props: itemProps
            });
          } else if (itemProps.param) {
            unifyApiGetOptions.push(item);
          }
        }
        let row = this.initOptionsItemIndex(item, index);
        if (row) {
          optionsItemDataIndexs[field] = row;
        }
        return item;
      });

      this.itemsOptionsIndexs = itemsOptionsIndexs;
      this.optionsItemDataIndexs = optionsItemDataIndexs;
      this.unifyApiGetOptions = unifyApiGetOptions;
      this.getItemPropsOptionsApiList = getItemPropsOptionsApiList;
      this.itemsOptions = data;
      this.oldItems = oldItems;
      if (isAutoLoadOptionsData || type) {
        this.loadOptionsData(null, callback);
      }
    },
    //初始化 optionsItem 索引数据
    initOptionsItemIndex(item, index) {
      let { optionsItemDataIndexs, optionsFormTypes } = this;
      let row;
      let itemRender = item.itemRender || {};
      if (itemRender.name && optionsFormTypes.indexOf(itemRender.name) > -1)
        if (optionsItemDataIndexs[item.field]) {
          row = {
            ...optionsItemDataIndexs[item.field],
            index
          };
        } else {
          let itemProps = itemRender.props;
          row = {
            name: itemRender.name,
            options: [],
            ...itemProps,
            index
          };
          if (
            itemRender.name == "a-tree-select" &&
            itemProps.treeData &&
            itemProps.treeData.length > 0
          ) {
            row.options = itemProps.treeData;
          }
        }
      return row;
    },
    loadOptionsData(formData = {}, callback, isAll) {
      if (isAll) {
        this.cloneItems(this.items, isAll, callback);
      } else {
        const { unifyApiGetOptions, getItemPropsOptionsApiList } = this;
        if (unifyApiGetOptions.length) {
          handeUnifyApiGetOptions(
            unifyApiGetOptions,
            getItemPropsOptionsApiList,
            this,
            formData,
            callback
          );
        } else if (getItemPropsOptionsApiList.length) {
          fetchItemPropsOptionsApiList(
            getItemPropsOptionsApiList,
            this,
            formData,
            callback
          );
        } else {
          callback && callback();
        }
      }
    },
    /**
     * @description: 修改items内容
     * @param {*}
     * @return {*}
     */
    reviseItems(data) {
      this.itemsOptions = this.itemsOptions.map(p => {
        let field = p.field;
        return data[field] ? data[field] : p;
      });
    },
    // 获取表单数据，不验证
    getData() {
      return this.form.getFieldsValue();
    },
    // 设置表单值
    setData(values) {
      const { items, optionsItemDataIndexs, formClearUndefinedValue } = this;
      const {
        getSelectOptions: {
          valueField: configValueField,
          childrenField: configChildrenField
        }
      } = DEFAULTCONFIG;
      // 过滤掉formitems未定义的字段
      const formFields = items.map(item => item.field);
      let formData = {};
      for (const key in values) {
        if (formFields.includes(key)) {
          let item = optionsItemDataIndexs[key];
          if (formClearUndefinedValue && item) {
            let is = false;
            if (item.options.length > 0) {
              if (
                item.name == "a-tree-select" ||
                item.name == "a-select-group"
              ) {
                let valueField = item.replaceFields
                  ? item.replaceFields.value || configValueField
                  : configValueField;
                let childrenField = item.replaceFields
                  ? item.replaceFields.children || configChildrenField
                  : configChildrenField;
                if (utils.isArray(values[key])) {
                  values[key] = utils.hasOptionsValue(
                    item.options,
                    values[key],
                    valueField,
                    childrenField,
                    true
                  );
                  is = true;
                } else {
                  is = utils.hasOptionsValue(
                    item.options,
                    values[key],
                    valueField,
                    childrenField
                  );
                }
              } else {
                const vF = item.valueField || configValueField;
                if (utils.isArray(values[key])) {
                  const arrValue = [];
                  for (let i = 0; i < item.options.length; i++) {
                    const el = item.options[i];
                    if (values[key].includes(el[vF])) {
                      arrValue.push(el[vF]);
                    }
                    if (arrValue.length == values[key].length) break;
                  }
                  is = true;
                  values[key] = arrValue;
                } else {
                  is = item.options.findIndex(p => p[vF] == values[key]) > -1;
                }
              }
            } else {
              is = true;
            }

            formData[key] = is ? values[key] : undefined;
          } else {
            formData[key] = values[key];
          }
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

            let hasFilterNullValues = filterNullValues;
            if (hasFilterNullValues === "") {
              hasFilterNullValues = DEFAULTCONFIG.filterNullValues;
            }
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
      this.$emit("reset", fields);
    },
    // 设置字段获得焦点
    setFieldFocus(field) {
      const refName = `input_${field}`;
      const item = this.$refs[refName];
      if (item && item.focus) {
        item.focus();
        this.formAutoEnterSelectInput && item.select && item.select();
      }
    },
    // 设置一组字段的options数据
    setFieldsOptions(data) {
      let { optionsItemDataIndexs, itemsOptionsIndexs } = this;
      const formData = this.getData();
      for (const key in data) {
        const options = data[key];
        const index = itemsOptionsIndexs[key];
        if (index > -1) {
          const item = this.itemsOptions[index];
          if (item && item.itemRender && item.itemRender.props) {
            const inputRef = "input_" + item.field;
            const input = this.$refs[inputRef];
            if (input && input.setOptionsData) {
              input.setOptionsData(options);
              if (optionsItemDataIndexs[key]) {
                optionsItemDataIndexs[item.field].options = options;
              }
            }
          }
        }
      }
      // 清除赋值字段的值
      this.setData(formData);
    },
    //获取表单字段options数据
    getFieldsOptions(fields) {
      let { optionsItemDataIndexs } = this;
      let data = {};
      if (!fields) {
        for (let i in optionsItemDataIndexs) {
          data[i] = optionsItemDataIndexs[i].options;
        }
      } else {
        for (let i = 0; i < fields.length; i++) {
          let field = fields[i];
          data[field] = optionsItemDataIndexs[field].options;
        }
      }
      return data;
    },
    // 设置下拉框默认值，从下拉数据中获得默认选项,names = 指定要设置默认的字段，为空则设置全部
    setFieldsOptionsDefaultValues(fields = [], defaultData = {}, callback) {
      let { autoSetDefaultFirst } = this;
      let formData = {};
      let linkageFormData = {};
      let defaultFormData = {};
      this.itemsOptions.forEach(item => {
        if (
          !item.itemRender.props.unDefaultSelected &&
          ((fields.length && fields.includes(item.field)) ||
            fields.length === 0)
        ) {
          let itemRender = item.itemRender;
          let props = itemRender.props;
          const defaultKey = props.defaultField
            ? props.defaultField
            : DEFAULTCONFIG.getSelectOptions.defaultField;
          const valueField = props.valueField
            ? props.valueField
            : DEFAULTCONFIG.getSelectOptions.valueField;
          const inputRef = "input_" + item.field;
          const input = this.$refs[inputRef];
          if (input && input.getOptionsData) {
            const options = input.getOptionsData();
            if (options.length > 0) {
              let defaultRows = [];
              let itemName = itemRender.name;
              if (
                ![
                  "a-cascader",
                  "a-cascader-ex",
                  "a-select-group",
                  "a-tree-select"
                ].includes(itemName)
              ) {
                if (autoSetDefaultFirst) {
                  defaultRows = [options[0]];
                } else {
                  defaultRows = options.filter(p => p[defaultKey]);
                }
                if (defaultRows.length > 0) {
                  const defaultValue = defaultRows.map(p => {
                    return p[valueField];
                  });
                  if (defaultValue && defaultValue.length) {
                    let value = defaultValue;
                    const valueArrayTypes = [
                      "a-checkbox-group",
                      "a-radio-group"
                    ];
                    const isSeletctMultiple =
                      (itemRender.name == "a-select" &&
                        props &&
                        props.mode == "multiple") ||
                      valueArrayTypes.includes(itemRender.name);
                    if (!isSeletctMultiple) {
                      value = defaultValue[0];
                      defaultRows = defaultRows[0];
                    }
                    if (!isSeletctMultiple && props.linkage) {
                      if (props.linkage instanceof Array) {
                        props.linkage.forEach(linkItem => {
                          linkageFormData[linkItem.key] = utils.getObjData(
                            linkItem.value,
                            defaultRows
                          );
                        });
                      } else {
                        for (let linkItem in props.linkage) {
                          linkageFormData[linkItem] = utils.getObjData(
                            props.linkage[linkItem],
                            defaultRows
                          );
                        }
                      }
                    }
                    formData[item.field] = value;
                    defaultFormData[item.field] = defaultRows;
                    if (callback) {
                      formData = {
                        ...formData,
                        ...callback(item.field, defaultRows)
                      };
                    }
                  }
                }
              }
            }
          }
        }
      });
      const json = {
        ...defaultData,
        ...formData,
        ...linkageFormData
      };
      this.setData(json);
      return defaultFormData;
    },
    // 渲染的按钮点击事件
    onButtonClick(action, e) {
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
      this.$emit("buttonActionClick", action, e);
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
      this.$emit("folding", expand);
    },
    // 加载表单项的下拉数据
    loadItemOptionsData(field, params) {
      const formItem = this.itemsOptions.find(p => p.field === field);
      let itemProps = formItem.itemRender.props;
      if (itemProps.api || itemProps.param) {
        let api = "";
        if (itemProps.api) {
          api = itemProps.api;
        } else {
          api = DEFAULTCONFIG.getSelectOptions.api;
        }
        api({
          ...itemProps.param,
          ...params
        }).then(res => {
          const optionsData = handlefieldOptionsDataField(field, res, this);
          this.setFieldsOptions({ [field]: optionsData });
        });
      }
    }
  },
  render(h) {
    const { form, formLayout, currentColspan, readonly, onSubmit } = this;
    // ant design form的layout属性
    const antdLayouts = ["horizontal", "vertical", "inline"];
    // form表单的参数
    const formProps = {
      props: {
        ...DEFAULTCONFIG.props,
        form: form,
        layout: antdLayouts.includes(formLayout) ? formLayout : null
      },
      class: ["data-form", formLayout],
      style: {},
      on: {
        submit: onSubmit
      }
    };
    if (readonly) {
      formProps.class.push("readonly");
    }
    if (formLayout === "grid") {
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
