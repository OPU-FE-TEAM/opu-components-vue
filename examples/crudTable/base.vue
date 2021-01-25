<template>
  <div>
    <crud-table
      ref="crudTable"
      :form="form"
      :proxy-config="proxyConfig"
      :modal="modal"
      :table="table"
      :permissions="permissions"
    >
      <template v-slot:rowActionBefore="{ row }">
        <a-button>前置插槽{{ row.id }}</a-button>
      </template>
      <template v-slot:rowActionAfter="{ row }">
        <a-button>后置插槽{{ row.id }}</a-button>
      </template>
      <template slot="formSlot">
        666
      </template>
      <template v-slot:formInputSlot="value">
        {{ value }}
        <a-input v-model="aaa"></a-input>
      </template>
      <template slot="searchFormSlot">
        101010
      </template>
      <template slot="headToolbar_buttons">
        <a-button @click="onAdd" type="primary">自定义新增按钮</a-button>
        <a-button :disabled="delDisabled">自定义按钮2</a-button>
        <a-button @click="toSearch">搜索</a-button>
      </template>
    </crud-table>
  </div>
</template>

<script>
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
        checkbox1: key === 5 ? true : false
      }));
      const json = {
        // data: [...list],
        // total: 100
        code: 0,
        data: {
          data: [...list],
          total: 100
        }
      };
      console.log(json);
      resolve(json);
    }, 500);
  });
}
function getColumns() {
  return new Promise(resolve => {
    setTimeout(() => {
      const list = [
        {
          field: "name"
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

function saveData() {
  return new Promise(resolve => {
    setTimeout(() => {
      const json = {
        code: 0,
        data: "",
        message: "啦啦啦"
      };
      resolve(json);
    }, 500);
  });
}
function getInfo() {
  return new Promise(resolve => {
    setTimeout(() => {
      const json = {
        code: 0,
        data: {
          id: 1,
          name: "张三",
          sex: 1,
          age: 20
        }
      };
      resolve(json);
    }, 10);
  });
}
export default {
  components: {},
  data() {
    return {
      delDisabled: false,
      permissions: ["add"],
      aaa: 123,
      proxyConfig: {
        add: {
          modalTitle: "新增会员",

          props: {
            icon: "file-add",
            name: "新增1"
          },
          open: () => {
            console.log("打开前");
            this.aaa = 222;

            // return () => {
            //   console.log("打开后");
            //   return {
            //     name: "789456"
            //   };
            // };
          },
          // submit: saveData
          submit: values => {
            // 可自行处理请求前
            return new Promise((resolve, reject) => {
              saveData({
                ...values,
                code: "aaaa"
              })
                .then(res => {
                  // 自行处理请求后
                  console.log("成功了");
                  resolve(res);
                })
                .catch(() => {
                  reject();
                });
            });
          }
        },
        edit: {
          modalTitle: "编辑会员",
          // permission: ["edit"],
          // permission: ({ row }) => {
          //   if (row.id == 2) {
          //     return true;
          //   }
          //   return false;
          // },

          props: {
            icon: "edit"
          },
          open: () => {
            console.log("打开前");
            return () => {
              console.log("打开后");
            };
          },
          // query: values => {
          //   // 自行处理请求前
          //   this.aaa = 5555;
          //   return new Promise(resolve => {
          //     getInfo({
          //       ...values
          //     }).then(res => {
          //       // 自行处理请求后,返回数据对象

          //       resolve(res.data);
          //     });
          //   });
          // },
          submit: saveData
          // submit: values => {
          //   // 自行处理请求前
          //   return new Promise((resolve, reject) => {
          //     saveData({
          //       ...values
          //     })
          //       .then(res => {
          //         // 自行处理请求后
          //         resolve(res);
          //       })
          //       .catch(() => {
          //         debugger;
          //         reject();
          //       });
          //   });
          // }
        },
        del: {
          props: {
            icon: "delete",
            name: "delete"
          },
          permission: ({ row }) => {
            if (row.id == 3) {
              return true;
            }
            return false;
          },
          submit: values => {
            // 自行处理请求前
            return new Promise(resolve => {
              saveData({
                ...values
              }).then(res => {
                // 自行处理请求后
                resolve(res);
              });
            });
          }
        },
        view: {
          queryDataField: "data",
          permission: ({ row }) => {
            if (row.id == 1) {
              return true;
            }
            return false;
          },
          // trigger: ["click", "button"], // click=单机行，dblclick=双击行，button 生成查看按钮
          query: getInfo
          // query: values => {
          //   // 自行处理请求前
          //   return new Promise(resolve => {
          //     getInfo({
          //       ...values
          //     }).then(res => {
          //       // 自行处理请求后,返回数据对象
          //       resolve(res.data);
          //     });
          //   });
          // }
        }
      },
      form: {
        props: {
          colspan: 2,
          titleWidth: 100,
          items: [
            {
              field: "id",
              itemRender: {
                name: "hidden"
              }
            },
            {
              field: "name",
              title: "名称",
              filter: ["add", "edit"],
              option: {
                rules: [{ required: true, message: "请输入!" }]
              },
              itemRender: {
                name: "a-input",
                props: {
                  placeholder: "请输入名称"
                  // disabled:true
                }
              }
            },
            {
              field: "sex",
              title: "性别",
              filter: ["edit"],
              itemRender: {
                name: "a-select",
                props: {
                  valueField: "id",
                  labelField: "name",
                  dataField: "aa",
                  options: [
                    {
                      id: 1,
                      name: "男"
                    },
                    {
                      id: 2,
                      name: "女",
                      isSelected: true
                    }
                  ]
                }
              }
            },
            {
              field: "age",
              title: "年龄",
              itemRender: {
                name: "a-input-number"
              }
            },
            {
              field: "formSlot",
              slot: "formSlot"
            },
            {
              field: "formInputSlot",
              title: "插槽",
              itemRender: {
                slot: "formInputSlot"
                // customRender: () => {
                //   return <a-input value={this.aaa} />;
                // }
              }
            }
          ]
        }
      },
      modal: {
        props: {
          // footer: () => {
          //   return <div>666</div>;
          // }
        }
      },
      table: {
        props: {
          editConfig: { trigger: "click", mode: "cell" },
          columns: [
            { type: "seq", title: "Number", width: 80 },
            {
              field: "name",
              title: "Name"
            },
            {
              field: "sex",
              title: "Sex"
            },
            {
              field: "age",
              title: "Age",
              width: 200,
              editRender: {
                name: "AInputNumber"
                // on: {
                //   // blur: this.onTableSortBlur,
                //   blur: e => {
                //     console.log(e);
                //   }
                // }
              }
            },
            {
              field: "id",
              title: "Action",
              slots: { default: "rowAction" }
            }
          ],
          headToolbar: {
            // buttons: [
            //   {
            //     name: "新单",
            //     code: "add",
            //     icon: "file-add",
            //     type: "primary"
            //   }
            // ],
            search: {
              layout: "inline",
              titleWidth: "auto",
              // foldingLayout:"flex",

              // on: {
              //   submit: values => {
              //     console.log(values);
              //   }
              // },
              advancedSearchModal: {
                props: {
                  width: 800,
                  title: "高级搜索1"
                }
              },
              advancedSearchForm: {
                props: {
                  layout: "flex",
                  colspan: 2
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
                      defaultField: "isSelected",
                      valueField: "id",
                      labelField: "name",
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
                  field: "searchFormSlot",
                  slot: "searchFormSlot",
                  folding: true
                },
                {
                  colon: false,
                  titleWidth: 0,
                  folding: false,
                  itemRender: {
                    name: "buttons",
                    items: [
                      {
                        props: {
                          action: "submit",
                          content: "查询",
                          type: "primary"
                        }
                      }
                      // { props: { action: "reset", content: "重置" } },
                      // {
                      //   props: {
                      //     action: "advancedQuery",
                      //     content: "高级查询"
                      //   }
                      // }
                    ]
                  }
                }
              ]
            }
            // tools: {
            //   // import: true,
            //   // custom: true,
            //   setColumns: true,
            //   export: true
            //   // print: true
            //   // refresh: true
            // }
          },
          height: "calc(100vh - 100px)",
          // size: "mini",
          proxyConfig: {
            seq: true, // 启用动态序号代理
            sort: true, // 启用排序代理
            filter: true, // 启用筛选代理
            form: true, // 启用表单代理
            props: {
              result: "data.data",
              total: "data.total",
              list: "data.data"
            },

            ajax: {
              query: getData
            }
          },
          setcolumnsConfig: {
            modal: {
              props: {
                title: "自定义标题"
              }
            },
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
          }
        },
        on: {
          "edit-closed": e => {
            console.log(e);
          }
        }
      }
    };
  },
  created() {
    // this.findList()
  },
  methods: {
    onChange() {
      debugger;
    },
    onAdd() {
      this.$refs.crudTable.add();
    },
    toSearch() {
      // this.$refs.crudTable.reloadTable({
      //   a: 2,
      //   b: 3,
      //   c: 4
      // });
      console.log(this.$refs.crudTable.getRefs());
    }
  }
};
</script>

<style lang="css"></style>
