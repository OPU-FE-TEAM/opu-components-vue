import Vue from "vue";
import setColumnsComponent from "./setColumns.js";
const setColumnsConstructor = Vue.extend(setColumnsComponent);
let setp = 1;
const setColumnsModal = options => {
  if (Vue.prototype.$isServer) return;
  const { ...rest } = options;
  const instance = new setColumnsConstructor({
    propsData: {
      ...rest
    }
  });

  const id = `setColumnsModal_${setp}`;
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  setp++;

  //绑定 submit 方法
  instance.vm.$on("submit", selecteds => {
    if (instance.submit) {
      instance.submit(selecteds);
    }
  });
  instance.vm.$on("cancel", selecteds => {
    if (instance.cancel) {
      instance.cancel(selecteds);
    }
  });
  instance.vm.$on("destroy", () => {
    document.body.removeChild(instance.vm.$el);
  });
  return instance.vm;
};

export default setColumnsModal;
