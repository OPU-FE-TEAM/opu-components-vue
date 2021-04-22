<template>
  <div>
    <div style="width:300px">
      <test1
        :options="selectGroupOptions"
        valueField="id"
        labelField="text"
        childrenField="children"
        style="width:300px"
        showSearch
        :searchFields="['code']"
      />
    </div>
  </div>
</template>

<script>
import test1 from "./test1";

export default {
  components: {
    test1
  },
  data() {
    return {
      selectGroupOptions: [
        {
          id: 1,
          text: "男",
          code: "boy",
          children: [
            { id: 11, text: "0-10岁", code: "b10" },
            { id: 12, text: "11-20岁", code: "b20" },
            { id: 13, text: "21-30岁", code: "b30" },
            { id: 14, text: "辣鸡", code: "b40" },
            { id: 15, text: "草割肉", code: "cgr" },
            { id: 16, text: "牛扒", code: "np" }
          ]
        },
        {
          id: 2,
          text: "女",
          isSelected: true,
          code: "girl",
          children: [
            { id: 21, text: "0-10岁", code: "g10" },
            { id: 22, text: "11-20岁", code: "g20" },
            { id: 23, text: "21-30岁", code: "g30" }
          ]
        },
        {
          id: 3,
          text: "未知",
          children: [
            { id: 31, text: "0-10岁", code: "g10" },
            { id: 32, text: "11-20岁", code: "g20" },
            { id: 33, text: "21-30岁", code: "g30" }
          ]
        }
      ]
    };
  }
};
</script>
