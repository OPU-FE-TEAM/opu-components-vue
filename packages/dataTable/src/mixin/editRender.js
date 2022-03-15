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
function editSlotPropInit(row, props, key, defaultKey = false) {
  return !props[key] && props[key] != 0
    ? defaultKey
    : typeof props[key] == "function"
    ? props[key](row)
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
      editDefaultOption: {}
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
    setEditOptions(data) {
      let { editOptions } = this;
      for (const key in data) {
        let item = data[key];
        editOptions[key] = item;
      }
      this.editOptions = editOptions;
      this.$refs.dataGrid.updateData();
    },
    getEditOptions() {
      return this.editOptions;
    },
    getEditDefaultOption() {
      return this.editDefaultOption;
    },
    editColumnsRender(data, filterCallback) {
      let { editType, editOptions, toHump, editDefaultOption } = this;
      let apiList = [];
      let getSelectOptions = config.getSelectOptions;
      data = data.filter(p => {
        if (filterCallback && !filterCallback(p)) {
          return false;
        }
        if (p.itemRender) {
          let name = toHump(p.itemRender.name || editType[0]);
          if (editType.indexOf(toHump(p.itemRender.name || editType[0])) > -1) {
            if (!p.slots) p.slots = {};
            p.slots.default = ({ row, rowIndex, $columnIndex }) => {
              return [
                <div style="display:flex;align-items: center;">
                  {p.itemRender.before &&
                    p.itemRender.before({ row, rowIndex, $columnIndex })}
                  <div style="flex:1">
                    {this.editSlotRender(name)({
                      row,
                      rowIndex,
                      $columnIndex
                    })}
                  </div>
                  {p.itemRender.after &&
                    p.itemRender.after({ row, rowIndex, $columnIndex })}
                </div>
              ];
            };
            if (name == "ASwitch" || name == "ACheckbox") p.align = "center";
            let props = p.itemRender.props || {};
            if (
              ["ASelect", "AAutoComplete"].includes(name) &&
              p.itemRender.props
            ) {
              const valueField =
                props.valueField || getSelectOptions.valueField;
              const labelField =
                props.labelField || getSelectOptions.labelField;
              const childrenField =
                props.childrenField || getSelectOptions.childrenField;
              const dataField = props.dataField || getSelectOptions.dataField;
              const defaultField =
                props.defaultField || getSelectOptions.defaultField;

              if (p.itemRender.props.options) {
                editOptions[p.field] = cloneDeep(
                  p.itemRender.props.options
                ).map(o => {
                  if (o.value && !o[config.originalValueKey]) {
                    o[config.originalValueKey] = o.value;
                  }
                  if (o[labelField] != "label") {
                    o.label = o[labelField];
                  }
                  if (o[valueField] != "value") {
                    o.value = o[valueField];
                  }
                  if (o[childrenField] != "children") {
                    o.children = o[childrenField];
                  }
                  if (o[defaultField]) {
                    editDefaultOption[p.field] = p.value;
                  }
                  return o;
                });
              } else if (
                !p.itemRender.props.optionsField &&
                !editOptions[p.field] &&
                (props.api || props.dataField || props.param)
              ) {
                apiList.push({
                  field: p.field,
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
      debugger;
      this.editOptions = editOptions;
      this.editApiList = apiList;
      this.fetchItemPropsOptionsApiList();
      return data;
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
            const {
              valueField,
              labelField,
              childrenField,
              defaultField
            } = item;
            // 字段单独配置api的可选数据的处理
            let optionsData = handlefieldOptionsDataField(
              item,
              res[index],
              that
            );
            editOptions[item.field] = optionsData.map(p => {
              if (p.value && !p[config.originalValueKey]) {
                p[config.originalValueKey] = p.value;
              }
              if (p[labelField] != "label") {
                p.label = p[labelField];
              }
              if (p[valueField] != "value") {
                p.value = p[valueField];
              }
              if (p[childrenField] != "children") {
                p.children = p[childrenField];
              }
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
            onOptionsLoadAfter({ editOptions, editDefaultOption });
          }

          that.$refs.dataGrid.updateData();
        })
        .catch(() => {});
    },
    selectFilterRender(props) {
      let getSelectOptions = config.getSelectOptions;
      const valueField = props.valueField || getSelectOptions.valueField;
      const labelField = props.labelField || getSelectOptions.labelField;
      const searchFields =
        props.searchFields || config.defaultProps.select.searchFields || [];
      if (props.showSearch && !props.filterOption) {
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
    autoCompleteFilterRender(props, row) {
      let getSelectOptions = config.getSelectOptions;
      let value = props.value;
      let dataSource = props.dataSource;
      delete props.dataSource;
      const valueField = props.valueField || getSelectOptions.labelField;
      const labelField = props.labelField || getSelectOptions.labelField;
      if (props.search) {
        dataSource = props.search(value, dataSource, row);
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
    editSlotRender(name) {
      let slot;
      switch (name) {
        case "AInput":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let disabled = editSlotPropInit(row, props, "disabled");
            if (typeof disabled == "object") {
              return [disabled];
            } else {
              return [
                <a-input
                  {...{
                    props: {
                      size: this.editItemSize,
                      ...props,
                      value: row[item.field],
                      disabled
                    },
                    on: {
                      ...itemRender.on,
                      change: e => {
                        let value = e.target.value;
                        row[item.field] = value;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(e, { row, rowIndex });
                        }
                      },
                      blur: e => {
                        if (itemRender.on && itemRender.on.blur) {
                          itemRender.on.blur(e, { row, rowIndex });
                        }
                      }
                    },
                    style: {
                      ...itemRender.style
                    }
                  }}
                />
              ];
            }
          };
          break;
        case "AInputNumber":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let disabled = editSlotPropInit(row, props, "disabled");
            if (typeof disabled == "object") {
              return [disabled];
            } else {
              return [
                <a-input-number
                  {...{
                    props: {
                      size: this.editItemSize,
                      ...props,
                      value: row[item.field],
                      disabled,
                      max: editSlotPropInit(row, props, "max", Infinity),
                      min: editSlotPropInit(row, props, "min", -Infinity)
                    },
                    on: {
                      ...itemRender.on,
                      change: e => {
                        let value = e;
                        row[item.field] = value;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(value, { row, rowIndex });
                        }
                      },
                      blur: e => {
                        if (itemRender.on && itemRender.on.blur) {
                          itemRender.on.blur(e, { row, rowIndex });
                        }
                      }
                    },
                    style: {
                      ...itemRender.style
                    }
                  }}
                />
              ];
            }
          };
          break;
        case "ASelect":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let optionsField = (props && props.optionsField) || "";
            let disabled = editSlotPropInit(row, props, "disabled");
            if (typeof disabled == "object") {
              return [disabled];
            } else {
              let value = row[item.field];
              let options = optionsField
                ? row[optionsField]
                : this.editOptions[item.field];
              if (props.optionsFilter) {
                options = props.optionsFilter(cloneDeep(options), value);
              }
              props = this.selectFilterRender({
                size: this.editItemSize,
                ...config.defaultProps.select,
                ...itemRender.props,
                value,
                options: options,
                disabled
              });
              return [
                <a-select
                  {...{
                    props,
                    style: {
                      width: "100%",
                      ...itemRender.style
                    },
                    on: {
                      ...itemRender.on,
                      change: (value, option) => {
                        row[item.field] = value;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(value, option, {
                            row,
                            rowIndex,
                            options
                          });
                        }
                      },
                      blur: e => {
                        if (itemRender.on && itemRender.on.blur) {
                          itemRender.on.blur(e, { row, rowIndex });
                        }
                      }
                    }
                  }}
                />
              ];
            }
          };
          break;
        case "AAutoComplete":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let optionsField = (props && props.optionsField) || "";
            let options = optionsField
              ? row[optionsField]
              : this.editOptions[item.field];
            let disabled = editSlotPropInit(row, props, "disabled");
            if (typeof disabled == "object") {
              return [disabled];
            } else {
              let value = row[item.field];
              if (props.optionsFilter) {
                options = props.optionsFilter(cloneDeep(options), value);
              }
              let filterData = this.autoCompleteFilterRender(
                {
                  size: this.editItemSize,
                  ...itemRender.props,
                  value,
                  dataSource: options || [],
                  disabled
                },
                row
              );
              let selectOptions = filterData.selectOptions;
              let dataSource = filterData.dataSource;
              props = filterData.props;
              return [
                <a-auto-complete
                  {...{
                    props,
                    style: {
                      width: "100%",
                      ...itemRender.style
                    },
                    on: {
                      ...itemRender.on,
                      change: value => {
                        row[item.field] = value;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(value);
                        }
                      },
                      select: value => {
                        let optionRow = this.findOptionRow(
                          dataSource,
                          value,
                          filterData.valueField
                        );
                        row[item.field] =
                          optionRow[filterData.labelField] || value;
                        if (itemRender.on && itemRender.on.select) {
                          itemRender.on.select(value, optionRow, {
                            row,
                            rowIndex,
                            dataSource
                          });
                        }
                      },
                      blur: e => {
                        if (itemRender.on && itemRender.on.blur) {
                          itemRender.on.blur(e, { row, rowIndex });
                        }
                      }
                    }
                  }}
                >
                  <template {...{ slot: "dataSource" }}>
                    {selectOptions}
                  </template>
                </a-auto-complete>
              ];
            }
          };
          break;
        case "ADatePicker":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let disabled = editSlotPropInit(row, props, "disabled");
            if (typeof disabled == "object") {
              return [disabled];
            } else {
              return [
                <a-date-picker
                  {...{
                    props: {
                      size: this.editItemSize,
                      ...itemRender.props,
                      value: !row[item.field]
                        ? null
                        : row[item.field].format
                        ? row[item.field]
                        : moment(row[item.field]),
                      disabled
                    },
                    on: {
                      ...itemRender.on,
                      change: e => {
                        let value = e;
                        row[item.field] = value;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(e, { row, rowIndex });
                        }
                      },
                      blur: e => {
                        if (itemRender.on && itemRender.on.blur) {
                          itemRender.on.blur(e, { row, rowIndex });
                        }
                      }
                    },
                    style: {
                      ...itemRender.style
                    }
                  }}
                />
              ];
            }
          };
          break;
        case "ATimePicker":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let disabled = editSlotPropInit(row, props, "disabled");
            if (typeof disabled == "object") {
              return [disabled];
            } else {
              return [
                <a-time-picker
                  {...{
                    props: {
                      size: this.editItemSize,
                      clearIcon: true,
                      ...itemRender.props,
                      value: row[item.field],
                      disabled
                    },
                    on: {
                      ...item.on,
                      change: e => {
                        let value = e;
                        row[item.field] = value;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(e, { row, rowIndex });
                        }
                      },
                      blur: e => {
                        if (itemRender.on && itemRender.on.blur) {
                          itemRender.on.blur(e, { row, rowIndex });
                        }
                      }
                    },
                    style: {
                      ...itemRender.style
                    }
                  }}
                />
              ];
            }
          };
          break;
        case "ASwitch":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let trueValue = props.trueValue ? props.trueValue : true;
            let falseValue = props.falseValue ? props.falseValue : false;
            if (editSlotPropInit(row, props, "hidden")) return "";
            let disabled = editSlotPropInit(row, props, "disabled");
            if (typeof disabled == "object") {
              return [disabled];
            } else {
              return [
                <a-switch
                  {...{
                    props: {
                      size: this.editItemSize,
                      ...itemRender.props,
                      checked: row[item.field] == trueValue,
                      disabled
                    },
                    on: {
                      ...item.on,
                      change: e => {
                        let value = e ? trueValue : falseValue;
                        row[item.field] = value;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(e, { row, rowIndex });
                        }
                      },
                      blur: e => {
                        if (itemRender.on && itemRender.on.blur) {
                          itemRender.on.blur(e, { row, rowIndex });
                        }
                      }
                    },
                    style: {
                      ...itemRender.style
                    }
                  }}
                />
              ];
            }
          };
          break;
        case "ACheckbox":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let trueValue = props.trueValue ? props.trueValue : true;
            let falseValue = props.falseValue ? props.falseValue : false;
            if (editSlotPropInit(row, props, "hidden")) return "";
            let disabled = editSlotPropInit(row, props, "disabled");
            if (typeof disabled == "object") {
              return [disabled];
            } else {
              return [
                <a-checkbox
                  {...{
                    props: {
                      size: this.editItemSize,
                      ...itemRender.props,
                      checked: row[item.field] == trueValue,
                      disabled
                    },
                    on: {
                      ...item.on,
                      change: e => {
                        let value = e.target.checked ? trueValue : falseValue;
                        row[item.field] = value;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(e, { row, rowIndex });
                        }
                      },
                      blur: e => {
                        if (itemRender.on && itemRender.on.blur) {
                          itemRender.on.blur(e, { row, rowIndex });
                        }
                      }
                    },
                    style: {
                      ...itemRender.style
                    }
                  }}
                />
              ];
            }
          };
          break;
      }
      return slot;
    }
  }
};

export default editRender;
