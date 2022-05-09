<template>
  <div>
    <DataTable
      show-overflow
      keep-source
      ref="xGrid"
      height="calc(100vh - 100px)"
      :loading="loading"
      :data="tableData"
      :headToolbar="headToolbar"
      highlight-hover-row
      highlight-current-row
      @current-change="currentChangeEvent"
      @cell-click="onCellClick"
      :setcolumns-config="setColumns"
      :columns="tableColumn"
      size="small"
      :checkboxConfig="{ highlight: true, trigger: 'row' }"
      :edit-config="{ trigger: 'click', mode: 'cell' }"
      :searchConfig="search"
      :dragSort="true"
      :tree-config="{}"
      :rowKey="true"
      class="abc-table"
      :column-config="{ isHover: true, resizable: false }"
      :column-key="true"
      :highlight-hover-column="true"
      :sortable="true"
      :sort-config="{ remote: true }"
    >
      <template v-slot:operate="{ row }">
        <a-button @click="editRow(row)">编辑</a-button>
      </template>
      <!-- <template slot="headToolbar_buttons">
        <a-button @click="onAdd">自定义新增按钮</a-button>
        <a-button :disabled="delDisabled">自定义按钮2</a-button>
      </template> -->
    </DataTable>

    <a-button @click="getData">获取数据</a-button>
    <a-button @click="$refs.xGrid.showSetColumns()">设置表头1</a-button>
    <a-button @click="updateColumns">更新表头</a-button>
    <a-button @click="setSearchData">设置搜索表单数据</a-button>
    <a-button @click="getSearchData">获取搜索表单数据</a-button>
    <a-button @click="toSearch">搜索</a-button>
    <a-button @click="reload">刷新1</a-button>
    <a-button @click="setData">更新数据</a-button>
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
    setTimeout(() => {
      const code = arr && arr.code ? arr.code : "";
      const list = [
        {
          field: "name"
        },
        {
          id: "1",
          title: "基本信息" + code,
          field: "base",
          children: [
            {
              id: "1-1",
              field: "name1",
              title: "Name1",
              width: 100,
              align: "left",
              show: true
            },
            {
              title: "其他信息",
              id: "1-2",
              children: [
                {
                  id: "1-2-1",
                  field: "rate",
                  title: "Rate",
                  width: 100,
                  align: "left",
                  show: true
                },
                {
                  id: "1-2-2",
                  field: "age",
                  title: "Age",
                  width: 100,
                  align: "left",
                  show: true
                }
              ]
            },
            {
              id: "1-3",
              field: "sex",
              title: "Sex",
              width: 100,
              align: "left",
              show: false
            }
          ]
        },
        {
          id: "2",
          field: "address",
          title: "Address",
          width: 100,
          align: "left",
          show: true
        },
        {
          id: "3",
          field: "area",
          title: "Area",
          width: 100,
          align: "left",
          show: false
        },
        {
          id: "4",
          field: "city",
          title: "City",
          width: 100,
          align: "left",
          show: true
        }
      ];
      const json = {
        // data: [...list],
        // total: 100
        code: 0,
        data: {
          data: [...list],
          total: 100
        }
      };
      resolve(json);
    }, 500);
  });
}

function getSelectData(param) {
  console.log("mock: getSelectData param", param);
  return new Promise(resolve => {
    setTimeout(() => {
      const data = [
        {
          id: 1,
          name: "男1"
        },
        {
          id: 2,
          name: "女2"
        }
      ];
      const json = {
        code: 0,
        data: {
          data: data,
          total: 100
        }
      };
      console.log("mock: getSelectData return", json);
      resolve(json);
    });
  });
}

