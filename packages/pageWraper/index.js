import pageWraper from "./src/pageWraper";

pageWraper.install = function(Vue) {
  Vue.component(pageWraper.name, pageWraper);
};
export const PageWraper = pageWraper;
export default pageWraper;
