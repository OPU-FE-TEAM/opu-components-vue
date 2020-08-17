import XEUtils from 'xe-utils'


XEUtils.mixin({
    // 获取对象中指定key的值
    getObjData(key, obj) {
        let value = obj;
        if (key.indexOf(".") > -1) {
          const keysArr = key.split(".");
          for (let i = 0; i < keysArr.length; i++) {
            const k = keysArr[i];
            value = value[k];
          }
        } else {
          value = value[key];
        }
        return value;
      }
  })



export default XEUtils;