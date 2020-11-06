import Vue from "vue";
import App from "./App.vue";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

import opuCompontents, { DataForm, DataTable } from "../index";
Vue.use(opuCompontents);
// Vue.use(DataForm);
import utils from "../packages/utils";

function getSelectData(arr) {
  return new Promise(resolve => {
    setTimeout(() => {
      const json = {};
      if (utils.isArray(arr.code)) {
        arr.code.map(item => {
          const list = Array.from({ length: 5 }, (_, key) => ({
            id: key,
            default: key == 2 ? true : false,
            name: `${item}_${key}`
          }));
          json[item] = list;
        });
      } else if (arr.code) {
        const list = Array.from({ length: 5 }, (_, key) => ({
          id: key,
          default: key == 2 ? true : false,
          name: `${arr.code}_${key}8888888888888888888`
        }));
        json[arr.code] = list;
      }
      resolve(json);
    }, 500);
  });
}

DataForm.setup({
  getSelectOptions: {
    api: getSelectData
  }
});
DataTable.setup({
  pagerConfig: {
    pageIndex: 0
  }
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
