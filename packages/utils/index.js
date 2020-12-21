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
  },
  /**
   * 将字符串复制到剪切板
   * @param {*} text
   */
  copyTextToClipboard(text) {
    const element = document.createElement("textarea");
    const previouslyFocusedElement = document.activeElement;
    element.value = text;
    element.setAttribute("readonly", "");
    element.style.contain = "strict";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.fontSize = "12pt";
    const selection = document.getSelection();
    let originalRange;
    if (selection && selection.rangeCount > 0) {
      originalRange = selection.getRangeAt(0);
    }
    document.body.append(element);
    element.select();
    element.selectionStart = 0;
    element.selectionEnd = text.length;
    let isSuccess = false;
    try {
      isSuccess = document.execCommand("copy");
    } catch (e) {
      throw new Error(e);
    }
    element.remove();
    if (originalRange && selection) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
    return isSuccess;
  },
  // 将指定字符（下划线）转换为首字母小写驼峰
  lineToUpperCase(str, sign = "_") {
    const arr = str.split(sign);
    let newStr = "";
    if (arr && arr.length) {
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        newStr += i > 0 ? p.replace(p[0], p[0].toUpperCase()) : p;
      }
    } else {
      newStr = str;
    }
    return newStr;
  }
});

export default XEUtils;
