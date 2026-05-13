# DataForm 组件最佳实践

> DataForm 是 opu-components-vue 中的核心表单组件，基于 Ant Design Vue 封装，提供了声明式的表单配置能力。

---

## 一、基础用法

### 1.1 最简示例

```html
<DataForm
  ref="dataForm"
  :items="items"
  @submit="onSubmit"
/>
```

```js
export default {
  data() {
    return {
      items: [
        {
          field: "name",
          title: "名称",
          itemRender: {
            name: "a-input",
            props: { placeholder: "请输入名称" }
          }
        },
        {
          field: "sex",
          title: "性别",
          itemRender: {
            name: "a-select",
            props: {
              valueField: "id",
              labelField: "name",
              options: [
                { id: 1, name: "男" },
                { id: 2, name: "女" }
              ]
            }
          }
        }
      ]
    };
  },
  methods: {
    onSubmit(values) {
      console.log("表单提交:", values);
    }
  }
};
```

### 1.2 推荐的组件引入方式

```js
// 方式一：从库入口引入（推荐）
import { DataForm } from "opu-components-vue";

// 方式二：直接引入包
import DataForm from "opu-components-vue/packages/dataForm";
```

---

## 二、Props 配置

### 2.1 布局相关

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `layout` | `String` | `"grid"` | 布局模式：`horizontal` / `vertical` / `inline` / `grid` / `flex` |
| `colspan` | `Number \| Object` | `1` | 列数。支持响应式对象 `{ xs, sm, md, lg, xl, xxl }` |
| `titleWidth` | `Number \| String` | `120` | 标题宽度（px），`"auto"` 自适应 |
| `titleAlign` | `String` | `"right"` | 标题对齐：`left` / `center` / `right` |
| `titleColon` | `Boolean` | `true` | 是否显示标题冒号 |

**响应式列数示例：**

```html
<DataForm
  :colspan="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }"
  :items="items"
/>
```

### 2.2 数据与行为相关

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | `Array` | `[]` | 表单项配置数组（核心） |
| `readonly` | `Boolean` | `false` | 全局只读模式 |
| `loading` | `Boolean` | `false` | 提交按钮加载状态 |
| `autoFocus` | `Boolean \| String` | `false` | 自动聚焦。`true` 聚焦第一项，传字段名聚焦指定项 |
| `autoSetDefaultValue` | `Boolean` | `false` | 自动选中下拉的默认项（`isSelected` 标记） |
| `autoSetDefaultFirst` | `Boolean` | `false` | 自动选中下拉的第一项 |
| `filterNullValues` | `Boolean` | `true` | 获取数据时过滤空值 |
| `isFilterErrorApi` | `Boolean` | `false` | 下拉接口报错时不阻断（静默处理） |

### 2.3 下拉数据加载相关

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `autoLoadOptionsData` | `Boolean` | `true` | 是否自动请求下拉数据 |
| `loadOptionsIdField` | `String` | `""` | 下拉请求时携带表单值的字段名 |
| `isPartRequest` | `Boolean` | `false` | 统一 API 是否分项独立请求 |
| `getSelectOptions` | `Object` | — | 全局下拉请求配置：`{ api, valueField, labelField, dataField, ... }` |
| `onOptionsAllLoad` | `Function` | — | 所有下拉数据加载完成后的回调 |
| `onOptionsLoadBefore` | `Function` | — | 下拉数据加载前的回调，返回 `false` 可取消 |
| `onOptionsLoadAfter` | `Function` | — | 单个下拉数据加载后的回调 |

### 2.4 按钮相关

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `submitButtonProps` | `Boolean \| Object` | `{ type: 'primary', content: '提交' }` | 提交按钮配置，`false` 隐藏 |
| `cancelButtonProps` | `Boolean \| Object` | `{ content: '重置' }` | 重置按钮配置，`false` 隐藏 |
| `foldingButtonProps` | `Boolean \| Object` | — | 展开/收起按钮，`false` 隐藏 |

