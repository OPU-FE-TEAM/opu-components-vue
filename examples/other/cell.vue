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
        <cell title="单元格" value="内容" :border="false" />
        <cell
          title="单元格"
          value="内容"
          label="这是描述"
          thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
          :border="false"
        />
        <cell title="单元格" value="内容" is-link />
      </cellGroup>
    </div>
  </div>
</template>
