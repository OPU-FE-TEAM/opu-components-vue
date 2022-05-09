<template>
  <div>
    <a-button @click="$refs.xGrid.showSetColumns()">设置表头1</a-button>
    <a-button @click="onScroll">滚动</a-button>
    <DataTable
      ref="xGrid"
      :height="400"
      show-overflow
      :loading="loading"
      :data="tableData"
      highlight-current-row
      highlightCurrentUnselect
      :columns="tableColumn"
      @current-change="change"
    >
      <!-- :checkboxConfig="{ highlight: true, trigger: 'row' }" -->
    </DataTable>
  </div>
</template>

<script>
// import {utils} from '../../index'

export default {
  components: {},
  data() {
    return {
      loading: false,
      proxyColumns: {
        params: {
          queryFlag: false,
          typeCode: "abc"
        }
      },

      tableColumn: [
        {
          type: "checkbox",
          title: "",
          width: 30,
          fixed: "left"
        },
        // { type: "checkbox", colIndex: 0, width: 60, fixed: "left" },
        {
          title: "Name",
          field: "name",
          sortable: true,
          width: 200
        },
        {
          title: "Nex",
          field: "sex",
          align: "left",
          itemRender: {
            name: "ADatePicker",
            props: {
              format: "YYYY-MM-DD",
              inputReadOnly: true,
              allowClear: false
            },
            on: {
              change: this.onCheckOutDateChange
            }
          }
        },
        {
          title: "Age",
          field: "age",
          align: "left"
        }
        // { title: "操作", width: 200, slots: { default: "operate" } }
      ],
      tableData: [
        {
          id: 1,
          name: "a1",
          sex: 1
        },
        {
          id: 2,
          name: "a2",
          sex: 1
        },
        {
          id: 3,
          name: "a3",
          sex: 1
        }
      ],
      setcolumnsConfig: {
        modal: {
          props: {
            bodyStyle: { height: "500px" }
          }
        },
        proxyConfig: {
          props: {
            title: "title",
            width: "width",
            align: "align",
            show: "show",
            fixed: "fixed",
            field: "field"
          },
          on: {
            submitBefore: values => {
              console.log(values);
              // return false;
            }
          }
        },
        tableConfig: {
          columns: [
            {
              width: 60,
              align: "center",
              slots: {
                default: "btn_default",
                header: () => {
                  return "排序";
                }
              }
            },
            {
              field: "title",
              title: "显示标题",
              align: "center",
              editRender: { name: "AInput" }
            },
            {
              field: "width",
              title: "列宽",
              align: "center",
              editRender: { name: "AInputNumber" }
            },
            {
              field: "align",
              title: "对齐方式",
              align: "center",
              editRender: {
                name: "ASelect",
                options: [
                  { label: "居左", value: "left" },
                  { label: "居中", value: "center" },
                  { label: "居右", value: "right" }
                ]
              }
            },
            {
              field: "show",
              title: "显示",
              align: "center",
              slots: { default: "show_default" }
            },
            {
              field: "fixed",
              title: "固定",
              align: "center",
              editRender: {
                name: "ASelect",
                options: [
                  { label: "不固定", value: "" },
                  { label: "靠左", value: "left" },
                  { label: "靠右", value: "right" }
                ]
              }
            }
          ]
        }
      }
    };
  },
  created() {
    const list = Array.from({ length: 110 }, (_, key) => ({
      id: key,
      name: `abc_${key}`,
      age: key
    }));
    this.tableData = list;
  },
  methods: {
    onSortChange(e) {
      console.log(e);
    },
    onScroll() {
      let that = this;
      that.tableData.push({
        id: that.tableData.length,
        name: `新增_${that.tableData.length}`,
        age: that.tableData.length
      });
      that.$nextTick(() => {
        that.$refs.xGrid.scrollTo(0, 99999999999);
        // that.$refs.xGrid.scrollToRow(that.tableData[15]);
      });
    },
    change(a, b, c) {
      console.log(a);
      console.log(b);
      console.log(c);
    }
  }
};
</script>

<style lang="css"></style>
