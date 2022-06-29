import { TreeSelectProps } from "ant-design-vue/lib/tree-select/interface";
import utils from "../../utils";

export default {
  name: "optionsComponent",
  components: {},
  props: {
    ...TreeSelectProps(),
    searchFields: {
      type: Array,
      default: () => []
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      optionsData: []
    };
  },
  watch: {
    treeData(val) {
      this.setOptionsData(val);
    }
  },
  computed: {
    componentProps() {
      const {
        $listeners,
        $options,
        optionsData,
        replaceFields,
        searchFields
      } = this;
      const propsData = $options.propsData;

      const ons = {};
      utils.each($listeners, (cb, type) => {
        ons[type] = (...args) => {
          this.$emit(type, ...args);
        };
      });
      const props = {
        props: {
          ...propsData
        },
        on: {
          ...ons,
          change: this.updateValue
        }
      };

      if (props.props.showSearch && !props.props.filterTreeNode) {
        props.props.filterTreeNode = (value, treeNode) => {
          const obj = treeNode.componentOptions.propsData.dataRef;
          let is = false;
          const searchFieldList = [
            replaceFields.key,
            replaceFields.title,
            ...searchFields
          ];
          for (let i = 0; i < searchFieldList.length; i++) {
            const key = searchFieldList[i];
            if (obj[key]) {
              if (
                obj[key]
                  .toString()
                  .toLowerCase()
                  .indexOf(value.toLowerCase()) >= 0
              ) {
                is = true;
                break;
              }
            }
          }
          return is;
        };
      }
      props.props.treeData = optionsData;
      return props;
    }
  },
  created() {
    this.optionsData = this.treeData;
  },
  methods: {
    updateValue(value) {
      this.$emit("update", value);
      this.$emit("change", value);
    },
    setOptionsData(data) {
      this.optionsData = data;
      return data;
    },
    getOptionsData() {
      return this.optionsData;
    },
    focus() {
      const input = this.$refs.inputComponent;
      input.focus();
    },
    blur() {
      const input = this.$refs.inputComponent;
      input.blur();
      input.$refs.vcTreeSelect.onDropdownVisibleChange(false);
    }
  },
  render(h) {
    const { componentProps } = this;
    return h(
      "a-tree-select",
      {
        ref: "inputComponent",
        props: {
          ...componentProps.props
        },
        on: {
          ...componentProps.on
        }
      },
      []
    );
  }
};
