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
        <a-button @click="editRow(row)">编辑</a-button>
      </template>
    </DataTable>

    <a-button @click="onAdd">新增</a-button>
    <a-button @click="onChange">改变</a-button>
    <p>{{ data }}</p>
  </div>
</template>

<script>
import moment from "moment";

export default {
  components: {},
  data() {
    return {
      columns: [
        {
          field: "name",
          align: "left",
          title: "名称",
          minWidth: 150,
          itemRender: {
            name: "AInput"
          }
        },
        {
          field: "number",
          align: "left",
          title: "数量",
          minWidth: 150,
          itemRender: {
            name: "AInputNumber"
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
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 3, label: 3 }
              ]
            }
          }
        },
        {
          field: "orderDetailId",
          title: "关联明细",
          minWidth: 300,
          slots: {
            default: ({ row }) => {
              return [
                <a-select
                  {...{
                    props: {
                      showSearch: true,
                      allowClear: true,
                      value: row.orderDetailId,
                      options: [
                        { value: 1, label: 1 },
                        { value: 2, label: 2 },
                        { value: 3, label: 3 }
                      ]
                    },
                    on: {
                      change: value => {
                        console.log("orderDetailId");
                        row.orderDetailId = value;
                      }
                    }
                  }}
                />
              ];
            }
          }
        },
        {
          field: "date",
          align: "left",
          title: "日期",
          minWidth: 150,
          itemRender: {
            name: "ADatePicker",
            props: {
              format: "YYYY-MM-DD HH:mm:ss",
              showTime: true
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
              showTime: true
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
          name: "123",
          number: "333",
          orderType: "",
          orderDetailId: "",
          date: moment(),
          time: moment("12:08:23", "HH:mm:ss")
        }
      ]
    };
  },
  created() {},
  methods: {
    onAdd() {
      this.data.push({
        name: "123",
        number: "333",
        select: "",
        date: moment(),
        time: moment("12:08:23", "HH:mm:ss")
      });
    },
    onChange() {},
    setData() {}
  }
};
</script>

<style lang="css"></style>
