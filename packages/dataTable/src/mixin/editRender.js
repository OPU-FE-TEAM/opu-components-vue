import moment from "moment";
import { cloneDeep } from "lodash";
import utils from "../../../utils";
import config from "../../conf";
import OpuSelect from "../../../dataForm/src/select";
import OpuDatePicker from "../../../dataForm/src/datePicker";
import OpuTimePicker from "../../../dataForm/src/timePicker";
import OpuAutoComplete from "../../../dataForm/src/autoComplete";

// 请求表单项可选数据
const fetchItemPropsOptionsApiList = async function(_vm) {
  let that = _vm;
  let { onEditOptionsLoadBefore, editApiList, optionDataRender } = that;
  let list = editApiList;
  if (onEditOptionsLoadBefore) {
    const beforeRes = onEditOptionsLoadBefore(list);
    if (beforeRes === false) {
      return false;
    } else if (beforeRes) {
      list = beforeRes;
    }
  }

  let promises = list.map(p => {
    return p.api(p.param);
  });
  Promise.all(promises).then(res => {
    let { editOptions, editDefaultOption, onOptionsLoadAfter } = that;
    list.forEach((item, index) => {
      let { defaultField, field, fields } = item;
      let data = res[index];
      if (fields && fields.length) {
        fields.forEach(p => {
          const optionsData = handlefieldOptionsDataField(p, data, that);
          field = p.field;
          editOptions[field] = optionsData.map(o => {
            o = optionDataRender(o, field);
            if (o[defaultField]) {
              editDefaultOption[field] = o.value;
            }
            return o;
          });
        });
      } else {
        // 字段单独配置api的可选数据的处理
        let optionsData = handlefieldOptionsDataField(item, data, that);
        editOptions[field] = optionsData.map(p => {
          p = optionDataRender(p, field);
          if (p[defaultField]) {
            editDefaultOption[field] = p.value;
          }
          return p;
        });
      }
    });
    if (that.onOptionsAllLoad) {
      editOptions = that.onOptionsAllLoad(editOptions);
    }
    that.editOptions = editOptions;
    that.editDefaultOption = editDefaultOption;

    if (onOptionsLoadAfter) {
      onOptionsLoadAfter(editOptions, editDefaultOption);
    }

    that.$refs.dataGrid.updateData();
  });
};

// 驼峰转换下划线
function toLine(name) {
  name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
  return name[0] == "-" ? name.slice(1) : name;
}

//根据路径参数 查找对应数据
function handlefieldOptionsDataField(item, json) {
  let optionData = json;
  if (item) {
    const dataField =
      item.dataField != undefined
        ? item.dataField
        : config.getSelectOptions.dataField;
    optionData = utils.getObjData(dataField, json);
  }
  return optionData;
}

//插槽class  style 等重写
function editSlotItemRender(name, e) {
  if (typeof name == "function") {
    return name(e);
  } else {
    return name;
  }
}

//查询对应属性 根据属性类型做对应处理
function editSlotPropInit(row, props, key, field, defaultKey = false) {
  return !props[key] && props[key] != 0
    ? defaultKey
    : typeof props[key] == "function"
    ? props[key](row, field)
    : props[key];
}

