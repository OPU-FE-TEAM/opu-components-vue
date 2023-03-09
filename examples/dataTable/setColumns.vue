<template>
  <div>
    <div style="height:600px;width:1000px">
      <DataTable
        show-overflow
        keep-source
        ref="xGrid"
        height="300px"
        :data="tableData"
        :setcolumns-config="setColumns"
        class="abc-table"
        :proxy-columns="proxyColumns"
        :columns="columns"
      >
      </DataTable>

      <a-button @click="showSetColumns">设置表头</a-button>
    </div>
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

function getColumns(arr) {
  return new Promise(resolve => {
    console.log(arr);
    setTimeout(() => {
      // const code = arr && arr.code ? arr.code : "";
      const list = [
        {
          title: "编号1",
          field: "code",
          columnIndex: 0,
          show: true,
          align: "left",
          defaultTitle: "编号",
          code: "",
          _X_ROW_KEY: "row_41",
          ISEDIT: true,
          sortable: true,
          width: 220
        },
        {
          title: "名称",
          field: "name",
          columnIndex: 1,
          show: true,
          align: "",
          defaultTitle: "名称",
          code: "",
          _X_ROW_KEY: "row_42",
          ISEDIT: true,
          sortable: true
        },
        {
          title: "所属班级",
          field: "squadName",
          columnIndex: 2,
          show: "",
          align: "",
          defaultTitle: "所属班级",
          code: "",
          _X_ROW_KEY: "row_43",
          sortable: true
        },
        {
          title: "状态",
          field: "statusName",
          slots: {},
          columnIndex: 3,
          show: "",
          align: "",
          defaultTitle: "状态",
          code: "",
          _X_ROW_KEY: "row_44",
          sortable: true
        },
        {
          title: "培训开始时间",
          field: "trainingBeginTime",
          columnIndex: 4,
          show: "",
          align: "",
          defaultTitle: "培训开始时间",
          code: "",
          _X_ROW_KEY: "row_45",
          sortable: true
        },
        {
          title: "培训结束时间",
          field: "trainingEndTime",
          columnIndex: 5,
          show: "",
          align: "",
          defaultTitle: "培训结束时间",
          code: "",
          _X_ROW_KEY: "row_46",
          sortable: true
        },
        {
          title: "电话",
          field: "phone",
          columnIndex: 6,
          show: "",
          align: "",
          defaultTitle: "电话",
          code: "",
          _X_ROW_KEY: "row_47",
          sortable: true
        },
        {
          title: "身份证号",
          field: "idCardNo",
          columnIndex: 7,
          show: "",
          align: "",
          defaultTitle: "身份证号",
          code: "",
          _X_ROW_KEY: "row_48",
          sortable: true
        },
        {
          title: "性别",
          field: "genderCode",
          columnIndex: 8,
          show: "",
          align: "",
          defaultTitle: "性别",
          code: "",
          _X_ROW_KEY: "row_49",
          sortable: true
        },
        {
          title: "籍贯",
          field: "nativePlaceCode",
          columnIndex: 9,
          show: "",
          align: "",
          defaultTitle: "籍贯",
          code: "",
          _X_ROW_KEY: "row_50",
          sortable: true
        },
        {
          title: "生日",
          field: "birthday",
          columnIndex: 10,
          show: "",
          align: "",
          defaultTitle: "生日",
          code: "",
          _X_ROW_KEY: "row_51",
          sortable: true
        },
        {
          title: "地址",
          field: "address",
          columnIndex: 11,
          show: "",
          align: "",
          defaultTitle: "地址",
          code: "",
          _X_ROW_KEY: "row_52",
          sortable: true
        },
        {
          title: "操作",
          field: "id",
          width: 250,
          fixed: "right",
          slots: {
            default: "rowAction"
          },
          columnIndex: 12,
          show: "",
          align: "",
          defaultTitle: "操作",
          code: "",
          _X_ROW_KEY: "row_53"
        }
      ];

      const json = {
        // data: [...list],
        // total: 100
        code: 0,
        data: list
      };
      resolve(json);
    }, 500);
  });
}

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
        props: {
          list: "data",
          show: "show",
          align: "align",
          fixed: "fixed"
        },
        mergeColumns: false,
        params: {
          code: "goods"
        },
        on: {},

        ajax: {
          query: json => {
            return new Promise(resolve => {
              getColumns({
                ...json,
                code: "aaaa"
              }).then(res => {
                resolve(res);
              });
            });
          }
        }
      },
      columns: [
        {
          title: "编号",
          field: "code"
        },
        {
          title: "名称",
          field: "name"
        },
        {
          title: "所属班级",
          field: "squadName"
        },
        {
          title: "状态",
          field: "statusName",
          slots: {
            default: ({ row }) => {
              if (row.status == 0) {
                return [<a-badge status="default" text={row.statusName} />];
              } else if (row.status == 1) {
                return [<a-badge status="processing" text={row.statusName} />];
              } else {
                return [<a-badge status="success" text={row.statusName} />];
              }
            }
          }
        },
        {
          title: "培训开始时间",
          field: "trainingBeginTime"
        },
        {
          title: "培训结束时间",
          field: "trainingEndTime"
        },
        {
          title: "电话",
          field: "phone"
        },
        {
          title: "身份证号",
          field: "idCardNo"
        },
        {
          title: "性别",
          field: "genderCode"
        },
        {
          title: "籍贯",
          field: "nativePlaceCode"
        },
        {
          title: "生日",
          field: "birthday"
        },
        {
          title: "地址",
          field: "address"
        },
        {
          title: "操作",
          field: "id",
          width: 250,
          fixed: "right",
          slots: { default: "rowAction" }
        }
      ]
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
