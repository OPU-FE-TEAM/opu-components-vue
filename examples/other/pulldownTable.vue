<template>
  <div>
    <pulldownTable
      :table="table"
      :searchBefore="onSearchBefore"
      searchField="key"
      v-model="value"
      style="width:300px"
      @inputChange="onInputChange"
      @change="onChange"
      textField="sex"
    />
  </div>
</template>

<script>
function getData(arr) {
  return new Promise(resolve => {
    setTimeout(() => {
      const size = arr.pageSize ? arr.pageSize : 20;
      const pageIndex = arr.pageIndex ? arr.pageIndex : 1;
      const list = Array.from({ length: size }, (_, key) => ({
        id: key,
        keyName: `name_${pageIndex}_${key}`,
        sex: key < 3 ? 1 : 2,
        age: key
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
      resolve(json);
    }, 500);
  });
}
export default {
  data() {
    return {
      table: {
        props: {
          columns: [
            { type: "checkbox", width: 50 },
            { type: "seq", title: "Number", width: 80 },
            {
              field: "keyName",
              title: "Name",
              width: 200
            },
            {
              field: "sex",
              title: "Sex",
              width: 200
            },
            {
              field: "age",
              title: "Age",
              width: 200
            }
          ],
          //   headToolbar: {
          //     buttons: [
          //       {
          //         name: "添加用户",
          //         code: "add",
          //         icon: "file-add",
          //         type: "primary"
          //       }
          //     ],
          //     search: {
          //       layout: "inline",
          //       titleWidth: "auto",
          //       on: {
          //         submit: values => {
          //         }
          //       },
          //       items: [
          //         {
          //           field: "name",
          //           title: "名称",
          //           itemRender: {
          //             name: "a-input",
          //             props: { placeholder: "请输入名称" }
          //           }
          //         },
          //         {
          //           field: "sex",
          //           title: "性别",
          //           itemRender: {
          //             name: "a-select",
          //             props: {
          //               placeholder: "请选择性别",
          //               showSearch: true,
          //               defaultField: "isSelected",
          //               valueField: "id",
          //               labelField: "name",
          //               param: { code: "aa" }
          //             }
          //           }
          //         },
          //         {
          //           field: "age",
          //           title: "年龄",
          //           folding: true,
          //           itemRender: {
          //             name: "a-input-number",
          //             props: { placeholder: "请输入年龄" }
          //           }
          //         },
          //         {
          //           colon: false,
          //           titleWidth: 0,
          //           folding: false,
          //           itemRender: {
          //             name: "buttons",
          //             items: [
          //               {
          //                 props: {
          //                   action: "submit",
          //                   content: "查询",
          //                   type: "primary"
          //                 }
          //               }
          //             ]
          //           }
          //         }
          //       ]
          //     }
          //   },
          height: 300,
          highlightHoverRow: true,
          highlightCurrentRow: true,
          proxyConfig: {
            ajax: {
              query: getData
            }
          }
        }
      },
      value: "123"
    };
  },
  methods: {
    onInputChange(e) {
      const { value } = e.target;
      console.log("change", value);
    },
    onSearchBefore(values) {
      console.log(values);
      //   return { keyword: value };
    },
    onChange(e) {
      console.log(e);
    }
  }
};
</script>
