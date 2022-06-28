<template>
  <div>
    <a-button @click="showSetColumns">设置表头1</a-button>
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
      :setcolumns-config="setcolumnsConfig"
      :proxy-columns="proxyColumns"
      :head-toolbar="headToolbar"
    >
      <!-- :checkboxConfig="{ highlight: true, trigger: 'row' }" -->
    </DataTable>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    const goodsItem = {
      title: "物品",
      field: "goodsName",
      itemRender: {
        name: "pulldown-table",
        props: {
          valueField: "name",
          searchField: "keyword",
          allowInputValue: false,
          retainSearchValue: false,
          table: {
            props: {
              sortable: true,
              sortConfig: { remote: true },
              columns: [
                // {
                //   field: "name",
                //   title: "物品名称"
                // },
                // {
                //   field: "goodsCode",
                //   title: "物品编码"
                // },
                // {
                //   field: "ending",
                //   title: "期末",
                //   children: [
                //     {
                //       field: "endingQuantity",
                //       title: "期末数量"
                //     },
                //     {
                //       field: "endingAvgPrice",
                //       title: "期末进货均价"
                //     },
                //     {
                //       field: "endingTotalPrice",
                //       title: "期末进货金额"
                //     },
                //     {
                //       field: "endingRetailPrice",
                //       title: "期末售价金额"
                //     }
                //   ]
                // }
              ],
              height: "400px",
              highlightHoverRow: true,
              highlightCurrentRow: true,
              proxyColumns: {
                params: {
                  queryFlag: true
                }
              },
              setcolumnsConfig: {
                proxyConfig: {
                  params: {
                    queryFlag: false
                  }
                }
              },

              proxyConfig: {
                autoLoad: true,
                ajax: {
                  query: () => {
                    return new Promise(resolve => {
                      console.log("请求数据");
                      resolve({
                        code: 0,
                        data: {
                          datas: [
                            {
                              id: 1,
                              name: "aaaa",
                              endingQuantity: "111",
                              endingAvgPrice: "22"
                            },
                            {
                              id: 2,
                              endingQuantity: "aaa",
                              endingAvgPrice: "bbb",
                              name: "bbbb"
                            }
                          ]
                        }
                      });
                    });
                  }
                }
              }
            },
            style: {
              width: "calc(65vw)"
            }
          }
        },
        on: {}
      }
    };
    return {
      loading: false,
      headToolbar: {
        search: {
          layout: "inline",
          titleWidth: "auto",
          items: [
            goodsItem,
            {
              field: "keyword",
              title: "关键字",
              folding: true,
              itemRender: {}
            }
          ],
          advancedSearchModal: {
            props: {
              width: 800,
              title: "高级搜索"
            }
          },
          advancedSearchForm: {
            props: {
              layout: "flex",
              colspan: 2
            }
          },
          advancedSearchButtonProps: {
            content: "高级搜索"
          },
          submitButtonProps: { content: "搜索" }
        }
      },
      // proxyColumns: {
      //   params: {
      //     queryFlag: false,
      //     typeCode: "abc"
      //   }
      // },
      setColumnsConfig: {
        proxyConfig: {
          params: { queryFlag: false, typeCode: "StatisticList" }
        }
      },
      proxyColumns: {
        params: { queryFlag: true, typeCode: "StatisticList" }
      },
      setColumns: {
        // modal: {
        //   props: {
        //     title: "自定义标题"
        //   }
        // },
        proxyConfig: {
          props: {}
        }
      },

      tableColumn: [
        // {
        //   type: "checkbox",
        //   title: "",
        //   width: 30,
        //   fixed: "left"
        // },
        // { type: "checkbox", colIndex: 0, width: 60, fixed: "left" },
        {
          field: "name",
          itemRender: {
            name: "a-input"
          }
        },
        {
          field: "ending",
          children: [
            {
              field: "endingQuantity",

              slots: {
                default: ({ row }) => {
                  return [<b>{row.endingQuantity}</b>];
                }
              }
            },
            {
              field: "endingAvgPrice",
              slots: {
                default: ({ row }) => {
                  return [<b>{row.endingAvgPrice}</b>];
                }
              }
            }
          ]
        }
      ],
      tableData: [
        {
          id: 1,
          name: "a1",
          sex: 1,
          endingQuantity: "111",
          endingAvgPrice: "22"
        },
        {
          id: 2,
          name: "a2",
          sex: 1,
          endingQuantity: "44",
          endingAvgPrice: "2332"
        },
        {
          id: 3,
          name: "a3",
          sex: 1,
          endingQuantity: "11441",
          endingAvgPrice: "222"
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
          // columns: [
          //   {
          //     width: 60,
          //     align: "center",
          //     slots: {
          //       default: "btn_default",
          //       header: () => {
          //         return "排序";
          //       }
          //     }
          //   },
          //   {
          //     field: "defaultTitle",
          //     title: "666",
          //     itemRender: {
          //       name: "a-input"
          //     }
          //   },
          //   // {
          //   //   field: "title",
          //   //   title: "显示标题",
          //   //   align: "center",
          //   //   itemRender: { name: "AInput" }
          //   // },
          //   {
          //     field: "width",
          //     title: "列宽",
          //     align: "center",
          //     itemRender: { name: "AInputNumber" }
          //   },
          //   {
          //     field: "align",
          //     title: "对齐方式",
          //     align: "center",
          //     itemRender: {
          //       name: "ASelect",
          //       options: [
          //         { label: "居左", value: "left" },
          //         { label: "居中", value: "center" },
          //         { label: "居右", value: "right" }
          //       ]
          //     }
          //   },
          //   {
          //     field: "show",
          //     title: "显示",
          //     align: "center",
          //     // slots: { default: "show_default" }
          //     itemRender: { name: "ACheckbox" }
          //   },
          //   {
          //     field: "fixed",
          //     title: "固定01",
          //     align: "center",
          //     itemRender: {
          //       name: "ASelect",
          //       options: [
          //         { label: "不固定", value: "" },
          //         { label: "靠左", value: "left" },
          //         { label: "靠右", value: "right" }
          //       ]
          //     }
          //   }
          // ]
        }
      }
    };
  },
  created() {
    // const list = Array.from({ length: 110 }, (_, key) => ({
    //   id: key,
    //   name: `abc_${key}`,
    //   age: key
    // }));
    // this.tableData = list;
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
    },
    showSetColumns() {
      this.$refs.xGrid.showSetColumns();
    }
  }
};
</script>

<style lang="css"></style>
