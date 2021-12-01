<template>
  <div>
    <DataTable
      show-overflow
      keep-source
      ref="xGrid"
      height="calc(100vh - 100px)"
      :data="tableData"
      :setcolumns-config="setColumns"
      class="abc-table"
      :proxy-columns="proxyColumns"
    >
    </DataTable>

    <a-button @click="$refs.xGrid.showSetColumns()">设置表头</a-button>
  </div>
</template>

<script>
// import {utils} from '../../index'

function getData(arr) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(arr);
      const size = arr.pageSize ? arr.pageSize : 20;
      const pageIndex = arr.pageIndex ? arr.pageIndex : 1;
      const list = Array.from({ length: size }, (_, key) => ({
        id: key,
        name: `name_${pageIndex}_${key}`,
        checkbox: key < 3 ? true : false,
        checkbox1: key === 5 ? true : false,
        select: "",
        select1: "",
        switch: false,
        pulldownTable: "",
        datePicker: "2021-05-05",
        children: [
          {
            id: "a1",
            name: "cname1"
          },
          {
            id: "a2",
            name: "cname2"
          }
        ]
      }));
      const json = {
        // data: [...list],
        // total: 100
        code: 0,
        data: {
          data: [...list],
          total: size
        }
      };
      console.log(json);
      resolve(json);
    }, 500);
  });
}

// function getColumns(arr) {
//   return new Promise(resolve => {
//     console.log(arr);
//     setTimeout(() => {
//       // const code = arr && arr.code ? arr.code : "";
//       const list = [
//         {
//           align: "left",
//           children: [],
//           colSpan: null,
//           customName: "HIS编码",
//           drag: true,
//           freeze: null,
//           isHide: false,
//           name: "hisId",
//           parentCode: "",
//           rowSpan: null,
//           show: true,
//           sort: 2,
//           sysColumnName: "HIS编码",
//           width: 120
//         },
//         {
//           align: "left",
//           children: [],
//           colSpan: null,
//           customName: "物品编码",
//           drag: true,
//           freeze: null,
//           isHide: false,
//           name: "code",
//           parentCode: "",
//           rowSpan: null,
//           show: true,
//           sort: 3,
//           sysColumnName: "物品编码",
//           width: 180
//         },
//         {
//           align: "left",
//           children: [],
//           colSpan: null,
//           customName: "物品名称",
//           drag: true,
//           freeze: null,
//           isHide: false,
//           name: "name",
//           parentCode: "",
//           rowSpan: null,
//           show: true,
//           sort: 4,
//           sysColumnName: "物品名称",
//           width: 180
//         }
//       ];
//       const json = {
//         // data: [...list],
//         // total: 100
//         code: 0,
//         data: list
//       };
//       resolve(json);
//     }, 500);
//   });
// }

