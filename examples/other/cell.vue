<template>
  <div>
    <div class="container">
      <cellGroup title="标题">
        <cell title="单元格" value="内容" />
        <cell
          title="单元格"
          value="内容"
          label="这是描述"
          thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
        />
        <cell title="单元格" value="内容" is-link />
      </cellGroup>

      <cellGroup title="没有边框" :border="false">
        <cell title="单元格" :border="false" />
        <cell
          title="单元格放大开发的建行卡发阿斯蒂芬"
          label="深刻搭街坊哈克觉得发贺卡就是发动机安徽浮动空间和微软动空间和微软动空间和微软动空间和微软动空间和微软哈夫空间看和"
          thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
          value="内容长一点"
          is-link
        />
        <cell title="单元格" value="内容" is-link />
      </cellGroup>
    </div>
    <div>
      <a-row :gutter="10">
        <a-col
          v-for="item in list"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <div class="file-item">
            <cell
              title="a62267afb241a019eb9dcacfb5da07ae.jpg"
              label="深刻搭街坊哈克觉得发贺卡就是发动机安徽浮动空间和微软动空间和微软动空间和微软动空间和微软动空间和微软哈夫空间看和"
            >
              <div slot="thumb">
                <a-avatar
                  :size="50"
                  shape="square"
                  src="https://img.yzcdn.cn/vant/ipad.jpeg"
                />
              </div>
            </cell>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
const list = [];
for (let i = 0; i < 20; i++) {
  list.push({
    id: i
  });
}
export default {
  data() {
    return {
      list: list
    };
  }
};
</script>
