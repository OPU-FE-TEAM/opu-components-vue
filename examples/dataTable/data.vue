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
      :sortable="true"
      :sort-config="{ remote: true }"
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

      tableColumn: [
        { type: "checkbox", colIndex: 0, width: 60, fixed: "left" },
        {
          title: "name",
          field: "name",
          sortable: true
        },
        {
          title: "sex",
          field: "sex"
        },

        { title: "操作", width: 200, slots: { default: "operate" } }
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
  methods: {}
};
</script>

<style lang="css"></style>