---

## 三、Item 配置详解

每个 item 对象的结构如下：

```js
{
  field: "fieldName",         // 字段名（必填）
  title: "标题",              // 标题文本，支持函数返回 VNode，false 隐藏标题
  tooltip: "提示信息",        // 标题旁的问号提示
  titleWidth: 120,            // 单项标题宽度（覆盖全局）
  colspan: 2,                 // 单项占列数，支持响应式对象
  rowspan: 1,                 // 行跨越数
  width: "200px",             // flex 布局下的宽度
  folding: false,             // true 表示默认收起，展开后显示
  class: "custom-class",      // 自定义 CSS 类
  style: { marginBottom: 0 }, // 自定义内联样式
  align: "left",              // 对齐方式

  // 表单校验与初始值
  option: {
    initialValue: "",          // 初始值
    rules: [
      { required: true, message: "此项为必填" }
    ],
    valuePropName: "checked"   // 值绑定属性名（switch/checkbox 用）
  },

  // 操作按钮（字段右侧）
  actions: [
    {
      button: {
        props: { icon: "plus" },
        on: { click: () => {} }
      },
      modal: {                 // 可选：点击后弹出 Modal
        props: { title: "弹窗标题" },
        content: () => "弹窗内容",
        form: {                // 可选：弹窗内嵌表单
          props: { items: [...] },
          on: { submit: (values) => {} }
        }
      }
    }
  ],

  // 渲染配置（核心）
  itemRender: {
    name: "a-input",           // 组件名
    props: {},                 // 组件 props
    on: {},                    // 组件事件
    before: () => ["前缀"],    // 输入框前内容
    after: () => ["后缀"],     // 输入框后内容
    extend: (val) => val,      // 扩展渲染
    slot: "slotName",          // 输入区域插槽名
    customRender: (val, set) => VNode,  // 自定义渲染
    enterFocus: true           // Enter 键跳转下一个字段
  },

  // 整项插槽
  slot: "itemSlotName"
}
```

---

## 四、支持的 itemRender.name

### 4.1 输入类

| name | 说明 | 关键 props |
|------|------|-----------|
| `"a-input"` | 文本输入 | `placeholder`, `disabled`, `allowClear` |
| `"a-textarea"` | 多行文本 | `autoSize: { minRows, maxRows }` |
| `"a-input-password"` | 密码输入 | — |
| `"a-input-number"` | 数字输入 | `min`, `max`, `precision`, `step` |
| `"hidden"` | 隐藏字段 | 渲染为隐藏的 a-input |

### 4.2 选择类

| name | 说明 | 关键 props |
|------|------|-----------|
| `"a-select"` | 下拉选择 | `options`, `api`, `valueField`, `labelField`, `dataField`, `mode`, `defaultField`, `showSearch`, `linkage` |
| `"a-select-group"` | 分组下拉 | `childrenField`, `disabledField`, `replaceFields` |
| `"a-search-select"` | 搜索选择 | `searchApi`, `param` |
| `"a-radio-group"` | 单选组 | `options`, `api`, `defaultField` |
| `"a-checkbox-group"` | 多选组 | `options`, `api`, `defaultField` |
| `"a-tree-select"` | 树形选择 | `treeData`, `api`, `replaceFields`, `showSearch`, `searchFields` |
| `"a-cascader"` | 级联选择 | `api`, `valueField`, `labelField` |
| `"a-auto-complete"` | 自动完成 | `api`, `param`, `dataField` |

### 4.3 日期时间类

| name | 说明 | 关键 props |
|------|------|-----------|
| `"a-date-picker"` | 日期选择 | `format`, `showTime`, `min`, `max`, `disabledDate` |
| `"a-range-picker"` | 日期范围 | `showTime`, `format` |
| `"a-range-picker-split"` | 日期范围拆分 | `min`, `max`, `startDisabled`, `endDisabledDate`, `separator` |
| `"a-time-picker"` | 时间选择 | `format` |
| `"a-range-time-picker-split"` | 时间范围拆分 | — |
| `"a-month-picker"` | 月份选择 | — |
| `"a-week-picker"` | 周选择 | — |

