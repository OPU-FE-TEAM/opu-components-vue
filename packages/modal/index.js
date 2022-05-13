import modal from "./src/modal";

modal.install = function(Vue) {
  Vue.component(modal.name, modal);
};
export const Modal = modal;
export default modal;
