export default (value, format = "YYYY-MM-DD") => {
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
