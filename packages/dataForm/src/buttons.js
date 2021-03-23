function renderButtons(items, h, _vm) {
  const { onClick } = _vm;

  return items
    ? items.map((item, index) => {
        let buttonText =
          item.props && item.props.content ? item.props.content : "";
        if (buttonText && typeof buttonText === "function") {
          buttonText = [buttonText()];
        }

        const props = {
          ...item,
          key: index
        };
        if (item.props.action) {
          props.on = {
            ...item.on,
            click: e => {
              onClick(item, e);
            }
          };
        }
        return h("a-button", props, buttonText);
      })
    : [];
}

export default {
  name: "DataForm",
  components: {},
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemClick: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    onClick(item, e) {
      const { itemClick } = this;
      if (item && item.props && item.props.action) {
        itemClick && itemClick(item.props.action, e);
      }
    }
  },
  render(h) {
    const { items } = this;
    return h(
      "div",
      {
        class: "data-form-buttons"
      },
      [].concat(renderButtons(items, h, this))
    );
  }
};