### 4.4 其他

| name | 说明 | 关键 props |
|------|------|-----------|
| `"a-switch"` | 开关 | `trueValue`, `falseValue` |
| `"a-checkbox"` | 复选框 | `trueValue`, `falseValue` |
| `"a-rate"` | 评分 | — |
| `"a-slider"` | 滑动条 | `range` |
| `"a-upload"` | 上传 | `action`, `listType`, `multiple`, `accept`, `responseUrlField` |
| `"a-input-number-split"` | 数字范围拆分 | — |
| `"a-modal-textarea"` | 弹窗文本域 | `autoSize` |
| `"pulldown-table"` | 下拉表格面板 | `valueField`, `textField`, `table` |
| `"buttons"` | 按钮组 | `items: [{ props: { action, content }, on: {} }]` |

---

## 五、下拉数据配置

### 5.1 静态数据

```js
{
  field: "sex",
  title: "性别",
  itemRender: {
    name: "a-select",
    props: {
      valueField: "id",
      labelField: "text",
      options: [
        { id: 1, text: "男", isSelected: true },
        { id: 2, text: "女" }
      ]
    }
  }
}
```

### 5.2 远程接口数据

```js
{
  field: "department",
  title: "部门",
  itemRender: {
    name: "a-select",
    props: {
      valueField: "id",
      labelField: "name",
      dataField: "data",        // 接口返回数据的读取路径，支持 "data.datas"
      api: getDepartmentList,   // 返回 Promise 的函数
      param: { code: "dept" }   // 额外请求参数
    }
  }
}
```

### 5.3 全局统一接口

当下拉数据来源于全局下拉数据请求接口时，通过项目已全局 `getSelectOptions` 配置的统一 API：

```js
// 入口处全局配置
import DataForm from "opu-components-vue/packages/dataForm";
DataForm.setupConfig({
  getSelectOptions: {
    api: getOptionsByCode,       // 统一接口
    valueField: "id",
    labelField: "name",
    dataField: "data"
  }
});

// items 中只需指定 param 来区分不同下拉
{
  field: "status",
  title: "状态",
  itemRender: {
    name: "a-select",
    props: {
      param: { codes: "status" }  // 通过 code 区分
    }
  }
}
```

### 5.4 自定义渲染选项

```js
{
  field: "sex",
  title: "性别",
  itemRender: {
    name: "a-select",
    props: {
      valueField: "id",
      labelField: "text",
      renderOptionLabel: (item) => {
        return <span style="color: red;">{item.label}</span>;
      },
      options: [...]
    }
  }
}
```

### 5.5 联动配置

```js
{
  field: "sex",
  title: "性别",
  itemRender: {
    name: "a-select",
    props: {
      valueField: "id",
      labelField: "text",
      options: [...],
      linkage: { name22: "code" }  // 选择后自动将 code 字段赋值给 name22
    }
  }
}
```

---

## 六、表单操作方法

通过 `ref` 调用：

### 6.1 获取数据

```js
// 不校验直接获取
const values = this.$refs.dataForm.getData();

// 校验后获取（Promise）
const values = await this.$refs.dataForm.validateFields();

// 获取指定字段
const values = await this.$refs.dataForm.validateFields(["name", "sex"]);
```

### 6.2 设置数据

```js
// 批量赋值
this.$refs.dataForm.setData({
  name: "张三",
  sex: 1,
  pulldown: { id: 5, name: "name_1_5" }  // 复杂对象
});

// 图片上传赋值（数组形式）
this.$refs.dataForm.setData({
  imageUpload: ["url1.jpg", "url2.jpg"]
});
```

### 6.3 下拉数据操作

