<template>
  <a-modal
    :visible="visible"
    @cancel="visible = false"
    destroyOnClose
    title="title"
  >
    <data-table
      height="200px"
      :columns="tableColumn"
      :proxy-config="proxyConfig"
    >
    </data-table>
  </a-modal>
</template>

<script>
function getData(arr) {
  return new Promise(resolve => {
    setTimeout(() => {
      const size = arr.pageSize ? arr.pageSize : 20;
      const pageIndex = arr.pageIndex ? arr.pageIndex : 1;
      const list = Array.from({ length: size }, (_, key) => ({
        id: key,
        name: `name_${pageIndex}_${key}`,
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
      visible: false,
      tableColumn: [
        { type: "checkbox", colIndex: 0, width: 60, fixed: "left" },
        { type: "seq", title: "Number", colIndex: 1, width: 80 },
        {
          field: "name",
          title: "Name",
          width: 140
        },
        {
          field: "sex",
          title: "Sex",
          width: 140
        }
      ],
      proxyConfig: {
        ajax: {
          query: values => {
            return new Promise((resolve, reject) => {
              getData(values)
                .then(res => {
                  resolve(res);
                })
                .catch(() => {
                  reject();
                });
            });
          }
        }
      }
    };
  },
  created() {},
  methods: {
    show() {
      this.visible = true;
    }
  }
};
</script>
