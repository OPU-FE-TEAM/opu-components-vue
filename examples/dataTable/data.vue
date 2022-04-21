<template>
  <div>
    <a-button @click="$refs.xGrid.showSetColumns()">设置表头1</a-button>
    <DataTable
      show-overflow
      keep-source
      ref="xGrid"
      height="calc(100vh - 100px)"
      :loading="loading"
      :data="tableData"
      :columns="tableColumn"
      :setcolumns-config="setcolumnsConfig"
    >
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
  created() {},
  methods: {
    onSortChange(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="css"></style>
