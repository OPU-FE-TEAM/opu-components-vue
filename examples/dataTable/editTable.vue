<template>
  <div>
    <DataTable
      border
      resizable
      show-overflow
      ref="dataTable"
      :data="data"
      :columns="columns"
      :pager-config="false"
      size="mini"
      :edit-config="{ trigger: 'click', mode: 'row' }"
    >
      <template v-slot:operate="{ row }">
        <a-button @click="editRow(row)">删除</a-button>
      </template>
    </DataTable>
    <a-date-picker />
    <a-button @click="onAdd">新增</a-button>
    <a-button @click="onChange">改变</a-button>
    <a-button @click="getData">获取数据</a-button>
    <p>{{ data }}</p>
  </div>
</template>

<script>
import moment from "moment";

function getData() {
  return new Promise(resolve => {
    setTimeout(() => {
      let arr = [];
      for (let i = 0; i < 10; i++) {
        arr.push({
          label: i + " " + i,
          value: i,
          id: i + 1,
          text: i + 1 + "-" + i + 1
        });
      }
      resolve(arr);
    }, 5000);
  });
}

export default {
  components: {},
  data() {
    return {
      columns: [
        {
          field: "switch",
          align: "left",
          title: "开关",
          minWidth: 150,
          itemRender: {
            name: "ASwitch",
            props: {
              hidden: row => {
                return row.orderType == 1;
              }
            }
          }
        },
        {
          field: "date",
          title: "日期",
          minWidth: 150,
          itemRender: {
            name: "ADatePicker",
            props: {
              format: "YYYY-MM-DD",
              // format: "YYYY-MM-DD HH:mm:ss",
              // showTime: true,
              disabled: row => {
                return [row.date.format("YYYY-MM-DD")];
              }
            },
            on: {
              change: e => {
                console.log(e);
              }
            }
          }
        },
        {
          field: "switch1",
          align: "left",
          title: "开关1",
          minWidth: 150,
          itemRender: {
            name: "ASwitch",
            props: {
              disabled: row => {
                return row.orderType == 1;
              },
              trueValue: "1",
              falseValue: "0"
            }
          }
        },
        {
          field: "checkbox",
          align: "left",
          title: "选中",
          minWidth: 150,
          itemRender: {
            name: "ACheckbox",
            props: {
              disabled: row => {
                return row.orderType == 1;
              }
            }
          }
        },
        {
          field: "checkbox1",
          align: "left",
          title: "选中1",
          minWidth: 150,
          itemRender: {
            name: "a-checkbox",
            props: {
              disabled: row => {
                return row.orderType == 1;
              },
              trueValue: "1",
              falseValue: "0"
            }
          }
        },
        {
          field: "name",
          align: "left",
          title: "名称",
          minWidth: 150,
          itemRender: {
            name: "AInput",
            props: {
              disabled: row => {
                return row.orderType == 1;
              }
            }
          }
        },
        {
          field: "number",
          align: "left",
          title: "数量",
          minWidth: 150,
          itemRender: {
            name: "AInputNumber",
            props: {
              disabled: row => {
                return row.orderType == 2;
              }
            }
          }
        },
        {
          field: "orderType",
          align: "left",
          title: "下拉框",
          minWidth: 150,
          itemRender: {
            name: "ASelect",
            props: {
              options: [
                { value: 1, label: "省份" },
                { value: 2, label: "城市" },
                { value: 3, label: "区域" }
              ]
            },
            on: {
              change: (value, option, row, rowIndex) => {
                console.log(value);
                console.log(option);
                console.log(rowIndex);
                if (value == 1) {
                  row.oneSelectList = [
                    { value: 11, label: "广西" },
                    { value: 22, label: "广东" }
                  ];
                } else if (value == 2) {
                  row.oneSelectList = [
                    { value: 1, label: "桂林" },
                    { value: 2, label: "贺州" }
                  ];
                  this.$refs.dataTable.setEditOptions({
                    apiSelect: [
                      { value: 1, label: "桂林" },
                      { value: 2, label: "贺州" }
                    ]
                  });
                } else {
                  row.oneSelectList = [
                    { value: 99, label: "象山" },
                    { value: 88, label: "叠彩" }
                  ];
                }
                row.oneSelect = "";
              }
            }
          }
        },
        {
          field: "apiSelect",
          align: "left",
          title: "请求下拉",
          minWidth: 150,
          itemRender: {
            name: "ASelect",
            props: {
              api: getData,
              valueField: "id",
              labelField: "text",
              disabled: row => {
                return row.orderType == 3;
              }
            }
          }
        },
        {
          field: "apiSelect1",
          align: "left",
          title: "请求下拉",
          minWidth: 150,
          itemRender: {
            name: "ASelect",
            props: {
              api: getData,
              disabled: row => {
                return row.orderType == 3;
              }
            }
          }
        },
        {
          field: "oneSelect",
          align: "left",
          title: "行内数据下拉",
          minWidth: 150,
          itemRender: {
            name: "ASelect",
            props: {
              optionsField: "oneSelectList",
              valueField: "id",
              labelField: "text"
            }
          }
        },
        {
          field: "oneSelect1",
          align: "left",
          title: "行内数据下拉1",
          minWidth: 150,
          itemRender: {
            name: "ASelect",
            props: {
              optionsField: "oneSelectList1",
              valueField: "id",
              labelField: "text"
            }
          }
        },
        {
          field: "time",
          align: "left",
          title: "时间",
          minWidth: 150,
          itemRender: {
            name: "ATimePicker",
            props: {
              format: "HH:mm",
              showTime: true,
              disabled: row => {
                return row.orderType == 3;
              }
            },
            on: {
              change: () => {
                debugger;
              }
            }
          }
        }
      ],
      data: [
        {
          switch: false,
          switch1: "1",
          checkbox: false,
          checkbox1: "1",
          name: "123",
          number: "333",
          orderType: "",
          apiSelect: "",
          apiSelect1: "",
          date: moment(),
          oneSelect: "",
          oneSelect1: "",
          oneSelectList: [
            { value: 11, label: "广西" },
            { value: 22, label: "广东" }
          ],
          oneSelectList1: [
            { value: 11, label: "广西1" },
            { value: 22, label: "广东1" }
          ],
          time: moment("12:08:23", "HH:mm:ss")
        }
      ]
    };
  },
  created() {},
  methods: {
    onAdd() {
      this.data.push({
        switch: false,
        switch1: "0",
        checkbox: true,
        checkbox1: "0",
        name: "123",
        number: "333",
        orderType: "",
        apiSelect: "",
        apiSelect1: "",
        date: moment(),
        oneSelect: "",
        oneSelect1: "",
        oneSelectList: [
          { value: 11, label: "广西" },
          { value: 22, label: "广东" }
        ],
        oneSelectList1: [
          { value: 11, label: "广西1" },
          { value: 22, label: "广东1" }
        ],
        time: moment("12:08:23", "HH:mm:ss")
      });
    },
    onChange() {},
    setData() {},
    getData() {
      console.log(
        this.data.map(p => {
          return {
            time: p.time.format("HH:mm")
          };
        })
      );
    }
  }
};
</script>

<style lang="css"></style>
