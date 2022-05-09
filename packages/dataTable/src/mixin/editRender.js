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
            p.slots.default = ({ row, rowIndex, columnIndex }) => {
              return [
                <div style="display:flex;align-items: center;">
                  {p.itemRender.before &&
                    p.itemRender.before({ row, rowIndex, columnIndex })}
                  <div style="flex:1">
                    {this.editSlotRender(name)({
                      row,
                      rowIndex,
                      columnIndex
                    })}
                  </div>
                  {p.itemRender.after &&
                    p.itemRender.after({ row, rowIndex, columnIndex })}
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
                  if (labelField != "label") {
                    o.label = o[labelField];
                  }
                  if (valueField != "value") {
                    o.value = o[valueField];
                  }
                  if (childrenField != "children") {
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
          event.field = item.field;
          props = {
            size: this.editItemSize,
            ...props,
            value: row[item.field],
            disabled
          };
          let attr = {
            class: this.editSlotItemRender(itemRender.class, event),
            style: this.editSlotItemRender(itemRender.style, event)
          };

          var optionsField, value, options, trueValue, falseValue;

          let ons = {
            change: e => {
              row[item.field] = e;
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
                      ...itemRender.on,
                      ...ons,
                      change: e => {
                        let value = e.target.value;
                        row[item.field] = value;
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
                    },
                    style: {
                      ...itemRender.style
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
                      max: editSlotPropInit(
                        row,
                        props,
                        "max",
                        item.field,
                        Infinity
                      ),
                      min: editSlotPropInit(
                        row,
                        props,
                        "min",
                        item.field,
                        -Infinity
                      )
                    },
                    on: {
                      ...itemRender.on,
                      ...ons,
                      change: e => {
                        let value = e;
                        row[item.field] = value;
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(value, event);
                        }
                      },
                      blur: e => {
                        if (itemRender.on && itemRender.on.blur) {
                          itemRender.on.blur(e, event);
                        }
                      }
                    }
                  }}
                />
              );
              break;
            case "ASelect":
              optionsField = (props && props.optionsField) || "";
              value = row[item.field];
              options = optionsField
                ? row[optionsField]
                : this.editOptions[item.field];
              if (props.optionsFilter) {
                options = props.optionsFilter(cloneDeep(options), value);
              }
              props = this.selectFilterRender({
                ...props,
                ...config.defaultProps.select,
                options: options
              });
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
                      ...itemRender.on,
                      ...ons,
                      change: (value, option) => {
                        row[item.field] = value;
                        row.ISEDIT = true;
                        if (itemRender.on && itemRender.on.change) {
                          itemRender.on.change(value, option, event);
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
                : this.editOptions[item.field];
              value = row[item.field];
              if (props.optionsFilter) {
                options = props.optionsFilter(cloneDeep(options), value);
              }
              var filterData = this.autoCompleteFilterRender(
                {
                  size: this.editItemSize,
                  ...itemRender.props,
                  value,
                  dataSource: options || [],
                  disabled
                },
                row
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
                      ...itemRender.on,
                      ...ons,
                      select: value => {
                        let optionRow = this.findOptionRow(
                          dataSource,
                          value,
                          filterData.valueField
                        );
                        row[item.field] =
                          optionRow[filterData.labelField] || value;
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
              element = (
                <a-date-picker
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      value: !row[item.field]
                        ? null
                        : row[item.field].format
                        ? row[item.field]
                        : moment(row[item.field])
                    },
                    on: {
                      ...itemRender.on,
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
                      value: row[item.field],
                      disabled
                    },
                    on: {
                      ...item.on,
                      ...ons
                    }
                  }}
                />
              );
              break;
            case "ASwitch":
              trueValue = props.trueValue ? props.trueValue : true;
              falseValue = props.falseValue ? props.falseValue : false;
              if (editSlotPropInit(row, props, "hidden", item.field)) return "";
              element = (
                <a-switch
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      checked: row[item.field] == trueValue
                    },
                    on: {
                      ...itemRender.on,
                      ...ons,
                      change: e => {
                        let value = e ? trueValue : falseValue;
                        row[item.field] = value;
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
              if (editSlotPropInit(row, props, "hidden", item.field)) return "";
              element = (
                <a-checkbox
                  {...{
                    ...attr,
                    props: {
                      ...props,
                      checked: row[item.field] == trueValue
                    },
                    on: {
                      ...itemRender.on,
                      ...ons,
                      change: e => {
                        let value = e.target.checked ? trueValue : falseValue;
                        row[item.field] = value;
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
    // editSlotRender1(name) {
    //   let slot;
    //   switch (name) {
    //     case "AInput":
    //       slot = event => {
    //         let { columnIndex, row } = event;
    //         let item = this.tableColumns[columnIndex];
    //         let itemRender = item.itemRender || {};
    //         let props = itemRender.props || {};
    //         let disabled = editSlotPropInit(row, props, "disabled", item.field);
    //         if (typeof disabled == "object") {
    //           return [disabled];
    //         } else {
    //           event.field = item.field;
    //           return [
    //             <a-input
    //               {...{
    //                 props: {
    //                   size: this.editItemSize,
    //                   ...props,
    //                   value: row[item.field],
    //                   disabled
    //                 },
    //                 on: {
    //                   ...itemRender.on,
    //                   change: e => {
    //                     let value = e.target.value;
    //                     row[item.field] = value;
    //                     row.ISEDIT = true;
    //                     if (itemRender.on && itemRender.on.change) {
    //                       itemRender.on.change(e, event);
    //                     }
    //                   },
    //                   blur: e => {
    //                     if (itemRender.on && itemRender.on.blur) {
    //                       itemRender.on.blur(e, event);
    //                     }
    //                   },
    //                   keydown: e => {
    //                     if (itemRender.on && itemRender.on.keydown) {
    //                       itemRender.on.keydown(e, event);
    //                     }
    //                   }
    //                 },
    //                 style: {
    //                   ...itemRender.style
    //                 }
    //               }}
    //             />
    //           ];
    //         }
    //       };
    //       break;
    //     case "AInputNumber":
    //       slot = event => {
    //         let { columnIndex, row } = event;
    //         let item = this.tableColumns[columnIndex];
    //         let itemRender = item.itemRender || {};
    //         let props = itemRender.props || {};
    //         let disabled = editSlotPropInit(row, props, "disabled", item.field);
    //         if (typeof disabled == "object") {
    //           return [disabled];
    //         } else {
    //           event.field = item.field;
    //           return [
    //             <a-input-number
    //               {...{
    //                 style: itemRender.style,
    //                 props: {
    //                   size: this.editItemSize,
    //                   ...props,
    //                   value: row[item.field],
    //                   disabled,
    //                   max: editSlotPropInit(
    //                     row,
    //                     props,
    //                     "max",
    //                     item.field,
    //                     Infinity
    //                   ),
    //                   min: editSlotPropInit(
    //                     row,
    //                     props,
    //                     "min",
    //                     item.field,
    //                     -Infinity
    //                   )
    //                 },
    //                 on: {
    //                   ...itemRender.on,
    //                   change: e => {
    //                     let value = e;
    //                     row[item.field] = value;
    //                     row.ISEDIT = true;
    //                     if (itemRender.on && itemRender.on.change) {
    //                       itemRender.on.change(value, event);
    //                     }
    //                   },
    //                   blur: e => {
    //                     if (itemRender.on && itemRender.on.blur) {
    //                       itemRender.on.blur(e, event);
    //                     }
    //                   }
    //                 },
    //                 class: this.editSlotItemRender(itemRender.class, event)
    //               }}
    //             />
    //           ];
    //         }
    //       };
    //       break;
    //     case "ASelect":
    //       slot = ({ row, rowIndex, columnIndex }) => {
    //         let item = this.tableColumns[columnIndex];
    //         let itemRender = item.itemRender || {};
    //         let props = itemRender.props || {};
    //         let disabled = editSlotPropInit(row, props, "disabled", item.field);
    //         if (typeof disabled == "object") {
    //           return [disabled];
    //         } else {
    //           let optionsField = (props && props.optionsField) || "";
    //           let value = row[item.field];
    //           let options = optionsField
    //             ? row[optionsField]
    //             : this.editOptions[item.field];
    //           if (props.optionsFilter) {
    //             options = props.optionsFilter(cloneDeep(options), value);
    //           }
    //           props = this.selectFilterRender({
    //             size: this.editItemSize,
    //             ...config.defaultProps.select,
    //             ...itemRender.props,
    //             value,
    //             options: options,
    //             disabled
    //           });
    //           return [
    //             <a-select
    //               {...{
    //                 props,
    //                 style: {
    //                   width: "100%",
    //                   ...itemRender.style
    //                 },
    //                 on: {
    //                   ...itemRender.on,
    //                   change: (value, option) => {
    //                     row[item.field] = value;
    //                     row.ISEDIT = true;
    //                     if (itemRender.on && itemRender.on.change) {
    //                       itemRender.on.change(value, option, {
    //                         row,
    //                         rowIndex,
    //                         options,
    //                         field: item.field
    //                       });
    //                     }
    //                   },
    //                   blur: e => {
    //                     if (itemRender.on && itemRender.on.blur) {
    //                       itemRender.on.blur(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   }
    //                 }
    //               }}
    //             />
    //           ];
    //         }
    //       };
    //       break;
    //     case "AAutoComplete":
    //       slot = ({ row, rowIndex, columnIndex }) => {
    //         let item = this.tableColumns[columnIndex];
    //         let itemRender = item.itemRender || {};
    //         let props = itemRender.props || {};
    //         let disabled = editSlotPropInit(row, props, "disabled", item.field);
    //         if (typeof disabled == "object") {
    //           return [disabled];
    //         } else {
    //           let optionsField = (props && props.optionsField) || "";
    //           let options = optionsField
    //             ? row[optionsField]
    //             : this.editOptions[item.field];
    //           let value = row[item.field];
    //           if (props.optionsFilter) {
    //             options = props.optionsFilter(cloneDeep(options), value);
    //           }
    //           let filterData = this.autoCompleteFilterRender(
    //             {
    //               size: this.editItemSize,
    //               ...itemRender.props,
    //               value,
    //               dataSource: options || [],
    //               disabled
    //             },
    //             row
    //           );
    //           let selectOptions = filterData.selectOptions;
    //           let dataSource = filterData.dataSource;
    //           props = filterData.props;
    //           return [
    //             <a-auto-complete
    //               {...{
    //                 props,
    //                 style: {
    //                   width: "100%",
    //                   ...itemRender.style
    //                 },
    //                 on: {
    //                   ...itemRender.on,
    //                   change: value => {
    //                     row[item.field] = value;
    //                     row.ISEDIT = true;
    //                     if (itemRender.on && itemRender.on.change) {
    //                       itemRender.on.change(value, row, item.field);
    //                     }
    //                   },
    //                   select: value => {
    //                     let optionRow = this.findOptionRow(
    //                       dataSource,
    //                       value,
    //                       filterData.valueField
    //                     );
    //                     row[item.field] =
    //                       optionRow[filterData.labelField] || value;
    //                     row.ISEDIT = true;
    //                     if (itemRender.on && itemRender.on.select) {
    //                       itemRender.on.select(value, optionRow, {
    //                         row,
    //                         rowIndex,
    //                         dataSource,
    //                         field: item.field
    //                       });
    //                     }
    //                   },
    //                   blur: e => {
    //                     if (itemRender.on && itemRender.on.blur) {
    //                       itemRender.on.blur(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   }
    //                 }
    //               }}
    //             >
    //               <template {...{ slot: "dataSource" }}>
    //                 {selectOptions}
    //               </template>
    //             </a-auto-complete>
    //           ];
    //         }
    //       };
    //       break;
    //     case "ADatePicker":
    //       slot = ({ row, rowIndex, columnIndex }) => {
    //         let item = this.tableColumns[columnIndex];
    //         let itemRender = item.itemRender || {};
    //         let props = itemRender.props || {};
    //         let disabled = editSlotPropInit(row, props, "disabled", item.field);
    //         if (typeof disabled == "object") {
    //           return [disabled];
    //         } else {
    //           return [
    //             <a-date-picker
    //               {...{
    //                 props: {
    //                   size: this.editItemSize,
    //                   ...itemRender.props,
    //                   value: !row[item.field]
    //                     ? null
    //                     : row[item.field].format
    //                     ? row[item.field]
    //                     : moment(row[item.field]),
    //                   disabled
    //                 },
    //                 on: {
    //                   ...itemRender.on,
    //                   change: e => {
    //                     let value = e;
    //                     row[item.field] = value;
    //                     row.ISEDIT = true;
    //                     if (itemRender.on && itemRender.on.change) {
    //                       itemRender.on.change(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   },
    //                   blur: e => {
    //                     if (itemRender.on && itemRender.on.blur) {
    //                       itemRender.on.blur(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   }
    //                 },
    //                 style: {
    //                   ...itemRender.style
    //                 }
    //               }}
    //             />
    //           ];
    //         }
    //       };
    //       break;
    //     case "ATimePicker":
    //       slot = ({ row, rowIndex, columnIndex }) => {
    //         let item = this.tableColumns[columnIndex];
    //         let itemRender = item.itemRender || {};
    //         let props = itemRender.props || {};
    //         let disabled = editSlotPropInit(row, props, "disabled", item.field);
    //         if (typeof disabled == "object") {
    //           return [disabled];
    //         } else {
    //           return [
    //             <a-time-picker
    //               {...{
    //                 props: {
    //                   size: this.editItemSize,
    //                   clearIcon: true,
    //                   ...itemRender.props,
    //                   value: row[item.field],
    //                   disabled
    //                 },
    //                 on: {
    //                   ...item.on,
    //                   change: e => {
    //                     let value = e;
    //                     row[item.field] = value;
    //                     row.ISEDIT = true;
    //                     if (itemRender.on && itemRender.on.change) {
    //                       itemRender.on.change(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   },
    //                   blur: e => {
    //                     if (itemRender.on && itemRender.on.blur) {
    //                       itemRender.on.blur(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   }
    //                 },
    //                 style: {
    //                   ...itemRender.style
    //                 }
    //               }}
    //             />
    //           ];
    //         }
    //       };
    //       break;
    //     case "ASwitch":
    //       slot = ({ row, rowIndex, columnIndex }) => {
    //         let item = this.tableColumns[columnIndex];
    //         let itemRender = item.itemRender || {};
    //         let props = itemRender.props || {};
    //         let trueValue = props.trueValue ? props.trueValue : true;
    //         let falseValue = props.falseValue ? props.falseValue : false;
    //         if (editSlotPropInit(row, props, "hidden", item.field)) return "";
    //         let disabled = editSlotPropInit(row, props, "disabled", item.field);
    //         if (typeof disabled == "object") {
    //           return [disabled];
    //         } else {
    //           return [
    //             <a-switch
    //               {...{
    //                 props: {
    //                   size: this.editItemSize,
    //                   ...itemRender.props,
    //                   checked: row[item.field] == trueValue,
    //                   disabled
    //                 },
    //                 on: {
    //                   ...item.on,
    //                   change: e => {
    //                     let value = e ? trueValue : falseValue;
    //                     row[item.field] = value;
    //                     row.ISEDIT = true;
    //                     if (itemRender.on && itemRender.on.change) {
    //                       itemRender.on.change(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   },
    //                   blur: e => {
    //                     if (itemRender.on && itemRender.on.blur) {
    //                       itemRender.on.blur(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   }
    //                 },
    //                 style: {
    //                   ...itemRender.style
    //                 }
    //               }}
    //             />
    //           ];
    //         }
    //       };
    //       break;
    //     case "ACheckbox":
    //       slot = ({ row, rowIndex, columnIndex }) => {
    //         let item = this.tableColumns[columnIndex];
    //         let itemRender = item.itemRender || {};
    //         let props = itemRender.props || {};
    //         let trueValue = props.trueValue ? props.trueValue : true;
    //         let falseValue = props.falseValue ? props.falseValue : false;
    //         if (editSlotPropInit(row, props, "hidden", item.field)) return "";
    //         let disabled = editSlotPropInit(row, props, "disabled", item.field);
    //         if (typeof disabled == "object") {
    //           return [disabled];
    //         } else {
    //           return [
    //             <a-checkbox
    //               {...{
    //                 props: {
    //                   size: this.editItemSize,
    //                   ...itemRender.props,
    //                   checked: row[item.field] == trueValue,
    //                   disabled
    //                 },
    //                 on: {
    //                   ...item.on,
    //                   change: e => {
    //                     let value = e.target.checked ? trueValue : falseValue;
    //                     row[item.field] = value;
    //                     row.ISEDIT = true;
    //                     if (itemRender.on && itemRender.on.change) {
    //                       itemRender.on.change(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   },
    //                   blur: e => {
    //                     if (itemRender.on && itemRender.on.blur) {
    //                       itemRender.on.blur(e, {
    //                         row,
    //                         rowIndex,
    //                         field: item.field
    //                       });
    //                     }
    //                   }
    //                 },
    //                 style: {
    //                   ...itemRender.style
    //                 }
    //               }}
    //             />
    //           ];
    //         }
    //       };
    //       break;
    //   }
    //   return slot;
    // }
  }
};

export default editRender;
