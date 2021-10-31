import moment from "moment";

const editRender = {
  components: {},
  data() {
    return {
      editType: [
        "AInput",
        "AInputNumber",
        "ASelect",
        "ADatePicker",
        "ATimePicker"
      ],
      editOptions: {}
    };
  },
  computed: {},

  methods: {
    // 下划线转换驼峰
    toHump(name) {
      // eslint-disable-next-line no-useless-escape
      return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
    },
    // 驼峰转换下划线
    toLine(name) {
      return name.replace(/([A-Z])/g, "-$1").toLowerCase();
    },
    editColumnsRender(data, filterCallback) {
      let { editType, toHump } = this;
      return data.filter(p => {
        if (filterCallback && !filterCallback(p)) {
          return false;
        }

        if (p.itemRender) {
          let name = toHump(p.itemRender.name || editType[0]);
          if (editType.indexOf(toHump(p.itemRender.name || editType[0])) > -1) {
            p.slots = {
              default: this.editSlotRender(name)
            };
          }
          // if (name == "ASelect") {
          //   delete p.itemRender;
          // } else {
          // delete p.itemRender.name;
          // }
        }
        return true;
      });
    },
    editSlotRender(name) {
      console.log("进入编辑");
      let slot;
      switch (name) {
        case "AInput":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            return [
              <a-input
                {...{
                  props: {
                    ...itemRender.props,
                    value: row[item.field]
                  },
                  on: {
                    ...itemRender.on,
                    change: e => {
                      let value = e.target.value;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(value, rowIndex);
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
            return [
              <a-input-number
                {...{
                  props: {
                    ...itemRender.props,
                    value: row[item.field]
                  },
                  on: {
                    ...itemRender.on,
                    change: e => {
                      let value = e;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(value, rowIndex);
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
            var optionsField = itemRender.optionsField || "";
            var options = itemRender.props.options
              ? itemRender.props.options
              : (optionsField && row[optionsField]) ||
                this.editOptions[optionsField];
            return [
              <a-select
                {...{
                  props: {
                    showSearch: true,
                    allowClear: true,
                    ...itemRender.props,
                    value: row[item.field],
                    options: options
                  },
                  on: {
                    ...itemRender.on,
                    change: (value, option) => {
                      debugger;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(value, option, rowIndex);
                      }
                    }
                  }
                }}
              />
            ];
          };
          // slot = ({ row }) => {
          //   // slot = ({ row, $columnIndex }) => {
          //   // slot = ({ row, rowIndex, $columnIndex }) => {
          //   // let item = this.tableColumns[$columnIndex];
          //   // let itemRender = item.itemRender || {};
          //   // var optionsField = itemRender.optionsField || itemRender.field;
          //   // var options = itemRender.props.options
          //   //   ? itemRender.props.options
          //   //   : row[optionsField] || this.editOptions[optionsField];
          //   // const props = {
          //   //   showSearch: true,
          //   //   allowClear: true,
          //   //   ...itemRender.props,
          //   //   value: row[item.field],
          //   //   options: options
          //   // };

          //   // return [
          //   //   <a-select
          //   //     {...{
          //   //       props: {
          //   //         showSearch: true,
          //   //         allowClear: true,
          //   //         value: row[item.field],
          //   //         options: [
          //   //           { value: 1, label: 1 },
          //   //           { value: 2, label: 2 },
          //   //           { value: 3, label: 3 }
          //   //         ]
          //   //       },
          //   //       on: {
          //   //         change: value => {
          //   //           debugger;
          //   //           row[item.field] = value;
          //   //         }
          //   //       }
          //   //     }}
          //   //   />
          //   // <a-select
          //   //   {...{
          //   //     props: props
          //   //     // on: {
          //   //     //   ...itemRender.on,
          //   //     //   change: (value, option) => {
          //   //     //     debugger;
          //   //     //     row[item.field] = value;
          //   //     //     if (itemRender.on && itemRender.on.change) {
          //   //     //       itemRender.on.change(value, option, rowIndex);
          //   //     //     }
          //   //     //   }
          //   //     // }
          //   //   }}
          //   // />
          //   // ];
          // };
          break;
        case "ADatePicker":
          slot = ({ row, rowIndex, $columnIndex }) => {
            let item = this.tableColumns[$columnIndex];
            let itemRender = item.itemRender || {};
            return [
              <a-date-picker
                {...{
                  props: {
                    ...itemRender.props,
                    value: !row[item.field]
                      ? null
                      : row[item.field].format
                      ? row[item.field]
                      : moment(row[item.field])
                  },
                  on: {
                    ...itemRender.on,
                    change: value => {
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(value, rowIndex);
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
            return [
              <a-time-picker
                {...{
                  props: {
                    clearIcon: true,
                    ...itemRender.props,
                    value: row[item.field]
                  },
                  on: {
                    ...item.on,
                    change: e => {
                      let value = e.target.value;
                      row[item.field] = value;
                      if (itemRender.on && itemRender.on.change) {
                        itemRender.on.change(value, rowIndex);
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