export default {
  components: {},
  data() {
    return {
      loading: false,
      tableData: [],
      tableForm: {
        data: {
          name: "",
          sex: ""
        },
        items: [
          {
            field: "name",
            title: "app.body.label.name",
            itemRender: { name: "$input", props: { placeholder: "请输入名称" } }
          },
          {
            field: "sex",
            title: "性别",
            titlePrefix: {
              message: "帮助信息！！！",
              icon: "fa fa-info-circle"
            },
            itemRender: { name: "$select", options: [] }
          },
          {
            itemRender: {
              name: "$buttons",
              children: [
                {
                  props: { type: "submit", content: "查询", status: "primary" }
                },
                { props: { type: "reset", content: "重置" } }
              ]
            }
          }
        ]
      },
      setColumns: {
        // modal: {
        //   props: {
        //     title: "自定义标题"
        //   }
        // },
        proxyConfig: {
          // props: {},
          params: {
            code: "goods"
          }

          // ajax: {
          //   query: json => {
          //     return new Promise(resolve => {
          //       console.log(json);
          //       getColumns({
          //         ...json,
          //         code: "aaaa"
          //       }).then(res => {
          //         resolve(res);
          //       });
          //     });
          //   },
          //   submit: values => {
          //     console.log("submit111", values);
          //   }
          // }
        }
      },

      pagerConfig: {
        pageIndex: 0,
        pageSize: 10
        // layouts: [
        //   "PrevJump",
        //   "PrevPage",
        //   "Number",
        //   "NextPage",
        //   "NextJump",
        //   "Sizes",
        //   "FullJump"
        //   // "Total"
        // ],
        // perfect: true,
        // slots: {
        //   left: () => {
        //     return "666";
        //   }
        // }
        // props:{
        //   pageSize:'size',
        //   currentPage:'pageIndex'
        // }
      },
      proxyConfig: {
        // seq: true, // 启用动态序号代理
        // sort: true, // 启用排序代理
        // filter: true, // 启用筛选代理
        // form: true, // 启用表单代理
        props: {
          result: "data.data",
          total: "data.total",
          list: "data.data"
        },
        autoLoad: false,
        ajax: {
          query: getData
        }
      },
      proxyColumns: {
        // props: {
        //   list: "data.data",
        //   show: "show",
        //   align: "align",
        //   fixed: "freeze"
        // },
        params: {
          code: "goods"
        },
        on: {}

        // ajax: {
        //   query: json => {
        //     return new Promise(resolve => {
        //       console.log(json);
        //       getColumns({
        //         ...json,
        //         code: "aaaa"
        //       }).then(res => {
        //         resolve(res);
        //       });
        //     });
        //   }
        // }
      }
    };
  },
  created() {
    // this.findList()
    this.fetchSelectData();
  },
  methods: {
    fetchSelectData() {
      // getSelectData().then(res => {
      //   if (this.$refs.xGrid) {
      //     // const column = this.$refs.xGrid.getColumnByField("select1");
      //     // column.editRender.options = res.data.data;
      //   }
      // });
    },
    searchEvent() {
      this.tablePage.currentPage = 1;
      this.findList();
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.findList();
    },
    currentChangeEvent({ row }) {
      console.log("行选中事件", row);
      // this.delDisabled = !this.delDisabled;
      // const headToolbar = this.headToolbar;
      // headToolbar.buttons[1][1].disabled = this.delDisabled;
      // this.headToolbar = { ...headToolbar };
      // console.log(this.headToolbar);
      // const that = this;
      // setTimeout(() => {
      //   that.currentRow = row;
      // }, 10);
    },
    getCurrentRecord() {
      const grid = this.$refs.xGrid;
      const row = grid.getCurrentRecord();
      console.log(6666, row);
    },
    getData() {
      const grid = this.$refs.xGrid;
      const data = grid.getData();
      console.log(data);
    },
    showSetColumns() {
      const grid = this.$refs.xGrid;
      grid.showSetColumns();
    },
    updateColumns() {
      this.tableColumn = [
        { type: "checkbox", colIndex: 0, width: 60 },
        { type: "seq", title: "Number", colIndex: 1, width: 80 },
        {
          field: "code",
          title: "Code",
          minWidth: 140,
          editRender: { name: "AInput" }
        },
        {
          field: "checkbox",
          title: "Checkbox",
          minWidth: 140,
          editRender: { name: "ACheckbox" }
        }
      ];
    },
    editRow(row) {
      const str = JSON.stringify(row);
      console.log(str);
    },
    onAdd() {
      debugger;
      this.$refs.crudTable.reloadTable();
    },
    setSearchData() {
      const grid = this.$refs.xGrid;
      grid.setSearchData({
        name: "aaa"
      });
    },
    getSearchData() {
      const grid = this.$refs.xGrid;
      const values = grid.getSearchData();
      console.log(values);
    },
    toSearch() {
      const grid = this.$refs.xGrid;
      grid.reload({
        a: 1,
        b: 2
      });
    },
    onCellClick(e) {
      console.log(e);
      // if (this.currentRow._XID && e.row._XID === this.currentRow._XID) {
      //   const grid = this.$refs.xGrid;
      //   grid.clearCurrentRow();
      //   this.currentRow = {};
      // }
    },
    reload() {
      const grid = this.$refs.xGrid;
      grid.reload();
    },
    setData() {
      this.tableData = [
        {
          id: 1,
          name: "b1",
          sex: 1
        },
        {
          id: 2,
          name: "b2",
          sex: 1
        },
        {
          id: 3,
          name: "b3",
          sex: 1
        }
      ];
    }
  }
};
</script>

<style lang="css"></style>
