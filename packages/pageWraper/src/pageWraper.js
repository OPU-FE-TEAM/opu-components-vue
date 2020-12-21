const baseCardbodyStyle = {
  padding: "10px"
};
export default {
  name: "PageWraper",
  props: {
    type: {
      type: String,
      default: "card"
    },
    bodyStyle: {
      type: Object,
      default: () => {}
    },
    tabs: {
      type: Object,
      default: () => {}
    },
    updateUrl: {
      type: Boolean
    },
    defaultTab: {
      type: String
    },
    title: String,
    desc: String,
    extra: String
  },
  data() {
    return {
      tabActive: "1"
    };
  },
  created() {
    // const tabKey = this.$route.query.tab;
    if (this.defaultTab) {
      this.tabActive = this.defaultTab + "";
    } else if (this.tabs && this.tabs.items && this.tabs.items.length) {
      this.tabActive = this.tabs.items[0].key;
    }
  },
  methods: {
    handleTabChange(key) {
      if (this.updateUrl) {
        const newurl = this.updateQueryStringParameter(
          window.location.href,
          "tab",
          key
        );
        //向当前url添加参数，没有历史记录
        window.history.replaceState(
          {
            path: newurl
          },
          "",
          newurl
        );
      }

      this.tabActive = key;
      if (this.tabs && this.tabs.change) {
        this.tabs.change(key);
      }
      this.$emit("tabChange", key);
    },
    updateQueryStringParameter(uri, key, value) {
      if (!value) {
        return uri;
      }
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf("?") !== -1 ? "&" : "?";
      if (uri.match(re)) {
        return uri.replace(re, "$1" + key + "=" + value + "$2");
      } else {
        return uri + separator + key + "=" + value;
      }
    }
  },
  render(h) {
    let content = this.$slots.default;
    if (this.type == "card") {
      const bodyStyle = { ...baseCardbodyStyle, ...this.bodyStyle };
      const cardOption = {
        props: {
          bordered: false,
          bodyStyle: bodyStyle
        }
      };
      const title = this.$slots.title ? this.$slots.title : this.title;
      const desc = this.$slots.desc ? this.$slots.desc : this.desc;
      const extra = this.$slots.extra ? this.$slots.extra : this.extra;
      if (title || desc) {
        let titleDom = "";
        let descDom = "";
        if (title) {
          titleDom = <div class="title">{title}</div>;
        }
        if (desc) {
          descDom = <div class="desc">{desc}</div>;
        }
        cardOption.props.title = () => {
          return (
            <div class="card-title-wraper">
              {titleDom}
              {descDom}
            </div>
          );
        };
      }
      if (extra) {
        cardOption.props.extra = extra;
      }
      let cardContent = this.$slots.default;
      if (this.tabs) {
        cardOption.props.tabList = this.tabs.items.map(tab => {
          return {
            key: tab.key,
            tab: tab.tab
          };
        });
        cardOption.props.activeTabKey = this.tabActive;
        const tabItem = this.tabs.items.find(p => p.key === this.tabActive);
        if (tabItem && tabItem.content) {
          cardContent = [tabItem.content()];
        }
        cardOption.on = {
          tabChange: this.handleTabChange
        };
      }

      content = h("div", { class: "page-wraper-content" }, [
        h(
          "a-card",
          {
            ...cardOption
          },
          [h("div", { class: "page-wraper-card__content" }, cardContent)]
        )
      ]);
    }

    return <div class="page-wraper">{content}</div>;
  }
};