```js
// 动态更新下拉选项
this.$refs.dataForm.setFieldsOptions({
  sex: [{ id: 5, name: "boy" }, { id: 6, name: "girl" }],
  type: ["a", "b", "c"]
});

// 获取当前下拉数据
const options = this.$refs.dataForm.getFieldsOptions();
const sexOptions = this.$refs.dataForm.getFieldsOptions(["sex"]);

// 手动加载下拉数据（可同时设置默认值）
this.$refs.dataForm.loadOptionsData(
  { selected: 123 },     // 附加参数
  () => {                 // 加载完成回调
    this.setFormData();
  }
);

// 重新加载指定字段的下拉
this.$refs.dataForm.loadItemOptionsData("fieldName", { code: "new" });

// 设置下拉默认值（根据 isSelected 或首项）
this.$refs.dataForm.setFieldsOptionsDefaultValues();
```

### 6.4 其他操作

```js
// 重置
this.$refs.dataForm.resetFields();           // 重置全部
this.$refs.dataForm.resetFields(["name"]);   // 重置指定字段

// 展开/收起
this.$refs.dataForm.setExpand(true);

// 焦点
this.$refs.dataForm.setFieldFocus("name");

// 校验状态
const errors = this.$refs.dataForm.getFieldError("name");
const touched = this.$refs.dataForm.isFieldTouched("name");
```

---

## 七、事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `submit` | `values` | 提交按钮点击且校验通过后触发 |
| `reset` | `fields` | 重置后触发 |
| `folding` | `expanded` | 展开/收起切换时触发 |
| `buttonActionClick` | `action, event` | 按钮组中自定义 action 按钮点击时触发 |

```html
<DataForm
  @submit="onSubmit"
  @buttonActionClick="onButtonClick"
/>
```

---

## 八、插槽

### 8.1 输入区域插槽

```html
<DataForm :items="items">
  <template slot="inputSlot" slot-scope="text, updateValue, field">
    当前值: {{ text }}，字段: {{ field }}
    <a @click="updateValue('新值')">改变值</a>
  </template>
</DataForm>
```

```js
// items 中配置
{
  field: "myField",
  title: "插槽输入",
  itemRender: { slot: "inputSlot" }
}
```

### 8.2 整项插槽

```html
<DataForm :items="items">
  <template slot="itemSlot" slot-scope="text, updateValue, field">
    全插槽内容: {{ text }} {{ field }}
    <a @click="updateValue('777')">改变值</a>
  </template>
</DataForm>
```

```js
{
  field: "myField",
  title: "整项插槽",
  slot: "itemSlot"
}
```

### 8.3 自定义渲染

```js
{
  field: "custom",
  title: "自定义",
  itemRender: {
    customRender: (value, updateFn) => {
      return <span onClick={() => updateFn("新值")}>{value}</span>;
    }
  }
}
```

---

## 九、按钮组

在表单内部放置操作按钮：

```js
{
  align: "left",
  colspan: 2,
  colon: false,
  itemRender: {
    name: "buttons",
    items: [
      {
        props: {
          action: "submit",
          content: "提交",
          type: "primary"
        }
      },
      {
        props: {
          action: "reset",
          content: "重置"
        },
        on: {
          click: () => {
            console.log("重置前操作");
            return false; // 返回 false 阻止默认行为
          }
        }
      },
      {
        props: {
          action: "customAction",
          content: "自定义按钮"
        }
      }
    ]
  }
}
```

- `action: "submit"` — 触发表单校验与提交
- `action: "reset"` — 重置表单
- 自定义 action — 触发 `buttonActionClick` 事件

---

## 十、下拉表格面板（pulldown-table）

