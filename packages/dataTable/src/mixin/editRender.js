import moment from "moment";
import { cloneDeep } from "lodash";
import utils from "../../../utils";
import config from "../../conf";

function handlefieldOptionsDataField(item, json) {
  let optionData = json;
  if (item) {
    const df =
      item.dataField != undefined
        ? item.dataField
        : config.getSelectOptions.dataField;
    optionData = utils.getObjData(df, json);
  }
  return optionData;
}

//编辑插槽 是否禁用
function editSlotPropInit(row, props, key, field, defaultKey = false) {
  return !props[key] && props[key] != 0
    ? defaultKey
    : typeof props[key] == "function"
    ? props[key](row, field)
    : props[key];
}

const editRender = {
  components: {},
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
        "AInput",
        "AInputNumber",
        "ASelect",
        "AAutoComplete",
        "ADatePicker",
        "ATimePicker",
        "ASwitch",
        "ACheckbox"
      ],
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
    // 下划线转换驼峰
    toHump(name) {
      // eslint-disable-next-line no-useless-escape
      name = name.replace(/\-(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    // 驼峰转换下划线
    toLine(name) {
      return name.replace(/([A-Z])/g, "-$1").toLowerCase();
    },
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
    getFieldsOptions() {
      return this.editOptions;
    },
    getEditDefaultOption() {
      return this.editDefaultOption;
    },
    editColumnsRender(data, filterCallback) {
      let { editType, editOptions, toHump, editDefaultOption } = this;
      let apiList = [];
      let editFieldList = {};
      let getSelectOptions = config.getSelectOptions;
      data = data.filter(p => {
        if (filterCallback && !filterCallback(p)) {
          return false;
        }
        if (p.itemRender) {
          let name = toHump(p.itemRender.name || editType[0]);
          if (editType.indexOf(toHump(p.itemRender.name || editType[0])) > -1) {
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

            if (name == "ASwitch" || name == "ACheckbox") p.align = "center";
            let props = p.itemRender.props || {};
            if (
              ["ASelect", "AAutoComplete"].includes(name) &&
              p.itemRender.props
            ) {
              const field = p.field;
              const valueField =
                props.valueField || getSelectOptions.valueField;
              const labelField =
                props.labelField || getSelectOptions.labelField;
              const childrenField =
                props.childrenField || getSelectOptions.childrenField;
              const dataField = props.dataField || getSelectOptions.dataField;
              const defaultField =
                props.defaultField || getSelectOptions.defaultField;

              const searchFields =
                props.searchFields ||
                config.defaultProps.select.searchFields ||
                [];

              editFieldList[field] = {
                valueField,
                labelField,
                childrenField,
                defaultField,
                searchFields
              };
              if (p.itemRender.props.options) {
                editOptions[field] = cloneDeep(p.itemRender.props.options).map(
                  o => {
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
                  }
                );
              } else if (
                !p.itemRender.props.optionsField &&
                !editOptions[field] &&
                (props.api || props.dataField || props.param)
              ) {
                apiList.push({
                  field,
                  api: props.api || getSelectOptions.api,
                  valueField,
                  labelField,
                  childrenField,
                  dataField,
                  defaultField,
                  param: props.param || {}
                });
              }
            }
          }
        }
        return true;
      });
      this.editDefaultOption = editDefaultOption;
      this.editOptions = editOptions;
      this.editApiList = apiList;
      this.editFieldList = editFieldList;
      this.fetchItemPropsOptionsApiList();
      return data;
    },
    optionDataRender(o, field, pValue = "", editFieldList) {
      if (!editFieldList) editFieldList = this.editFieldList;
      if (editFieldList[field]) {
        let { labelField, valueField, childrenField } = editFieldList[field];
        if (o.value && !o[config.originalValueKey]) {
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
    fetchItemPropsOptionsApiList() {
      let that = this;
      let { onEditOptionsLoadBefore, editApiList: list } = that;
      if (onEditOptionsLoadBefore) {
        const beforeRes = onEditOptionsLoadBefore(list);
        if (beforeRes === false) {
          return false;
        } else if (beforeRes) {
          list = beforeRes;
        }
      }

      let promises = list.map(p => p.api(p.param));
      Promise.all(promises)
        .then(res => {
          let { editOptions, editDefaultOption, onOptionsLoadAfter } = that;
          list.forEach((item, index) => {
            const { defaultField } = item;
            // 字段单独配置api的可选数据的处理
            let optionsData = handlefieldOptionsDataField(
              item,
              res[index],
              that
            );
            editOptions[item.field] = optionsData.map(p => {
              p = this.optionDataRender(p, item.field);
              if (p[defaultField]) {
                editDefaultOption[item.field] = p.value;
              }
              return p;
            });
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
        })
        .catch(() => {});
    },
    selectFilterRender(props, field) {
      if (
        this.editFieldList[field] &&
        props.showSearch &&
        !props.filterOption
      ) {
        let { labelField, valueField, searchFields } = this.editFieldList[
          field
        ];
        let optionsData = props.options || [];
        props.filterOption = (input, option) => {
          const value = option.componentOptions.propsData.value;
          const objIndex = optionsData.findIndex(
            p => p[valueField].toString() === value
          );
          const obj = optionsData[objIndex];
          let is = false;
          let searchFieldList = [labelField, ...searchFields];
          // vF,
          for (let i = 0; i < searchFieldList.length; i++) {
            const key = searchFieldList[i];
            if (obj[key]) {
              if (
                obj[key]
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              ) {
                is = true;
                break;
              }
            }
          }
          return is;
        };
      }
      return props;
    },
    autoCompleteFilterRender(props, row, field) {
      let value = props.value;
      let dataSource = props.dataSource;
      delete props.dataSource;
      let { labelField, valueField } = this.editFieldList[field];
      if (props.search) {
        dataSource = props.search(value, dataSource, row, field);
      } else {
        const searchFields = props.searchFields || [];
        dataSource = dataSource.filter(p => {
          if (!value) return true;
          let is = false;
          if (Object.prototype.toString.call(p) === "[object Object]") {
            let searchFieldList = [labelField, ...searchFields];
            // vF,
            for (let i = 0; i < searchFieldList.length; i++) {
              const key = searchFieldList[i];
              let optionValue = p[key] || p;
              if (value) {
                if (
                  optionValue
                    .toString()
                    .toLowerCase()
                    .indexOf(value.toLowerCase()) >= 0
                ) {
                  is = true;
                  break;
                }
              }
            }
          } else if (
            p
              .toString()
              .toLowerCase()
              .indexOf(value.toLowerCase()) >= 0
          ) {
            is = true;
          }
          return is;
        });
      }
      const selectOptions = dataSource.map(p => {
        return (
          <a-select-option key={p[valueField] || p}>
            {p[labelField] || p}
          </a-select-option>
        );
      });
      return { props, selectOptions, dataSource, valueField, labelField };
    },
    findOptionRow(options, value, valueField) {
      return options.find(p => p[valueField] == value) || {};
    },
    //插槽class  style 等重写
    editSlotItemRender(name, e) {
      if (typeof name == "function") {
        return name(e);
      } else {
        return name;
      }
    },
    editSlotRender(name) {
      return event => {
        let { columnIndex, row } = event;
        let item = this.tableColumns[columnIndex];
        let itemRender = item.itemRender || {};
        let props = itemRender.props || {};
        let disabled = editSlotPropInit(row, props, "disabled", item.field);
        let element;
        if (typeof disabled == "object") {
          return [disabled];
        } else {
          let field = item.field;
          event.field = field;
          props = {
            size: this.editItemSize,
            ...props,
            value: utils.getObjData(field, row),
            disabled
          };
          let attr = {
            class: this.editSlotItemRender(itemRender.class, event),
            style: this.editSlotItemRender(itemRender.style, event)
          };

          var optionsField, options, trueValue, falseValue;

          let ons = {
            ...itemRender.on,
            change: e => {
              utils.setObjData(field, row, e);
              // row[field] = e;
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
            case "AInput":
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
                        // row[field] = value;
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(e, event);
                        }
                      },
                      keydown: e => {
                        if (itemRender.on && itemRender.on.keydown) {
                          itemRender.on.keydown(e, event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "AInputNumber":
              element = (
                <a-input-number
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      max: editSlotPropInit(row, props, "max", field, Infinity),
                      min: editSlotPropInit(row, props, "min", field, -Infinity)
                    },
                    on: {
                      ...ons,
                      change: e => {
                        let value = e;
                        utils.setObjData(field, row, value);
                        // row[field] = value;
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(value, event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "ASelect":
              optionsField = (props && props.optionsField) || "";
              options = optionsField
                ? row[optionsField]
                : this.editOptions[field];
              if (props.optionsFilter) {
                options = props.optionsFilter(cloneDeep(options), props.value);
              }
              props = this.selectFilterRender(
                {
                  ...props,
                  options: options
                },
                field
              );
              element = (
                <a-select
                  {...{
                    ...attr,
                    props,
                    style: {
                      width: "100%",
                      ...attr.style
                    },
                    on: {
                      ...ons,
                      change: value => {
                        utils.setObjData(field, row, value);
                        // row[field] = value;
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          let { valueField } = this.editFieldList[field];
                          const row = options.find(p => p[valueField] == value);
                          let pRow;
                          if (row && row._pValue) {
                            pRow = options.find(
                              p => p[valueField] == row._pValue
                            );
                          }
                          itemRender.on.change(value, row, event, pRow);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "AAutoComplete":
              optionsField = (props && props.optionsField) || "";
              options = optionsField
                ? row[optionsField]
                : this.editOptions[field];
              if (props.optionsFilter) {
                options = props.optionsFilter(cloneDeep(options), props.value);
              }
              var filterData = this.autoCompleteFilterRender(
                {
                  size: this.editItemSize,
                  ...props,
                  dataSource: options || [],
                  disabled
                },
                row,
                field
              );
              var selectOptions = filterData.selectOptions;
              var dataSource = filterData.dataSource;
              props = filterData.props;
              element = (
                <a-auto-complete
                  {...{
                    ...attr,
                    props,
                    style: {
                      width: "100%",
                      ...itemRender.style
                    },
                    on: {
                      ...ons,
                      select: value => {
                        let optionRow = this.findOptionRow(
                          dataSource,
                          value,
                          filterData.valueField
                        );
                        utils.setObjData(
                          field,
                          row,
                          optionRow[filterData.labelField] || value
                        );
                        // row[field] = optionRow[filterData.labelField] || value;
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.select) {
                          itemRender.on.select(value, optionRow, event);
                        }
                      }
                    }
                  }}
                >
                  <template {...{ slot: "dataSource" }}>
                    {selectOptions}
                  </template>
                </a-auto-complete>
              );
              break;
            case "ADatePicker":
              var dateValue = !props.value
                ? null
                : props.value.format
                ? props.value
                : moment(props.value);
              element = (
                <a-date-picker
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      value: dateValue
                    },
                    on: {
                      ...ons
                    }
                  }}
                />
              );
              break;
            case "ATimePicker":
              element = (
                <a-time-picker
                  {...{
                    ...attr,
                    props: {
                      clearIcon: true,
                      ...props,
                      disabled
                    },
                    on: {
                      ...ons
                    }
                  }}
                />
              );
              break;
            case "ASwitch":
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
                        // row[field] = value;
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
            case "ACheckbox":
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
                        // row[field] = value;
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
