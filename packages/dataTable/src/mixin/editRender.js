import moment from "moment";
import { cloneDeep } from "lodash";
import utils from "../../../utils";
import config from "../../conf";
import OpuInputNumber from "../../../dataForm/src/inputNumber";
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

    that.$refs.dataGrid && that.$refs.dataGrid.updateData();
  });
};

// 驼峰转换下划线
function toLine(name) {
  name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
  return name[0] == "-" ? name.slice(1) : name;
}

//单行编辑时 数据转换
function dataFormat(value, props, name, event) {
  if (props.default) {
    value = props.default(event);
  } else if (value.format) {
    if (props.format) {
      value = value.format(props.format);
    } else if (name == "a-date-picker") {
      if (props.showTime) {
        value = value.format("YYYY-MM-DD HH:mm:ss");
      } else {
        value = value.format("YYYY-MM-DD");
      }
    } else {
      value = value.format("HH:mm:ss");
    }
  }
  return value;
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

/**
 * @description: 查询对应属性 根据属性类型做对应处理
 * @param {*} row
 * @param {*} props
 * @param {*} key
 * @param {*} event
 * @param {*} defaultKey
 * @return {*}
 */
function editSlotPropInit(row, props, key, event, defaultKey = false) {
  return !props[key] && props[key] != 0
    ? defaultKey
    : typeof props[key] == "function"
    ? props[key](row, event)
    : props[key];
}

const editRender = {
  components: {
    OpuInputNumber,
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
    },
    editLine: {
      type: Boolean,
      default: false
    },
    isCacheOption: {
      type: Boolean,
      default: true
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
      editTypeTargetName: {
        "a-input-number": "OpuInputNumber",
        "a-select": "OpuSelect",
        "a-auto-complete": "OpuAutoComplete",
        "a-date-picker": "OpuDatePicker",
        "a-time-picker": "OpuTimePicker"
      },
      componentsFocusItemTypes: [
        "a-input",
        "a-input-number",
        "a-select",
        "a-auto-complete",
        "a-date-picker",
        "a-time-picker",
        "pulldown-table"
      ],
      lineEditTypes: [
        "pulldown-table",
        "a-input",
        "a-input-number",
        "a-auto-complete",
        "a-select",
        "a-date-picker",
        "a-time-picker"
      ],
      enterTypes: [
        "pulldown-table",
        "a-input",
        "a-input-number",
        "a-auto-complete",
        "a-select",
        "a-date-picker",
        "a-time-picker"
      ],
      //enter  数组
      pressEnterItems: [],
      //用于加减field
      leftPressEnterItems: [],
      editOptions: {},
      editApiList: [],
      editDefaultOption: {},
      editFieldList: {},
      currentCell: null,
      columnsIndexs: []
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
  mounted() {},
  methods: {
    /**
     * @description: 设置下拉数据
     * @param {*} data
     * @return {*}
     */
    setFieldsOptions(data, callback) {
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

      this.$nextTick(() => {
        callback && callback();
      });
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
     * @description: 表格编辑行点击
     * @param {*}
     * @return {*}
     */
    onEditTableCurrentRowCellClick(e, type = false) {
      let that = this;
      let currentCell = that.currentCell || {};
      let { rowIndex: currentRowIndex } = currentCell;
      that.currentCell = e;
      if (e && this.editLine) {
        if (e.rowIndex === currentRowIndex) {
          return;
        }
        let item = that.pressEnterItems.find(p => {
          if (e.field) {
            return p.field == e.field;
          } else {
            return p.columnIndex == e.$columnIndex;
          }
        });

        if (item) {
          e.field = item.field;
          that.itemFocus(e, type);
        }
        setTimeout(() => {
          document.body.removeEventListener("click", that.onBlurEditTable);
          document.body.addEventListener("click", that.onBlurEditTable, false);
        }, 50);
      }
    },
    /**
     * @description: 离开行编辑
     * @param {*}
     * @return {*}
     */
    onBlurEditLine() {
      this.currentCell = null;
    },
    onBlurEditTable(e) {
      let that = this;
      let event = e || window.event;
      let target = event.target || event.srcElement;
      let pathIndex = 0;
      let dataGrid = this.$refs.dataGrid;
      while (target.parentNode === null) {
        pathIndex++;
        target = event.path[pathIndex];
      }
      this.$nextTick(() => {
        //时间
        let timeEl = document.getElementsByClassName("ant-time-picker-panel");
        //日期
        let dateEl = document.getElementsByClassName(
          "ant-calendar-picker-container"
        );
        //下拉
        let selectEl = document.getElementsByClassName("ant-select-dropdown");
        //下拉表格
        let tableEl = document.getElementsByClassName("vxe-pulldown--panel");
        //特殊处理数组
        let specialEl = [...timeEl, ...dateEl, ...selectEl, ...tableEl];
        let isContains = false;
        for (let i = 0; i < specialEl.length; i++) {
          let el = specialEl[i];
          isContains = el.contains(target);
          if (isContains) break;
        }
        if (!isContains && dataGrid && !dataGrid.$el.contains(target)) {
          that.onBlurEditLine();
          document.body.removeEventListener("click", that.onBlurEditTable);
        }
      });
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
     * @param {*} isAll
     * @return {*}
     */
    editColumnsInit(data, filterCallback, isAll) {
      let that = this;
      let getSelectOptions = config.getSelectOptions;
      let {
        data: tableData,
        unifyApiList,
        otherApiList,
        enterItems,
        columnsIndexs
      } = this.editColumnsRender({
        data,
        getSelectOptions,
        unifyApiList: {
          api:
            getSelectOptions && getSelectOptions.api
              ? getSelectOptions.api
              : config.getSelectOptions.api,
          param: {},
          fields: []
        },
        otherApiList: [],
        enterItems: {
          left: [],
          center: [],
          right: []
        },
        columnsIndexs: {},
        isAll,
        filterCallback
      });
      if (unifyApiList.fields.length > 0) {
        otherApiList = otherApiList.concat(unifyApiList);
      }
      that.columnsIndexs = columnsIndexs;
      that.pressEnterItems = [
        ...enterItems.left,
        ...enterItems.center,
        ...enterItems.right
      ];
      that.editApiList = otherApiList;
      // that.editFieldList = editFieldList;
      if (otherApiList.length > 0) {
        that.loadOptionsData();
      }
      return tableData;
    },
    /**
     * @description: 重构表格编辑列
     * @param {*}
     * @return {*}
     */
    editColumnsRender({
      data,
      index = 0,
      getSelectOptions,
      unifyApiList,
      otherApiList,
      enterItems,
      columnsIndexs,
      isAll,
      filterCallback
    }) {
      let that = this;
      let {
        editType,
        enterTypes,
        isCacheOption,
        editFieldList,
        editOptions,
        editDefaultOption
      } = that;
      let tableData = data.filter(p => {
        if (filterCallback && !filterCallback(p)) return false;
        if (p.children && p.children.length > 0) {
          let res = this.editColumnsRender({
            data: p.children,
            index,
            getSelectOptions,
            unifyApiList,
            otherApiList,
            enterItems,
            columnsIndexs,
            isAll,
            filterCallback
          });
          index = res.index - 1;
          enterItems = res.enterItems;
          columnsIndexs = res.columnsIndexs;
          p.children = res.data;
        } else {
          const field = p.field;
          p.columnIndex = index++;
          columnsIndexs[field] = p;
          let itemRender = p.itemRender;
          if (itemRender) {
            itemRender.name = toLine(itemRender.name || editType[0]);
            let name = itemRender.name;
            if (editType.includes(name)) {
              itemRender = itemRender || {};
              itemRender.props = itemRender.props || {};
              itemRender.on = itemRender.on || {};
              if (!p.slots) p.slots = {};

              if (enterTypes.includes(name)) {
                enterItems[p.fixed || "center"].push(p);
              }

              p.slots.default = e => {
                return [
                  <div
                    {...{
                      on: {
                        click: event => {
                          let { currentCell } = that;
                          if (currentCell) {
                            let {
                              columnIndex: currentColumnIndex,
                              rowIndex: currentRowIndex
                            } = currentCell;
                            let { columnIndex, rowIndex } = e;
                            if (
                              currentRowIndex !== undefined &&
                              currentColumnIndex !== undefined &&
                              columnIndex === currentColumnIndex &&
                              rowIndex === currentRowIndex
                            ) {
                              event.stopPropagation();
                              // event.preventDefault();
                              return;
                            }
                          }
                        },
                        keyup: async event => {
                          if (itemRender.on.keyup) {
                            let res = await itemRender.on.keyup(e, event);
                            if (res === false) return;
                          }
                          if (name == "a-select" && event.keyCode == 13) {
                            let {
                              currentCell: { rowIndex, row }
                            } = that;
                            setTimeout(() => {
                              that.pressEnterItem({
                                columnIndex: index,
                                rowIndex,
                                row,
                                field
                              });
                            }, 50);
                          }
                        }
                      },
                      style: "display:flex;align-items: center;"
                    }}
                  >
                    {itemRender.before && itemRender.before(e)}
                    <div style="flex:1;max-width: 100%;">
                      {that.editSlotRender(name)(e)}
                    </div>
                    {itemRender.after && itemRender.after(e)}
                  </div>
                ];
              };

              if (name == "a-switch" || name == "a-checkbox")
                p.align = "center";
              let props = itemRender.props;
              if (["a-select", "a-auto-complete"].includes(name) && props) {
                let valueField =
                  props.valueField || getSelectOptions.valueField;
                let labelField =
                  props.labelField || getSelectOptions.labelField;
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
                      o = that.optionDataRender(o, field, "", {
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
                    (!isCacheOption || !editOptions[field] || isAll)
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
        }
        return true;
      });
      return {
        data: tableData,
        index,
        unifyApiList,
        otherApiList,
        enterItems,
        columnsIndexs
      };
    },
    loadOptionsData(isAll) {
      if (isAll) {
        this.setTableColumns(this.columns, isAll);
      } else {
        fetchItemPropsOptionsApiList(this);
      }
    },
    /**
     * @description: 选中某一行 并且触发表格编辑
     * @param {*} rowIndex
     * @return {*}
     */
    focusEditRow(rowIndex = 0) {
      let { pressEnterItems } = this;
      let dataGrid = this.$refs.dataGrid;
      let data = this.data || dataGrid.getData();
      let row = data[rowIndex];
      if (row && pressEnterItems.length > 0) {
        dataGrid.setCurrentRow(row);
        setTimeout(() => {
          this.onEditTableCurrentRowCellClick({
            row,
            rowIndex,
            columnIndex: pressEnterItems[0].columnIndex,
            field: pressEnterItems[0].field
          });
        }, 50);
      }
    },
    /**
     * @description: 表格编辑 选中元素 按下enter
     * @param {*}
     * @return {*}
     */
    pressEnterItem(event) {
      let that = this;
      let { pressEnterItems } = that;
      let { rowIndex, row, field } = event;
      let index = pressEnterItems.findIndex(p => p.field == field);
      let data = that.data || that.$refs.dataGrid.getData();
      if (!row) row = data[rowIndex];
      //换下一行
      if (index == pressEnterItems.length - 1) {
        rowIndex += 1;
        //如果是最后一个
        if (data.length == rowIndex) {
          this.$emit("enterLastItem");
        } else {
          row = data[rowIndex];
          that.$refs.dataGrid.setCurrentRow(row);
          that.onEditTableCurrentRowCellClick(
            {
              row,
              rowIndex,
              columnIndex: pressEnterItems[0].columnIndex,
              field: pressEnterItems[0].field
            },
            true
          );
        }
      } else {
        let nextItem = pressEnterItems[index + 1];
        let nextEvent = {
          row,
          rowIndex: event.rowIndex,
          columnIndex: nextItem.columnIndex,
          field: nextItem.field
        };
        let disabled = editSlotPropInit(
          row,
          nextItem.itemRender.props,
          "disabled",
          nextEvent
        );
        //如果禁用 跳转下一个
        if (disabled) {
          that.pressEnterItem(nextEvent);
        } else {
          that.itemFocus(nextEvent);
        }
      }
    },
    /**
     * @description: 指定行 field focus
     * @param {*} event
     * @return {*}
     */
    itemFieldFocus(event) {
      let that = this;
      let { pressEnterItems, editLine } = that;
      let { field, rowIndex } = event;
      let index = pressEnterItems.findIndex(p => p.field == field);
      let newEvent = {
        ...event,
        rowIndex,
        columnIndex: pressEnterItems[index].columnIndex
      };
      let dataGrid = that.$refs.dataGrid;
      let data = that.data || dataGrid.getData();
      let row = data[rowIndex];
      if (row) {
        document.body.removeEventListener("click", that.onBlurEditTable);
        that.currentCell = newEvent;
        dataGrid.setCurrentRow(row);
        that.itemFocus(newEvent);
        if (editLine) {
          setTimeout(() => {
            document.body.addEventListener(
              "click",
              that.onBlurEditTable,
              false
            );
          }, 50);
        }
      }
    },
    /**
     * @description: 选中某个表格编辑项
     * @param {*} rowIndex
     * @param {*} columnIndex
     * @param {*} field
     * @return {*}
     */
    itemFocus(event, type = true) {
      let that = this;
      that.$nextTick(() => {
        let input = that.$refs["input-" + event.rowIndex + "-" + event.field];
        input;
        if (input) {
          let field = event.field;
          that.$refs.dataGrid.scrollToColumn(field);
          input.focus && input.focus();
          input.select && input.select();
        } else if (type) {
          this.pressEnterItem(event);
        }
      });
    },
    editSlotRender() {
      return event => {
        let that = this;
        let { currentCell, editLine, lineEditTypes } = that;
        let { rowIndex, row, column } = event;
        let field = column.field;
        let item = that.columnsIndexs[field];
        let itemRender = item.itemRender;
        if (itemRender) {
          event.field = field;
          let name = itemRender.name;
          let props = itemRender.props;
          let disabled = editSlotPropInit(row, props, "disabled", event);
          let element;
          if (typeof disabled == "object") {
            return [disabled];
          } else if (
            editLine &&
            (!currentCell || currentCell.rowIndex != rowIndex) &&
            lineEditTypes.includes(name)
          ) {
            let value = dataFormat(
              utils.getObjData(item.field, row) || "",
              props,
              name,
              event
            );
            return [<div class={`edit-input ${name}`}>{value}</div>];
          } else {
            props = {
              size: that.editItemSize,
              ...props,
              value: utils.getObjData(field, row),
              disabled
            };
            let attr = {
              class: editSlotItemRender(itemRender.class, event),
              style: editSlotItemRender(itemRender.style, event),
              ref: "input-" + rowIndex + "-" + field
            };

            var optionsField, options, trueValue, falseValue;
            let ons = {
              change: e => {
                utils.setObjData(field, row, e);
                row.ISEDIT = true;
                if (itemRender.on.change) {
                  itemRender.on.change(e, event);
                }
              }
            };

            for (let i in itemRender.on) {
              if (i != "change") {
                let fuc = itemRender.on[i];
                ons[i] = (...arg) => {
                  fuc(...arg, event);
                };
              }
            }

            let elementAttribute = {};

            switch (name) {
              case "a-input":
                elementAttribute = {
                  ...attr,
                  props,
                  on: {
                    ...ons,
                    change: e => {
                      let value = e.target.value;
                      utils.setObjData(field, row, value);
                      row.ISEDIT = true;
                      if (itemRender.on.change) {
                        itemRender.on.change(e, event);
                      }
                    },
                    keyup: async e => {
                      if (itemRender.on.keyup) {
                        let res = await itemRender.on.keyup(e, event);
                        if (res === false) return;
                      }
                      if (e.keyCode == 13) {
                        that.pressEnterItem(event);
                      }
                    }
                  }
                };
                break;
              case "a-input-number":
                elementAttribute = {
                  ...attr,
                  props: {
                    ...props,
                    max: editSlotPropInit(row, props, "max", event, Infinity),
                    min: editSlotPropInit(row, props, "min", event, -Infinity)
                  },
                  style: {
                    width: "100%",
                    ...attr.style
                  },
                  on: {
                    ...ons,
                    keyup: async e => {
                      if (itemRender.on.keyup) {
                        let res = await itemRender.on.keyup(e, event);
                        if (res === false) return;
                      }
                      if (e.keyCode == 13) {
                        that.pressEnterItem(event);
                      }
                    }
                  }
                };
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
                elementAttribute = {
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
                      if (itemRender.on.change) {
                        itemRender.on.change(value, option, event, pOption);
                      }
                    }
                  }
                };
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

                if (props.search) {
                  props.saerch = (value, dataSource) => {
                    itemRender.props.search(value, dataSource, row, event);
                  };
                }

                elementAttribute = {
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
                      if (itemRender.on.select) {
                        itemRender.on.select(value, optionRow, event);
                      }
                    },
                    inputPressEnter: async e => {
                      if (itemRender.on.inputPressEnter) {
                        let res = await itemRender.on.inputPressEnter(e, event);
                        if (res === false) return;
                      }
                      if (e.keyCode == 13) {
                        that.pressEnterItem(event);
                      }
                    }
                  }
                };
                break;
              case "a-date-picker":
                var dateValue = !props.value
                  ? null
                  : props.value.format
                  ? props.value
                  : moment(props.value);
                elementAttribute = {
                  ...attr,
                  props: {
                    ...props,
                    value: dateValue
                  },
                  on: {
                    ...ons,
                    inputPressEnter: async e => {
                      if (itemRender.on.inputPressEnter) {
                        let res = await itemRender.on.inputPressEnter(e, event);
                        if (res === false) return;
                      }
                      if (e.keyCode == 13) {
                        that.pressEnterItem(event);
                      }
                    }
                  }
                };
                break;
              case "a-time-picker":
                elementAttribute = {
                  ...attr,
                  props: {
                    clearIcon: true,
                    ...props
                  },
                  style: {
                    width: "100%",
                    ...attr.style
                  },
                  on: {
                    ...ons,
                    inputPressEnter: async e => {
                      if (itemRender.on.inputPressEnter) {
                        let res = await itemRender.on.inputPressEnter(e, event);
                        if (res === false) return;
                      }
                      if (e.keyCode == 13) {
                        that.pressEnterItem(event);
                      }
                    }
                  }
                };
                break;
              case "pulldown-table":
                elementAttribute = {
                  ...attr,
                  props,
                  on: {
                    ...ons,
                    change: (e, option) => {
                      utils.setObjData(field, row, e);
                      row.ISEDIT = true;
                      if (itemRender.on.change) {
                        itemRender.on.change(e, option, event);
                      }
                    },
                    inputPressEnter: async e => {
                      if (itemRender.on.inputPressEnter) {
                        let res = await itemRender.on.inputPressEnter(e, event);
                        if (res === false) return;
                      }
                      if (e.keyCode == 13) {
                        that.pressEnterItem(event);
                      }
                    }
                  }
                };
                break;
              case "a-switch":
                trueValue = props.trueValue ? props.trueValue : true;
                falseValue = props.falseValue ? props.falseValue : false;
                if (editSlotPropInit(row, props, "hidden", event)) return "";
                elementAttribute = {
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
                      if (itemRender.on.change) {
                        itemRender.on.change(e, event);
                      }
                    }
                  }
                };
                break;
              case "a-checkbox":
                trueValue = props.trueValue ? props.trueValue : true;
                falseValue = props.falseValue ? props.falseValue : false;
                if (editSlotPropInit(row, props, "hidden", event)) return "";
                elementAttribute = {
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
                      if (itemRender.on.change) {
                        itemRender.on.change(e, event);
                      }
                    }
                  }
                };
                break;
            }
            element = that.$createElement(
              that.editTypeTargetName[name] || name,
              elementAttribute
            );
          }
          return [element];
        }
      };
    }
  }
};

export default editRender;
