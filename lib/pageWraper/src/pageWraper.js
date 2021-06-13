"use strict";

var _interopRequireDefault = require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.regexp.constructor");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("D:/OpenSource/OPU/opu-components-vue/node_modules/@babel/runtime/helpers/esm/objectSpread2"));

var baseCardbodyStyle = {
  padding: "10px"
};
var _default2 = {
  name: "PageWraper",
  props: {
    type: {
      type: String,
      default: "card"
    },
    bodyStyle: {
      type: Object,
      default: function _default() {}
    },
    tabs: {
      type: Object,
      default: function _default() {}
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
  data: function data() {
    return {
      tabActive: "1"
    };
  },
  created: function created() {
    // const tabKey = this.$route.query.tab;
    if (this.defaultTab) {
      this.tabActive = this.defaultTab + "";
    } else if (this.tabs && this.tabs.items && this.tabs.items.length) {
      this.tabActive = this.tabs.items[0].key;
    }
  },
  methods: {
    handleTabChange: function handleTabChange(key) {
      if (this.updateUrl) {
        var newurl = this.updateQueryStringParameter(window.location.href, "tab", key); //向当前url添加参数，没有历史记录

        window.history.replaceState({
          path: newurl
        }, "", newurl);
      }

      this.tabActive = key;

      if (this.tabs && this.tabs.change) {
        this.tabs.change(key);
      }

      this.$emit("tabChange", key);
    },
    updateQueryStringParameter: function updateQueryStringParameter(uri, key, value) {
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
  render: function render(h) {
    var _this = this;

    var content = this.$slots.default;

    if (this.type == "card") {
      var bodyStyle = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, baseCardbodyStyle), this.bodyStyle);
      var cardOption = {
        props: {
          bordered: false,
          bodyStyle: bodyStyle
        }
      };
      var title = this.$slots.title ? this.$slots.title : this.title;
      var desc = this.$slots.desc ? this.$slots.desc : this.desc;
      var extra = this.$slots.extra ? this.$slots.extra : this.extra;

      if (title || desc) {
        var titleDom = "";
        var descDom = "";

        if (title) {
          titleDom = h("div", {
            "class": "title"
          }, [title]);
        }

        if (desc) {
          descDom = h("div", {
            "class": "desc"
          }, [desc]);
        }

        cardOption.props.title = function () {
          return h("div", {
            "class": "card-title-wraper"
          }, [titleDom, descDom]);
        };
      }

      if (extra) {
        cardOption.props.extra = extra;
      }

      var cardContent = this.$slots.default;

      if (this.tabs) {
        cardOption.props.tabList = this.tabs.items.map(function (tab) {
          return {
            key: tab.key,
            tab: tab.tab
          };
        });
        cardOption.props.activeTabKey = this.tabActive;
        var tabItem = this.tabs.items.find(function (p) {
          return p.key === _this.tabActive;
        });

        if (tabItem && tabItem.content) {
          cardContent = [tabItem.content()];
        }

        cardOption.on = {
          tabChange: this.handleTabChange
        };
      }

      content = h("div", {
        class: "page-wraper-content"
      }, [h("a-card", (0, _objectSpread2.default)({}, cardOption), [h("div", {
        class: "page-wraper-card__content"
      }, cardContent)])]);
    }

    return h("div", {
      "class": "page-wraper"
    }, [content]);
  }
};
exports.default = _default2;