const getBlocks = (format = "YYYY-MM-DD") => {
  let blocks = [];
  let datePatterns = [];
  let delimiters = [];
  let formatTags = ["Y", "M", "D", "H", "m", "s", "y", "d", "h"];
  let formatArr = format.split("");
  let number = 0;
  let formatItemStr = "";
  formatArr.forEach((key, index) => {
    if (formatTags.includes(key)) {
      number++;
      formatItemStr = formatItemStr + key;
      if (index + 1 === formatArr.length) {
        blocks.push(number);
        number = 0;
        datePatterns.push(formatItemStr);
        formatItemStr = "";
      }
    } else {
      blocks.push(number);
      number = 0;
      delimiters.push(key);
      datePatterns.push(formatItemStr);
      formatItemStr = "";
    }
  });
  return {
    blocks,
    datePatterns,
    delimiters
  };
};

export const formatInputDate = (value, format = "YYYY-MM-DD") => {
  const { blocks, datePatterns, delimiters } = getBlocks(format);
  let result = "";
  value = value.replace(/[^\d]/g, "");
  blocks.forEach((length, index) => {
    if (value.length > 0) {
      let sub = value.slice(0, length);
      let rest = value.slice(length);
      let datePattern = datePatterns[index];

      let delimiter = "";
      if (sub.length === length) {
        delimiter = delimiters[index] ? delimiters[index] : "";
      }
      if (datePattern == "DD") {
        if (sub === "00") {
          sub = "01";
        } else if (parseInt(sub, 10) > 31) {
          sub = "31";
        }
      } else if (datePattern == "MM") {
        if (sub === "00") {
          sub = "01";
        } else if (parseInt(sub, 10) > 12) {
          sub = "12";
        }
      } else if (datePattern == "HH") {
        if (parseInt(sub, 10) > 23) {
          sub = "23";
        }
      } else if (datePattern == "h") {
        if (parseInt(sub, 10) > 12) {
          sub = "12";
        }
      } else if (["mm", "ss", "m", "s"].includes(datePattern)) {
        if (parseInt(sub, 10) > 59) {
          sub = "59";
        }
      }

      result += sub + delimiter;
      value = rest;
    }
  });
  return result;
};

export const mergeInputDate = (date1, date2, format) => {
  if (date1 === date2) {
    return date1;
  }
  const { blocks, delimiters } = getBlocks(format);
  let result = "";
  let value1 = date1.replace(/[^\d]/g, "");
  let value2 = date2.replace(/[^\d]/g, "");

  blocks.forEach((length, index) => {
    let date1Sub = value1.slice(0, length);
    value1 = value1.slice(length);
    let date2Sub = value2.slice(0, length);
    value2 = value2.slice(length);
    let val = "";
    let delimiter = delimiters[index] ? delimiters[index] : "";
    if (date1Sub.length === length) {
      val = date1Sub;
    } else {
      val = date2Sub;
    }
    if (val) {
      result += val + delimiter;
    }
  });

  return result;
};