const editRender = {
  components: {
    OpuSelect,
    OpuDatePicker,
    OpuTimePicker,
    OpuAutoComplete
  },
  props: {
    onEditOptionsLoadBefore: {
      type: Function,
      default: null
    },
    editSize: {
      type: String,
      default: ""
    },
    onOptionsLoadAfter: {
      type: Function,
      default: null
    },
    onOptionsAllLoad: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      editType: [
        "a-input",
        "a-input-number",
        "a-select",
        "a-auto-complete",
        "a-date-picker",
        "a-time-picker",
        "a-switch",
        "a-checkbox",
        "pulldown-table"
      ],
      componentsFocusItemTypes: [
        "a-input",
        "a-input-number",
        "a-select",
        "a-auto-complete",
        "a-date-picker",
        "a-time-picker",
        "pulldown-table"
      ],
      pressEnterItemIndexs: [],
      editOptions: {},
      editApiList: [],
      editDefaultOption: {},
      editFieldList: {}
    };
  },
  computed: {
    editItemSize() {
      let editSize = this.editSize;
      if (editSize === "") {
        editSize = config.editSize;
      }
      return editSize;
    }
  },
  methods: {
    /**
     * @description: 设置下拉数据
     * @param {*} data
     * @return {*}
     */
    setFieldsOptions(data) {
      let { editOptions, editFieldList } = this;
      for (const key in data) {
        let item = data[key];
        if (editFieldList[key]) {
          // editOptions[key] = item;
          editOptions[key] = item.map(p => this.optionDataRender(p, key));
        }
      }
      this.editOptions = editOptions;
      this.$refs.dataGrid.updateData();
    },
    /**
     * @description: 获取下拉数据
     * @param {*}
     * @return {*}
     */
    getFieldsOptions() {
      return this.editOptions;
    },
    /**
     * @description: 获取默认数据
     * @param {*}
     * @return {*}
     */
    getEditDefaultOption() {
      return this.editDefaultOption;
    },
    /**
     * @description: 重构下拉数据option
     * @param {*} o
     * @param {*} field
     * @param {*} pValue
     * @param {*} editFieldList
     * @return {*}
     */
    optionDataRender(o, field, pValue = "", editFieldList) {
      if (!editFieldList) editFieldList = this.editFieldList;
      if (editFieldList[field]) {
        let { labelField, valueField, childrenField } = editFieldList[field];
        if ((o.value || o.value == 0) && !o[config.originalValueKey]) {
          o[config.originalValueKey || "originalValueKey"] = o.value;
        }
        if (labelField != "label") {
          o.label = o[labelField];
        }
        if (valueField != "value") {
          o.value = o[valueField];
        }
        if (pValue) {
          o._pValue = pValue;
        }
        if (childrenField != "children" && o[childrenField].length > 0) {
          o.children = o[childrenField].map(p => {
            return this.optionDataRender(p, field, o.value);
          });
        }
      }
      return o;
    },
    /**
     * @description: 表格列重构
     * @param {*} data
     * @param {*} filterCallback
     * @return {*}
     */
    editColumnsRender(data, filterCallback) {
      let { editType, editOptions, editDefaultOption, editFieldList } = this;
      let otherApiList = [];
      let pressEnterItemIndexs = [];
      let getSelectOptions = config.getSelectOptions;
      let unifyApiList = {
        api:
          getSelectOptions && getSelectOptions.api
            ? getSelectOptions.api
            : config.getSelectOptions.api,
        param: {},
        fields: []
      };
      data = data.filter(p => {
        if (filterCallback && !filterCallback(p)) {
          return false;
        }
        if (p.itemRender) {
          let name = toLine(p.itemRender.name || editType[0]);
          if (editType.includes(name)) {
            if (!p.slots) p.slots = {};
            p.slots.default = e => {
              return [
                <div style="display:flex;align-items: center;">
                  {p.itemRender.before && p.itemRender.before(e)}
                  <div style="flex:1">{this.editSlotRender(name)(e)}</div>
                  {p.itemRender.after && p.itemRender.after(e)}
                </div>
              ];
            };
            pressEnterItemIndexs.push(p.field);

            if (name == "a-switch" || name == "a-checkbox") p.align = "center";
            let props = p.itemRender.props || {};
            if (["a-select", "a-auto-complete"].includes(name) && props) {
              const field = p.field;

              let valueField = props.valueField || getSelectOptions.valueField;
              let labelField = props.labelField || getSelectOptions.labelField;
              let childrenField =
                props.childrenField || getSelectOptions.childrenField;
              let dataField = props.dataField || getSelectOptions.dataField;
              let defaultField =
                props.defaultField || getSelectOptions.defaultField;
              let searchFields =
                props.searchFields ||
                config.defaultProps.select.searchFields ||
                [];

              if (
                !(
                  editFieldList[field] &&
                  props.api == editFieldList[field].api &&
                  utils.isEqual(editFieldList[field].param, props.param)
                )
              ) {
                editFieldList[field] = {
                  valueField,
                  labelField,
                  childrenField,
                  defaultField,
                  searchFields,
                  api: props.api,
                  param: props.param
                };

                if (props.options) {
                  editOptions[field] = cloneDeep(props.options).map(o => {
                    o = this.optionDataRender(o, field, "", {
                      [field]: {
                        valueField,
                        labelField,
                        childrenField
                      }
                    });
                    if (o[defaultField]) {
                      editDefaultOption[field] = p.value;
                    }
                    return o;
                  });
                } else if (
                  !props.optionsField &&
                  (props.api || props.dataField || props.param) &&
                  !editOptions[field]
                ) {
                  let item = {
                    field,
                    api: props.api,
                    valueField,
                    labelField,
                    childrenField,
                    dataField,
                    defaultField,
                    param: props.param || {}
                  };
                  if (props.api) {
                    otherApiList.push(item);
                  } else {
                    for (let key in props.param) {
                      if (
                        unifyApiList.param[key] &&
                        utils.isArray(unifyApiList.param[key])
                      ) {
                        unifyApiList.param[key].push(props.param[key]);
                      } else {
                        unifyApiList.param[key] = [props.param[key]];
                      }
                    }
                    unifyApiList.fields.push(item);
                  }
                }
              }
            }
          }
        }
        return true;
      });
      if (unifyApiList.fields.length > 0) {
        otherApiList = otherApiList.concat(unifyApiList);
      }

      this.editDefaultOption = editDefaultOption;
      this.pressEnterItemIndexs = pressEnterItemIndexs;
      this.editOptions = editOptions;

      this.editApiList = otherApiList;
      this.editFieldList = editFieldList;
      if (otherApiList.length > 0) {
        this.loadOptionsData();
      }
      return data;
    },
    loadOptionsData(isAll) {
      if (isAll) {
        this.setTableColumns(this.columns);
      } else {
        fetchItemPropsOptionsApiList(this);
      }
    },
    /**
     * @description: 选中下一个
     * @param {*}
     * @return {*}
     */
    nextItemFocus(event) {
      console.log(event, "enter-----------------------------------");
    },
    editSlotRender(name) {
      return event => {
        let that = this;
        let { currentCell } = that;
        currentCell = false;
        let { columnIndex, rowIndex, row } = event;
        let item = that.tableColumns[columnIndex];
        let itemRender = item.itemRender || {};
        let props = itemRender.props || {};
        let disabled = editSlotPropInit(row, props, "disabled", item.field);
        let element;
        if (typeof disabled == "object") {
          return [disabled];
        } else if (currentCell && currentCell.rowIndex != rowIndex) {
          return [utils.getObjData(item.field, row) || ""];
        } else {
          let field = item.field;
          event.field = field;
          props = {
            size: that.editItemSize,
            ...props,
            value: utils.getObjData(field, row),
            disabled
          };
          let attr = {
            class: editSlotItemRender(itemRender.class, event),
            style: editSlotItemRender(itemRender.style, event)
          };

          var optionsField, options, trueValue, falseValue;
          let ons = {
            ...itemRender.on,
            change: e => {
              utils.setObjData(field, row, e);
              row.ISEDIT = true;
              if (itemRender.on && itemRender.on.change) {
                itemRender.on.change(e, event);
              }
            },
            blur: e => {
              if (itemRender.on && itemRender.on.blur) {
                itemRender.on.blur(e, event);
              }
            }
          };

          switch (name) {
            case "a-input":
              element = (
                <a-input
                  {...{
                    ...attr,
                    props,
                    on: {
                      ...ons,
                      change: e => {
                        let value = e.target.value;
                        utils.setObjData(field, row, value);
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(e, event);
                        }
                      },
                      keydown: async e => {
                        let res = true;
                        if (itemRender.on && itemRender.on.keydown) {
                          res = await itemRender.on.keydown(e, event);
                        }
                        if (res && e.keyCode == 13) {
                          that.nextItemFocus(event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "a-input-number":
              element = (
                <a-input-number
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      max: editSlotPropInit(row, props, "max", field, Infinity),
                      min: editSlotPropInit(row, props, "min", field, -Infinity)
                    },
                    style: {
                      width: "100%",
                      ...attr.style
                    },
                    on: {
                      ...ons,
                      change: e => {
                        let value = e;
                        utils.setObjData(field, row, value);
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(value, event);
                        }
                      },
                      pressEnter: async e => {
                        let res = true;
                        if (itemRender.on && itemRender.on.keydown) {
                          res = await itemRender.on.pressEnter(e, event);
                        }
                        if (res) {
                          that.nextItemFocus(event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "a-select":
              optionsField = (props && props.optionsField) || "";
              options = optionsField
                ? row[optionsField]
                : that.editOptions[field];
              if (props.optionsFilter) {
                options = props.optionsFilter(
                  cloneDeep(options),
                  props.value,
                  event
                );
                delete props.optionsFilter;
              }
              element = (
                <OpuSelect
                  {...{
                    ...attr,
                    props: {
                      showSearch: true,
                      ...props,
                      options
                    },
                    style: {
                      width: "100%",
                      ...attr.style
                    },
                    on: {
                      ...ons,
                      change: (value, option, pOption) => {
                        utils.setObjData(field, row, value);
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(value, option, event, pOption);
                        }
                      },
                      inputKeydown: async e => {
                        let res = true;
                        if (itemRender.on && itemRender.on.keydown) {
                          res = await itemRender.on.inputKeydown(e, event);
                        }
                        if (res && e.keyCode == 13) {
                          that.nextItemFocus(event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "a-auto-complete":
              optionsField = (props && props.optionsField) || "";
              options = optionsField
                ? row[optionsField]
                : that.editOptions[field];
              if (props.optionsFilter) {
                options = props.optionsFilter(
                  cloneDeep(options),
                  props.value,
                  event
                );
                delete props.optionsFilter;
              }

              if (ons.search) {
                ons.saerch = (value, dataSource) => {
                  itemRender.on.search(value, dataSource, row, event);
                };
              }

              element = (
                <OpuAutoComplete
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      options
                    },
                    style: {
                      width: "100%",
                      ...itemRender.style
                    },
                    on: {
                      ...ons,
                      select: (value, optionRow) => {
                        utils.setObjData(
                          field,
                          row,
                          props.valueField ? optionRow[props.valueField] : value
                        );
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.select) {
                          itemRender.on.select(value, optionRow, event);
                        }
                      },
                      inputPressEnter: async e => {
                        let res = true;
                        if (itemRender.on && itemRender.on.keydown) {
                          res = await itemRender.on.inputPressEnter(e, event);
                        }
                        if (res) {
                          that.nextItemFocus(event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "a-date-picker":
              var dateValue = !props.value
                ? null
                : props.value.format
                ? props.value
                : moment(props.value);
              element = (
                <OpuDatePicker
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      value: dateValue
                    },
                    on: {
                      ...ons,
                      inputPressEnter: async e => {
                        let res = true;
                        if (itemRender.on && itemRender.on.keydown) {
                          res = await itemRender.on.inputPressEnter(e, event);
                        }
                        if (res) {
                          that.nextItemFocus(event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "a-time-picker":
              element = (
                <OpuTimePicker
                  {...{
                    ...attr,
                    props: {
                      clearIcon: true,
                      ...props,
                      disabled
                    },
                    on: {
                      ...ons,
                      inputPressEnter: async e => {
                        let res = true;
                        if (itemRender.on && itemRender.on.keydown) {
                          res = await itemRender.on.inputPressEnter(e, event);
                        }
                        if (res) {
                          that.nextItemFocus(event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "pulldown-table":
              element = (
                <pulldown-table
                  {...{
                    ...attr,
                    props: {
                      ...props
                    },
                    on: {
                      ...ons,
                      inputPressEnter: async e => {
                        let res = true;
                        if (itemRender.on && itemRender.on.keydown) {
                          res = await itemRender.on.inputPressEnter(e, event);
                        }
                        if (res) {
                          that.nextItemFocus(event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "a-switch":
              trueValue = props.trueValue ? props.trueValue : true;
              falseValue = props.falseValue ? props.falseValue : false;
              if (editSlotPropInit(row, props, "hidden", field)) return "";
              element = (
                <a-switch
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      checked: row[field] == trueValue
                    },
                    on: {
                      ...ons,
                      change: e => {
                        let value = e ? trueValue : falseValue;
                        utils.setObjData(field, row, value);
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(e, event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "a-checkbox":
              trueValue = props.trueValue ? props.trueValue : true;
              falseValue = props.falseValue ? props.falseValue : false;
              if (editSlotPropInit(row, props, "hidden", field)) return "";
              element = (
                <a-checkbox
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      checked: row[field] == trueValue
                    },
                    on: {
                      ...ons,
                      change: e => {
                        let value = e.target.checked ? trueValue : falseValue;
                        utils.setObjData(field, row, value);
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(e, event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
          }
        }
        return [element];
      };
    }
  }
};

export default editRender;
