import XEUtils from "xe-utils";

XEUtils.mixin({
  // 获取对象中指定key的值
  getObjData(key, obj) {
    let value = obj;
    if (key && key.indexOf(".") > -1) {
      const keysArr = key.split(".");
      for (let i = 0; i < keysArr.length; i++) {
        const k = keysArr[i];
        if (value[k]) {
          value = value[k];
        } else {
          break;
        }
      }
    } else if (key) {
      value = value[key];
    }
    return value;
  },
  /**
   * 判断两个数组中是否存在相同值
   * @param {*} array
   * @param {*} array1
   */
  hasEquaValueArray(array, array1) {
    if (XEUtils.isArray(array) && XEUtils.isArray(array1)) {
      const equaValues = array.filter(p => array1.includes(p));
      if (equaValues.length) {
        return true;
      }
    }
    return false;
  }
});

export default XEUtils;
