import moment from "moment";
import utils from "../../../utils";
import config from "../../conf";

function handlefieldOptionsDataField(item, json) {
  let optionData = json;
  if (item && item.itemRender && item.itemRender.props) {
    const itemProps = item.itemRender.props;
    const df =
      itemProps.dataField != undefined
        ? itemProps.dataField
        : config.getSelectOptions.dataField;
    optionData = utils.getObjData(df, json);
  }
  return optionData;
}

//编辑插槽 是否禁用
function editSlotDisabled(row, props) {
  return !props.disabled
    ? false
    : typeof props.disabled == "function"
    ? props.disabled(row)
    : props.disabled;
}

//编辑插槽 是否禁用
function editSlotHidden(row, props) {
  return !props.hidden
    ? false
    : typeof props.hidden == "function"
    ? props.hidden(row)
    : props.hidden;
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
    }
  },
  data() {
    return {
      editType: [
        "AInput",
        "AInputNumber",
        "ASelect",
        "ADatePicker",
        "ATimePicker",
        "ASwitch",
        "ACheckbox"
      ],
      editOptions: {},
      editApiList: []
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
    editColumnsRender(data, filterCallback) {
      let { editType, editOptions, toHump } = this;
      let apiList = [];
      let getSelectOptions = config.getSelectOptions;
      data = data.filter(p => {
        if (filterCallback && !filterCallback(p)) {
          return false;
        }
        if (p.itemRender) {
          let name = toHump(p.itemRender.name || editType[0]);
          if (editType.indexOf(toHump(p.itemRender.name || editType[0])) > -1) {
            p.slots = {
              default: this.editSlotRender(name)
            };
            if (name == "ASwitch" || name == "ACheckbox") p.align = "center";
            let props = p.itemRender.props || {};
            if (
              name == "ASelect" &&
              p.itemRender.props &&
              !p.itemRender.optionsField &&
              !editOptions[p.field] &&
              (props.api || getSelectOptions.api)
            ) {
              apiList.push({
                field: p.field,
                api: props.api || getSelectOptions.api,
                valueField: props.valueField || getSelectOptions.valueField,
                labelField: props.labelField || getSelectOptions.labelField,
                childrenField:
                  props.childrenField || getSelectOptions.childrenField,
                dataField: props.dataField || getSelectOptions.dataField
              });
            }
          }
        }
        return true;
      });
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

      let promises = list.map(p => p.api());
      Promise.all(promises)
        .then(res => {
          let { editOptions } = that;
          list.forEach((item, index) => {
            const { valueField, labelField, childrenField } = item;
            // 字段单独配置api的可选数据的处理
            let optionsData = handlefieldOptionsDataField(
              item,
              res[index],
              that
            );
            editOptions[item.field] = optionsData.map(p => {
              if (p[labelField] != "label") {
                p.label = p[labelField];
              }
              if (p[valueField] != "value") {
                p.value = p[valueField];
              }
              if (p[childrenField] != "children") {
                p.children = p[childrenField];
              }
              return p;
            });
          });

          that.editOptions = editOptions;
          that.$refs.dataGrid.updateData();
        })
        .catch(() => {});
    },
    editSlotRender(name) {
      let slot;
      switch (name) {
        case "AInput":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            return [
              <a-input
                {...{
                  props: {
                    size: this.editItemSize,
                    ...props,
                    value: row[item.field],
                    disabled: editSlotDisabled(row, props)
                  },
                  on: {
                    ...itemRender.on,
                    change: e => {
                      let value = e.target.value;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(e, { row, rowIndex });
                      }
                    }
                  },
                  style: {
                    ...itemRender.style
                  }
                }}
              />
            ];
          };
          break;
        case "AInputNumber":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            return [
              <a-input-number
                {...{
                  props: {
                    size: this.editItemSize,
                    ...props,
                    value: row[item.field],
                    disabled: editSlotDisabled(row, props)
                  },
                  on: {
                    ...itemRender.on,
                    change: e => {
                      let value = e;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(value, { row, rowIndex });
                      }
                    }
                  },
                  style: {
                    ...itemRender.style
                  }
                }}
              />
            ];
          };
          break;
        case "ASelect":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            var optionsField = (props && props.optionsField) || "";
            var options = optionsField
              ? row[optionsField]
              : props.options
              ? props.options
              : this.editOptions[item.field];
            return [
              <a-select
                {...{
                  props: {
                    size: this.editItemSize,
                    showSearch: true,
                    allowClear: true,
                    ...itemRender.props,
                    value: row[item.field],
                    options: options,
                    disabled: editSlotDisabled(row, props)
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
                    }
                  }
                }}
              />
            ];
          };
          break;
        case "ADatePicker":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
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
                    disabled: editSlotDisabled(row, props)
                  },
                  on: {
                    ...itemRender.on,
                    change: e => {
                      let value = e;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(e, { row, rowIndex });
                      }
                    }
                  },
                  style: {
                    ...itemRender.style
                  }
                }}
              />
            ];
          };
          break;
        case "ATimePicker":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            return [
              <a-time-picker
                {...{
                  props: {
                    size: this.editItemSize,
                    clearIcon: true,
                    ...itemRender.props,
                    value: row[item.field],
                    disabled: editSlotDisabled(row, props)
                  },
                  on: {
                    ...item.on,
                    change: e => {
                      let value = e;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(e, { row, rowIndex });
                      }
                    }
                  },
                  style: {
                    ...itemRender.style
                  }
                }}
              />
            ];
          };
          break;
        case "ASwitch":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let trueValue = props.trueValue ? props.trueValue : true;
            let falseValue = props.falseValue ? props.falseValue : false;
            if (editSlotHidden(row, props)) return "";
            return [
              <a-switch
                {...{
                  props: {
                    size: this.editItemSize,
                    ...itemRender.props,
                    checked: row[item.field] == trueValue,
                    disabled: editSlotDisabled(row, props)
                  },
                  on: {
                    ...item.on,
                    change: e => {
                      let value = e ? trueValue : falseValue;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(e, { row, rowIndex });
                      }
                    }
                  },
                  style: {
                    ...itemRender.style
                  }
                }}
              />
            ];
          };
          break;
        case "ACheckbox":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            let props = item.itemRender.props || {};
            let trueValue = props.trueValue ? props.trueValue : true;
            let falseValue = props.falseValue ? props.falseValue : false;
            if (editSlotHidden(row, props)) return "";
            return [
              <a-checkbox
                {...{
                  props: {
                    size: this.editItemSize,
                    ...itemRender.props,
                    checked: row[item.field] == trueValue,
                    disabled: editSlotDisabled(row, props)
                  },
                  on: {
                    ...item.on,
                    change: e => {
                      let value = e.target.checked ? trueValue : falseValue;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(e, { row, rowIndex });
                      }
                    }
                  },
                  style: {
                    ...itemRender.style
                  }
                }}
              />
            ];
          };
          break;
      }
      return slot;
    }
  }
};

export default editRender;