export default {
  components: {},
  data() {
    return {
      loading: false,
      tableForm: {
        data: {
          name: "",
          sex: ""
        },
        items: [
          {
            type: "checkbox",
            title: "",
            width: 30,
            fixed: "left"
          },
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
      search: {
        submitButtonProps: {
          content: "查询"
        },
        cancelButtonProps: {
          content: "重置"
        },
        colspan: 2,
        style: {
          maxWidth: "600px"
        },
        on: {
          submit: values => {
            console.log(values);
          }
        },
        items: [
          {
            field: "name",
            title: "名称",
            itemRender: {
              name: "a-input",
              props: { placeholder: "请输入名称" }
            }
          },
          {
            field: "sex",
            title: "性别",
            itemRender: {
              name: "a-select",
              props: {
                placeholder: "请选择性别",
                showSearch: true,
                api: getSelectData,
                defaultField: "isSelected",
                valueField: "id",
                labelField: "name",
                dataField: "data.data",
                param: { code: "aa" }
              }
            }
          },
          {
            field: "age",
            title: "年龄",
            folding: true,
            itemRender: {
              name: "a-input-number",
              props: { placeholder: "请输入年龄" }
            }
          }
        ]
      },
      headToolbar: {
        buttons: [
          {
            name: "新单",
            code: "add",
            icon: "file-add",
            type: "primary",
            on: {
              click: () => {
                console.log("add click");
              }
            }
          },
          [
            {
              name: "获取高亮行",
              key: "getCurrentRecord",
              icon: "edit",
              on: {
                click: this.getCurrentRecord
              }
            },
            {
              name: "作废",
              key: "del",
              icon: "delete",
              disabled: this.delDisabled
            }
          ],
          {
            name: "更多",
            code: "more",
            icon: "file-add",
            // disabled:true,
            dropdowns: [
              {
                name: "更多1",
                code: "more1",
                icon: "delete",
                disabled: true
              },
              {
                name: "更多2",
                code: "more2",
                icon: "delete"
              }
            ]
          }
        ],
        search: {
          layout: "inline",
          titleWidth: "auto",
          // position: "left",

          // foldingLayout:"flex",
          style: { width: "500px" },
          submitButtonProps: {
            content: "查询"
          },
          cancelButtonProps: false,
          colspan: 2,

          on: {
            // submit: values => {
            //   console.log(values);
            // }
          },
          // advancedSearchButtonProps: {
          //   content: "高级"
          // },
          // advancedSearchModal: {
          //   props: {
          //     width: 800,
          //     title: "高级搜索1"
          //   }
          // },
          advancedSearchForm: {
            props: {
              layout: "grid",
              colspan: 2
            },
            on: {
              open: (advancedSearchForm, formData) => {
                console.log(advancedSearchForm);
                console.log(formData);
                debugger;
              }
            }
          },
          items: [
            {
              field: "name",
              title: "名称",
              itemRender: {
                name: "a-input",
                props: { placeholder: "请输入名称" }
              }
            },
            {
              field: "sex",
              title: "性别",
              itemRender: {
                name: "a-select",
                props: {
                  placeholder: "请选择性别",
                  showSearch: true,
                  api: getSelectData,
                  defaultField: "isSelected",
                  valueField: "id",
                  labelField: "name",
                  dataField: "data.data",
                  param: { code: "aa" }
                }
              }
            },
            {
              field: "age",
              title: "年龄",
              folding: true,
              itemRender: {
                name: "a-input-number",
                props: { placeholder: "请输入年龄" }
              }
            },
            {
              field: "key",
              title: "关键词",
              folding: false,
              itemRender: {
                name: "a-input"
              }
            }
            // {
            //   colon: false,
            //   // titleWidth: 0,
            //   // folding: false,
            //   colspan: 2,
            //   // align: "center",
            //   title: "",
            //   itemRender: {
            //     name: "buttons",
            //     items: [
            //       {
            //         props: {
            //           action: "submit",
            //           content: "查询",
            //           type: "primary"
            //         }
            //       },
            //       { props: { action: "reset", content: "重置" } }
            //       // { props: { action: "advancedQuery", content: "高级查询" } }
            //     ]
            //   }
            // }
          ]
        },
        tools: {
          import: true,
          custom: true,
          // setColumns: true,
          export: true,
          print: true,
          refresh: true
        }
      },
      setColumns: {
        // modal: {
        //   props: {
        //     title: "自定义标题"
        //   }
        // },
        proxyConfig: {
          props: {},
          ajax: {
            query: json => {
              return new Promise(resolve => {
                console.log(json);
                getColumns({
                  ...json,
                  code: "aaaa"
                }).then(res => {
                  resolve(res);
                });
              });
            },
            submit: getColumns
          }
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
        ajax: {
          query: json => {
            return new Promise(resolve => {
              console.log(json);
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
      treeConfig: {
        children: "children"
      },
      tableColumn: [
        {
          field: "select",
          title: "下拉框",
          width: 140,
          editRender: {
            name: "ASelect",
            options: [
              { value: 1, label: "男" },
              { value: 2, label: "女" }
            ]
          }
        },
        // { type: "checkbox", colIndex: 0, width: 60, fixed: "left" },
        // {
        //   width: 60,
        //   align: "center",
        //   slots: {
        //     default: () => {
        //       return [
        //         <span class="drag-btn">
        //           <i class="vxe-icon--menu"></i>
        //         </span>
        //       ];
        //     },
        //     header: () => {
        //       return "排序";
        //     }
        //   }
        // },
        // { type: "seq", title: "Number", colIndex: 1, width: 80 },
        // // {
        // //   field: "pulldownTable",
        // //   title: "下拉面板",
        // //   minWidth: 140,
        // //   editRender: {
        // //     name: "pulldownTable",
        // //     props: {
        // //       valueField: "id",
        // //       textField: "name",
        // //       table: {
        // //         props: {
        // //           size: "mini",
        // //           columns: [
        // //             { type: "checkbox", width: 50 },
        // //             { type: "seq", title: "Number", width: 80 },
        // //             {
        // //               field: "name",
        // //               title: "Name",
        // //               width: 200
        // //             },
        // //             {
        // //               field: "sex",
        // //               title: "Sex",
        // //               width: 200
        // //             },
        // //             {
        // //               field: "age",
        // //               title: "Age",
        // //               width: 200
        // //             }
        // //           ],
        // //           height: 300,
        // //           highlightHoverRow: true,
        // //           highlightCurrentRow: true,
        // //           proxyConfig: {
        // //             ajax: {
        // //               query: getData
        // //             }
        // //           }
        // //         }
        // //       }
        // //     },
        // //     on: {
        // //       change: ({ row }) => {
        // //         console.log("490", row.pulldownTable);
        // //       }
        // //     }
        // //   }
        // // },
        // {
        //   field: "name",
        //   title: "Name",
        //   width: 140,
        //   treeNode: true,
        //   editRender: { name: "AInput" }
        // },
        // {
        //   field: "checkbox",
        //   title: "Checkbox",
        //   width: 140,
        //   editRender: {
        //     name: "ACheckbox",
        //     on: {
        //       change: ({ row }) => {
        //         console.log(row.checkbox);
        //       }
        //     }
        //   }
        // },

        // // {
        // //   field: "select1",
        // //   title: "下拉框请求下拉数据",
        // //   width: 140,
        // //   editRender: {
        // //     name: "ASelect",
        // //     options: [],
        // //     optionProps: {
        // //       value: "id",
        // //       label: "name"
        // //     }
        // //   }
        // // },
        // // {
        // //   field: "cascader",
        // //   title: "级联选择",
        // //   width: 140,
        // //   editRender: {
        // //     name: "ACascader",
        // //     props: {
        // //       options: []
        // //     }
        // //   }
        // // },
        // // {
        // //   field: "datePicker",
        // //   title: "日期选择",
        // //   width: 140,
        // //   editRender: {
        // //     name: "ADatePicker",
        // //     props: {}
        // //   }
        // // },
        // // {
        // //   field: "timePicker",
        // //   title: "时间选择",
        // //   width: 200,
        // //   editRender: {
        // //     name: "ATimePicker"
        // //   }
        // // },
        {
          field: "switch",
          title: "开关",
          width: 100,
          editRender: {
            name: "ASwitch",
            on: {
              change: ({ row }) => {
                console.log(row.checkbox);
              }
            }
          }
          // slots: { default: "switch", edit: "switch" }
        },
        { title: "操作", width: 200, slots: { default: "operate" } }
      ],
      tableData: [
        {
          id: 1,
          name: "a1",
          sex: 1,
          select: "",
          switch: false,
          children: [
            {
              id: "a11",
              name: "cname1"
            },
            {
              id: "a12",
              name: "cname2"
            }
          ]
        },
        {
          id: 2,
          name: "a2",
          sex: 1,
          select: "",
          switch: true,
          children: [
            {
              id: "a21",
              name: "cname1"
            },
            {
              id: "a22",
              name: "cname2"
            }
          ]
        },
        {
          id: 3,
          name: "a3",
          sex: 1,
          children: [
            {
              id: "a31",
              name: "cname1"
            },
            {
              id: "a32",
              name: "cname2"
            }
          ]
        }
      ],
      delDisabled: false,
      currentRow: {}
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