```js
{
  field: "pulldown",
  title: "下拉面板",
  itemRender: {
    name: "pulldown-table",
    props: {
      valueField: "name",
      textField: "sex",
      table: {
        props: {
          columns: [
            { type: "seq", title: "序号", width: 80 },
            { field: "name", title: "名称", width: 200 },
            { field: "sex", title: "性别", width: 200 },
            { field: "age", title: "年龄", width: 200 }
          ],
          size: "mini",
          height: 300,
          highlightHoverRow: true,
          highlightCurrentRow: true,
          proxyConfig: {
            autoLoad: false,
            ajax: { query: getDataApi }
          }
        }
      }
    },
    on: {
      change(val, row) { console.log("选中:", val, row); },
      inputChange(val) { console.log("输入:", val); }
    }
  }
}
```

---

## 十一、分组下拉（a-select-group）

支持带子级的分组下拉选择：

```js
{
  field: "category",
  title: "分类",
  itemRender: {
    name: "a-select-group",
    props: {
      valueField: "id",
      labelField: "name",
      childrenField: "projectCategoryList",
      disabledField: "disabled",
      dataField: "data",
      defaultActiveFirstOption: false,
      replaceFields: {
        children: "projectCategoryList"
      },
      api: getCategoryData
    }
  }
}
```

---

## 十二、全局配置

在应用入口统一设置默认行为：

```js
import DataForm from "opu-components-vue/packages/dataForm";

DataForm.setupConfig({
  layout: "grid",
  colspan: 1,
  titleWidth: 120,
  titleAlign: "right",
  titleColon: true,
  filterNullValues: true,
  clearUndefinedValue: false,
  autoEnterSelectInput: false,
  submitButtonProps: { type: "primary", content: "提交" },
  cancelButtonProps: { content: "重置" },
  foldingButtonProps: { openText: "展开", hideText: "收起" },
  getSelectOptions: {
    api: null,
    valueField: "value",
    labelField: "label",
    dataField: "data",
    defaultField: "default"
  },
  defaultProps: {
    input: { placeholder: "请输入", allowClear: true },
    select: { showSearch: true, placeholder: "请选择", allowClear: true }
  }
});
```

---

## 十三、最佳实践建议

### 1. 统一接口管理下拉数据

项目中已全局配置使用 `getSelectOptions` API，通过 `param.codes` 区分不同下拉类型，减少重复代码。

### 2. 善用 `autoSetDefaultValue` 和 `autoSetDefaultFirst`

需要表单有初始选中值时，配合数据源中的 `isSelected` 字段或直接开启 `autoSetDefaultFirst`。

### 3. 使用 `isFilterErrorApi` 提升容错

在非关键场景下开启此选项，避免某个下拉接口失败导致整个表单不可用。

### 4. 响应式布局

根据业务场景配置 `colspan` 响应式对象，确保在不同屏幕尺寸下表单布局合理。

### 5. 合理使用 `folding` 折叠

对于字段较多的搜索表单，将非核心字段标记 `folding: true`，配合 `foldingButtonProps` 实现展开/收起。

### 6. `loading` 状态联动

提交操作中设置 `loading = true`，完成后设为 `false`，提升用户体验：

```js
onSubmit(values) {
  this.loading = true;
  saveData(values).then(() => {
    this.loading = false;
  });
}
```

### 7. 动态更新表单项

支持运行时动态修改 `items` 数组（如 `push` 新增项），组件会自动响应。

### 8. 隐藏字段

使用 `itemRender: { name: "hidden" }` 存储不需要展示但需要提交的字段（如 id、关联名称等）。

### 9. 校验规则

利用 `option.rules` 配置校验，通过 `validateFields()` 在提交前统一校验：

```js
{
  field: "name",
  title: "名称",
  option: {
    rules: [{ required: true, message: "请输入名称" }]
  },
  itemRender: { name: "a-input" }
}
```

### 10. 错误处理

下拉接口可能失败时，使用 `isFilterErrorApi` 并配合 `onOptionsAllLoad` 回调进行状态监控：

```html
<DataForm
  isFilterErrorApi
  :onOptionsAllLoad="onOptionsAllLoad"
/>
```
