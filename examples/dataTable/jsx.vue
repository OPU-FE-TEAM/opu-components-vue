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
        switch: false
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

export default {
  components: {},
  data() {
    return {
      value: 0
    };
  },
  created() {
    // this.findList()
  },
  methods: {
    onChange({ row }) {
      this.value = row.name;
    },
    onClick() {
      // this.value = this.value + 1;
      this.$refs.pulldownTable.showPanel();
    }
  },
  render(h) {
    const { onChange, onClick } = this;
    const tableProps = {
      ref: "table",
      props: {
        height: 600,
        columns: [
          { type: "checkbox", width: 50 },
          { type: "seq", title: "Number", width: 80 },
          {
            field: "name",
            title: "Name",
            width: 180
          },
          {
            field: "sex",
            title: "Sex",
            width: 150
          },
          {
            field: "age",
            title: "Age",
            width: 150
          }
        ],
        proxyConfig: {
          ajax: {
            query: getData
          }
        }
      },
      on: {
        "checkbox-change": onChange
      },
      slot: "dropdown"
    };
    console.log(this.value, tableProps);
    return h("vxe-pulldown", { ref: "pulldownTable" }, [
      h("a-input", {
        ...{ props: { value: this.value }, on: { focus: onClick } }
      }),
      h("data-table", { ...tableProps })
    ]);
  }
};
</script>
