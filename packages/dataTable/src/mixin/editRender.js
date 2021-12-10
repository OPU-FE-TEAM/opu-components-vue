import moment from "moment";
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
  return !props[key] || props[key] == 0
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
              default: ({ row, rowIndex, $columnIndex }) => {
                return [
                  <div style="display:flex;">
                    {p.itemRender.before && p.itemRender.before()}
                    <div style="flex:1">
                      {this.editSlotRender(name)({
                        row,
                        rowIndex,
                        $columnIndex
                      })}
                    </div>
                    {p.itemRender.after && p.itemRender.after()}
                  </div>
                ];
              }
            };
            if (name == "ASwitch" || name == "ACheckbox") p.align = "center";
            let props = p.itemRender.props || {};
            if (name == "ASelect" && p.itemRender.props) {
              if (p.itemRender.props.options) {
                editOptions[p.field] == p.itemRender.props.options;
              } else if (
                !p.itemRender.props.optionsField &&
                !editOptions[p.field] &&
                (props.api || props.dataField || props.param)
              ) {
                apiList.push({
                  field: p.field,
                  api: props.api || getSelectOptions.api,
                  valueField: props.valueField || getSelectOptions.valueField,
                  labelField: props.labelField || getSelectOptions.labelField,
                  childrenField:
                    props.childrenField || getSelectOptions.childrenField,
                  dataField: props.dataField || getSelectOptions.dataField,
                  defaultField:
                    props.defaultField || getSelectOptions.defaultField,
                  param: props.param || {}
                });
              }
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
          that.editOptions = editOptions;
          that.editDefaultOption = editDefaultOption;

          if (onOptionsLoadAfter) {
            onOptionsLoadAfter({ editOptions, editDefaultOption });
          }

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
            var optionsField = (props && props.optionsField) || "";
            var options = optionsField
              ? row[optionsField]
              : props.options
              ? props.options
              : this.editOptions[item.field];
            let disabled = editSlotPropInit(row, props, "disabled");
            if (typeof disabled == "object") {
              return [disabled];
            } else {
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
                      disabled
                    },
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
                      }
                    }
                  }}
                />
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
