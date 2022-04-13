<template>
  <div>
    <DataTable
      show-overflow
      keep-source
      ref="xGrid"
      height="calc(100vh - 100px)"
      :loading="loading"
      :data="tableData"
      :columns="tableColumn"
      :setcolumns-config="{ proxyConfig: proxyColumns }"
      :proxy-columns="proxyColumns"
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
        // {
        //   title: "name",
        //   field: "name",
        //   sortable: true
        // },
        // {
        //   title: "sex",
        //   field: "sex"
        // },
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
      ]
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
