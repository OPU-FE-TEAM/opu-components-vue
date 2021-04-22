<script>
import { SelectProps } from "ant-design-vue/lib/select/index";

import { utils } from "../../index";
// 处理表单项的可选数据结构为 antd所需的
function handleItemPropsOptions(options, _vm, pValue = "") {
  const { vF, lF, childrenField } = _vm;
  if (options && utils.isArray(options)) {
    const cloneOptions = utils.clone(options);
    return cloneOptions.map(item => {
      if (vF) {
        item.value = item[vF] + "";
      }
      if (lF) {
        item.label = item[lF];
      }
      if (pValue) {
        item._pValue = pValue;
      }
      if (item[childrenField] && item[childrenField].length) {
        item[childrenField] = handleItemPropsOptions(
          item[childrenField],
          _vm,
          item.value
        );
      }
      return item;
    });
  }
  return options;
}

function fetch(value, callback, _vm) {
  const { options, vF, lF, searchFields, childrenField } = _vm;
  let data = [];
  const newData = handleItemPropsOptions(utils.clone(options, true), _vm);
  if (value) {
    const keyword = value.toLowerCase();
    const searchFieldList = [vF, lF, ...searchFields];

    data = newData
      .map(item => {
        if (item[childrenField] && item[childrenField].length) {
          const children = item[childrenField].filter(p => {
            let is = false;
            for (let i = 0; i < searchFieldList.length; i++) {
              const key = searchFieldList[i];
              if (p[key]) {
                if (
                  p[key]
                    .toString()
                    .toLowerCase()
                    .indexOf(keyword) >= 0
                ) {
                  is = true;
                  break;
                }
              }
            }
            return is;
          });
          if (children && children.length) {
            item[childrenField] = children;
            return item;
          }
        }
        let is = false;
        for (let i = 0; i < searchFieldList.length; i++) {
          const key = searchFieldList[i];
          if (item[key]) {
            if (
              item[key]
                .toString()
                .toLowerCase()
                .indexOf(keyword) >= 0
            ) {
              is = true;
              break;
            }
          }
        }
        if (is) {
          return item;
        } else {
          return "";
        }
      })
      .filter(p => p !== "");
  } else {
    data = newData;
  }
  callback(data);
}
export default {
  props: {
    ...SelectProps,
    value: [Number, String, Object, Array],
    valueField: String,
    labelField: String,
    dataField: String,
    options: Array,
    searchFields: {
      type: Array,
      default: () => []
    },
    childrenField: String
  },
  data() {
    return {
      data: []
    };
  },
  computed: {
    vF() {
      return this.valueField;
    },
    lF() {
      return this.labelField;
    },
    componentProps() {
      const {
        $listeners,
        $options,
        value,
        // searchFields,
        // vF,
        // lF,
        // childrenField
        handleSearch
      } = this;
      const propsData = $options.propsData;

      const ons = {};
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          this.$emit(type, ...args);
        };
      });
      let currentValue = value;
      if (value && utils.isNumber(value)) {
        currentValue = value + "";
      } else if (value && utils.isArray(value)) {
        currentValue = value.map(p => p + "");
      }
      const props = {
        props: {
          ...propsData,
          showSearch: true,
          defaultActiveFirstOption: false,
          showArrow: false,
          filterOption: false,
          notFoundContent: null,
          value: currentValue
        },
        on: {
          ...ons,
          change: this.updateValue,
          search: handleSearch
        }
      };
      props.props.options = null;
      // props.props.filterOption = false;

      return props;
    }
  },
  created() {
    this.data = handleItemPropsOptions(this.options, this);
    // this.data = this.options;
    // this.handleSearch();
  },
  methods: {
    handleSearch(value) {
      fetch(value, data => (this.data = data), this);
    },
    renderOptGroup(h) {
      const { childrenField, data } = this;
      if (this.childrenField) {
        return data.map(group => {
          let options = "";
          if (group[childrenField] && group[childrenField].length) {
            options = group[childrenField].map(p => {
              return h("a-select-option", { props: { value: p.value } }, [
                p.label
              ]);
            });
            return h(
              "a-select-opt-group",
              {
                props: {
                  label: group.label,
                  key: Math.ceil(Math.random() * 100)
                }
              },
              [options]
            );
          }
          return h("a-select-option", { props: { value: group.value } }, [
            group.label
          ]);
        });
      }
      return "";
    }
  },
  render(h) {
    const { renderOptGroup, handleSearch, componentProps } = this;
    const optGroup = renderOptGroup(h);

    return h(
      "a-select",
      {
        ref: "inputComponent",
        props: {
          // showSearch: true,
          // defaultActiveFirstOption: false,
          // showArrow: false,
          // filterOption: false,
          // notFoundContent: null
          ...componentProps.props
        },
        style: {
          width: "100%"
        },
        on: {
          search: handleSearch
          // ...componentProps.on
        }
      },
      [...optGroup]
    );
  }
};
</script>
