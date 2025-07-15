import Vue from "vue";
import Component from "./Modal.vue";

const Constructor = Vue.extend(Component);

const ActionModal = options => {
  if (Vue.prototype.$isServer) return;
  const { ...rest } = options;
  const instance = new Constructor({
    propsData: {
      ...rest
    }
  });

  const id = `form-action-modal`;
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;

  //绑定 change 方法
  instance.vm.$on("submit", data => {
    if (instance.submit) {
      instance.submit(data);
    }
  });
  instance.vm.$on("destroy", () => {
    document.body.removeChild(instance.vm.$el);
  });
  return instance.vm;
};

export default ActionModal;
