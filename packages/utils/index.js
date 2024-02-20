import XEUtils from "xe-utils";

//  查询当前options中 是否存在指定值
function hasOptionsValue(options, value, valueField, childrenField) {
  let is = false;
  for (let i = 0; i < options.length; i++) {
    let item = options[i];
    if (item[valueField] == value) {
      is = true;
    } else if (item[childrenField] && item[childrenField].length > 0) {
      is = hasOptionsValue(
        item[childrenField],
        value,
        valueField,
        childrenField
      );
    }
    if (is) break;
  }

  return is;
}

function hasOptionsMultipleValue(
  options,
  value,
  valueField,
  childrenField,
  existValue = []
) {
  for (let i = 0; i < options.length; i++) {
    let item = options[i];
    if (value.indexOf(item[valueField]) > -1) {
      existValue.push(item[valueField]);
    }
    if (item[childrenField] && item[childrenField].length > 0) {
      existValue = existValue.concat(
        hasOptionsMultipleValue(
          item[childrenField],
          value,
          valueField,
          childrenField
        )
      );
    }

    if (existValue.length == value.length) break;
  }

  return existValue;
}

XEUtils.mixin({
  // 获取对象中指定key的值
  getObjData(key, obj) {
    let value = obj;
    if (key && key.indexOf(".") > -1) {
      const keysArr = key.split(".");
      for (let i = 0; i < keysArr.length; i++) {
        const k = keysArr[i];
        if (value[k] !== undefined) {
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
   * @description: 对象中指定key的值 更改
   * @param {*} key
   * @param {*} obj
   * @param {*} value
   * @return {*}
   */
  setObjData(key, obj, value) {
    let target = obj;
    if (key && key.indexOf(".") > -1) {
      const keysArr = key.split(".");
      for (let i = 0; i < keysArr.length; i++) {
        const k = keysArr[i];
        if (i + 1 == keysArr.length) {
          target[k] = value;
        } else {
          target = target[k];
        }
      }
    } else if (key) {
      target[key] = value;
    }
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
  },
  // 树形结构转为数组
  treeTransArray(tree, key = "children") {
    return [].concat(
      ...tree.map(item => {
        if (item[key] && item[key].length) {
          const currentItem = XEUtils.clone(item, true);
          delete currentItem[key];
          return [].concat(currentItem, XEUtils.treeTransArray(item[key], key));
        } else {
          return item;
        }
      })
    );
  },
  hasOptionsValue(options, value, valueField, childrenField, isMultiple) {
    if (isMultiple) {
      return hasOptionsMultipleValue(options, value, valueField, childrenField);
    } else {
      return hasOptionsValue(options, value, valueField, childrenField);
    }
  },
  //是否空对象
  isEmptyObject(data) {
    return JSON.stringify(data) === "{}";
  },
  /**
   * 生成一个 不重复的ID
   * @param { Number } randomLength
   */
  getUid(randomLength = 36) {
    let dateTime = Date.now().toString();
    return Number(
      Math.random()
        .toString()
        .substr(2, randomLength) + dateTime
    ).toString(36);
  }
});

export default XEUtils;
