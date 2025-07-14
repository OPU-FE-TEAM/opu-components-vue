<template>
  <div>
    <DataTable
      ref="xGrid"
      height="calc(100vh - 100px)"
      :columns="columns"
      :headToolbar="headToolbar"
      :proxyConfig="proxyConfig"
      highlight-hover-row
      highlight-current-row
      size="small"
      :highlight-hover-column="true"
    >
    </DataTable>
  </div>
</template>

<script>
// import {utils} from '../../index'

function getData(arr) {
  return new Promise(resolve => {
    setTimeout(() => {
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

export default {
  components: {},
  data() {
    return {
      loading: false,
      columns: [{ field: "name", title: "名称" }],
      headToolbar: {
        search: {
          layout: "inline",
          titleWidth: "auto",
          items: [
            // {
            //   field: "name1",
            //   title: "名称",
            //   itemRender: {
            //     name: "a-input",
            //     props: { placeholder: "请输入名称" }
            //   }
            // },
            {
              field: "name",
              title: "名称",
              itemRender: {
                name: "a-input",
                props: { placeholder: "请输入名称" }
              }
            },
            {
              field: "name1",
              title: "名称",
              folding: true,
              itemRender: {
                name: "a-input",
                props: { placeholder: "请输入名称" }
              }
            }
          ]
        }
      },
      proxyConfig: {
        props: {
          result: "data.data",
          total: "data.total",
          list: "data.data"
        },
        autoLoad: false,
        ajax: {
          query: getData
        }
      }
    };
  },
  created() {},
  methods: {}
};
</script>

<style lang="css"></style>
