# DataTable 组件最佳实践

> DataTable 是 opu-components-vue 中的核心表格组件，基于 vxe-table 封装，集成了分页、搜索、工具栏、可编辑单元格、列配置等能力。

---

## 一、基础用法

### 1.1 最简示例

```html
<DataTable
  ref="dataTableRef"
  :columns="columns"
  :proxyConfig="proxyConfig"
  :pagerConfig="pagerConfig"
/>
```

```js
export default {
  data() {
    return {
      columns: [
        { type: "checkbox", width: 60, fixed: "left" },
        { type: "seq", title: "序号", width: 80 },
        { field: "name", title: "名称", minWidth: 140 },
        { field: "age", title: "年龄", width: 100 }
      ],
      proxyConfig: {
        props: { result: "data.data", total: "data.total" },
        ajax: {
          query: getDataApi  // 返回 Promise 的函数
        }
      },
      pagerConfig: {
        pageSize: 20
      }
    };
  },
  methods: {
    reload() {
      this.$refs.dataTableRef.reload();
    }
  }
};
```

### 1.2 引入方式

```js
// 方式一：从库入口引入（推荐）
import { DataTable } from "opu-components-vue";

// 方式二：直接引入包
import DataTable from "opu-components-vue/packages/dataTable";
```

---

## 二、Props 配置

DataTable 继承了 `vxe-table` 的全部 Props，额外提供以下属性：

### 2.1 核心配置

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `columns` | `Array` | `[]` | 列定义数组 |
| `proxyConfig` | `Object` | — | 数据代理配置（分页、接口请求） |
| `pagerConfig` | `Boolean \| Object` | — | 分页配置，`false` 禁用分页 |
| `data` | `Array` | — | 静态数据（不使用 proxyConfig 时） |

### 2.2 工具栏与搜索

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `headToolbar` | `Object` | — | 头部工具栏配置（按钮、搜索、工具） |
| `searchConfig` | `Object` | — | 独立搜索表单配置（渲染在工具栏上方） |
| `setcolumnsConfig` | `Object` | — | 列设置弹窗配置 |
| `proxyColumns` | `Object` | — | 远程列配置代理（从接口获取列定义） |

### 2.3 编辑相关

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `edit-config` | `Object` | — | vxe-table 编辑配置，如 `{ trigger: 'click', mode: 'cell' }` |
| `editSize` | `String` | `"default"` | 编辑控件尺寸 |
| `editLine` | `Boolean` | `false` | 单行编辑模式（仅当前行显示编辑控件） |
| `isFilterErrorApi` | `Boolean` | `false` | 编辑下拉接口报错时静默处理 |
| `isCacheOption` | `Boolean` | `true` | 缓存下拉选项数据 |
| `stopPropagation` | `Boolean` | `false` | 阻止编辑单元格内的点击冒泡 |

### 2.4 交互增强

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sortable` | `Boolean` | `false` | 自动为所有列启用排序（排除 `notSortableFields`） |
| `notSortableFields` | `Array` | — | 排除自动排序的字段名列表 |
| `dragSort` | `Boolean` | `false` | 启用拖拽排序 |
| `highlightCurrentUnselect` | `Boolean` | `false` | 点击已高亮行时取消高亮 |
| `defaultSelectFristRow` | `Boolean` | `false` | 数据加载后自动选中第一行 |
| `keyboardSpace` | `Boolean` | `true` | 空格键切换 checkbox |

---

## 三、Column 列配置

### 3.1 基本结构

```js
{
  field: "name",              // 字段名
  title: "名称",              // 标题
  width: 140,                 // 列宽（px）
  minWidth: 100,              // 最小列宽
  align: "left",              // 对齐方式：left / center / right
  fixed: "left",              // 固定列：left / right
  show: true,                 // 是否显示（配合 setColumns）
  treeNode: true,             // 树形节点列
  sortable: true,             // 是否可排序
  colIndex: 0,                // 列插入顺序（配合 proxyColumns 合并）

  // 特殊列类型
  type: "checkbox",           // checkbox / seq（序号）
}
```

### 3.2 插槽列

```js
{
  title: "操作",
  width: 200,
  slots: { default: "operate" }
}
```

```html
<DataTable :columns="columns">
  <template v-slot:operate="{ row }">
    <a-button @click="editRow(row)">编辑</a-button>
    <a-button @click="deleteRow(row)">删除</a-button>
  </template>
</DataTable>
```

### 3.3 嵌套表头（多级表头）

```js
{
  title: "基本信息",
  children: [
    { field: "name1", title: "姓名", width: 100 },
    {
      title: "其他信息",
      children: [
        { field: "rate", title: "评分", width: 100 },
        { field: "age", title: "年龄", width: 100 }
      ]
    }
  ]
}
```

---

## 四、可编辑单元格（editRender / itemRender）

在列配置中使用 `itemRender` 或 `editRender` 启用单元格编辑：

### 4.1 基本用法

```js
{
  field: "name",
  title: "名称",
  editRender: { name: "AInput" }  // 点击编辑
}
// 或使用 itemRender（始终显示编辑控件）
{
  field: "name",
  title: "名称",
  itemRender: { name: "a-input" }
}
```

### 4.2 配合 edit-config

```html
<DataTable
  :edit-config="{ trigger: 'click', mode: 'cell' }"
  :columns="columns"
/>
```

- `trigger: 'click'` — 点击触发编辑
- `trigger: 'dblclick'` — 双击触发编辑
- `mode: 'cell'` — 单元格编辑模式
- `mode: 'row'` — 行编辑模式

### 4.3 支持的编辑组件

| name | 说明 | 关键 props |
|------|------|-----------|
| `"AInput"` / `"a-input"` | 文本输入 | `disabled`, `placeholder` |
| `"AInputNumber"` / `"a-input-number"` | 数字输入 | `max`, `min`, `precision`（支持函数形式） |
| `"ASelect"` / `"a-select"` | 下拉选择 | `options`, `api`, `valueField`, `labelField`, `dataField` |
| `"ASearchSelect"` / `"a-search-select"` | 远程搜索选择 | `searchApi`, `searchFields` |
| `"AAutoComplete"` / `"a-auto-complete"` | 自动完成 | `api`, `search` |
| `"ADatePicker"` / `"a-date-picker"` | 日期选择 | `format`, `showTime` |
| `"ATimePicker"` / `"a-time-picker"` | 时间选择 | `format` |
| `"ASwitch"` / `"a-switch"` | 开关 | `trueValue`, `falseValue` |
| `"ACheckbox"` / `"a-checkbox"` | 复选框 | `trueValue`, `falseValue` |
| `"pulldownTable"` / `"pulldown-table"` | 下拉表格面板 | `valueField`, `textField`, `table` |

### 4.4 编辑事件处理

```js
{
  field: "switch",
  title: "开关",
  editRender: {
    name: "ASwitch",
    on: {
      change: ({ row }) => {
        console.log("开关变更:", row.switch);
      }
    }
  }
}
```

### 4.5 编辑单元格下拉数据

```js
{
  field: "select",
  title: "下拉框",
  editRender: {
    name: "ASelect",
    options: [
      { value: 1, label: "男" },
      { value: 2, label: "女" }
    ]
  }
}
// 或远程接口
{
  field: "select",
  title: "下拉框",
  itemRender: {
    name: "a-select",
    props: {
      api: getSelectData,
      valueField: "id",
      labelField: "name",
      dataField: "data.data",
      param: { code: "sex" }
    }
  }
}
```

---

## 五、proxyConfig 数据代理

### 5.1 基本配置

```js
proxyConfig: {
  autoLoad: true,   // 是否自动加载，false 时需手动调用 reload()
  props: {
    result: "data.data",  // 接口返回数据的列表路径
    total: "data.total"   // 总数路径
  },
  ajax: {
    query: getDataApi  // 查询接口，返回 Promise
  }
}
```

### 5.2 请求参数说明

query 函数接收的参数结构：

```js
function getDataApi(params) {
  // params 包含：
  // params.pageIndex  — 当前页码
  // params.pageSize   — 每页条数
  // params.sort       — 排序信息（启用远程排序时）
  // ...搜索表单数据会自动合并进来
  console.log(params);
  return fetch("/api/list", params);
}
```

### 5.3 接口返回格式

组件默认解析的接口返回结构：

```json
{
  "code": 0,
  "data": {
    "data": [...],
    "total": 100
  }
}
```

可通过 `props.result` 和 `props.total` 自定义路径。

---

## 六、pagerConfig 分页配置

```js
pagerConfig: {
  pageIndex: 1,        // 起始页码（默认 1）
  pageSize: 20,        // 每页条数（默认 20）
  layouts: [
    "PrevJump", "PrevPage", "Number",
    "NextPage", "NextJump", "Sizes",
    "FullJump", "Total"
  ],
  perfect: true,
  props: {
    pageSize: "pageSize",       // 自定义参数名
    currentPage: "pageIndex"
  }
}
```

- `false` 禁用分页
- 支持插槽数据 `slots: { left: () => "自定义内容" }`

---

## 七、headToolbar 工具栏配置

### 7.1 完整结构

```js
headToolbar: {
  // 按钮区域
  buttons: [
    // 单个按钮
    {
      name: "新单",
      code: "add",
      icon: "file-add",
      type: "primary",
      disabled: false,
      on: { click: () => { console.log("新增"); } }
    },
    // 按钮组（数组嵌套，紧密排列）
    [
      { name: "编辑", key: "edit", icon: "edit", on: { click: this.onEdit } },
      { name: "作废", key: "del", icon: "delete", disabled: this.delDisabled }
    ],
    // 下拉按钮
    {
      name: "更多",
      code: "more",
      icon: "file-add",
      dropdowns: [
        { name: "导出", code: "export", icon: "download", disabled: false },
        { name: "打印", code: "print", icon: "printer" }
      ]
    }
  ],

  // 内嵌搜索表单
  search: {
    colspan: 2,
    submitButtonProps: { content: "查询" },
    cancelButtonProps: false,
    style: { width: "500px" },
    items: [ /* DataForm items 配置 */ ]
  },

  // 工具按钮区（右侧）
  tools: {
    setColumns: true,   // 显示列设置按钮
    import: true,       // 导入
    export: true,       // 导出
    print: true,        // 打印
    refresh: true       // 刷新
  }
}
```

### 7.2 自定义按钮插槽

```html
<DataTable :headToolbar="headToolbar">
  <template slot="headToolbar_buttons">
    <a-button @click="onAdd">自定义新增按钮</a-button>
    <a-button :disabled="delDisabled">自定义按钮2</a-button>
  </template>
</DataTable>
```

### 7.3 内嵌搜索表单

`headToolbar.search` 完整支持 DataForm 的配置，包括：

```js
search: {
  layout: "inline",
  titleWidth: "auto",
  colspan: 2,
  submitButtonProps: { content: "查询" },
  cancelButtonProps: { content: "重置" },

  // 高级搜索
  advancedSearchButtonProps: { content: "高级" },
  advancedSearchModal: {
    props: { width: 800, title: "高级搜索" }
  },
  advancedSearchForm: {
    props: { layout: "grid", colspan: 2 },
    on: {
      open(advancedSearchRef, formData) {
        console.log("弹窗打开", formData);
      }
    }
  },

  items: [
    {
      field: "name",
      title: "名称",
      itemRender: { name: "a-input", props: { placeholder: "请输入名称" } }
    },
    {
      field: "age",
      title: "年龄",
      folding: true,  // 折叠项，显示在高级搜索中
      itemRender: { name: "a-input-number" }
    }
  ]
}
```

---

## 八、searchConfig 独立搜索表单

与 `headToolbar.search` 不同，`searchConfig` 在工具栏上方渲染一个独立的搜索区域：

```js
searchConfig: {
  colspan: 2,
  submitButtonProps: { content: "查询" },
  cancelButtonProps: { content: "重置" },
  style: { maxWidth: "600px" },
  on: {
    submit: (values) => {
      console.log("搜索:", values);
    }
  },
  items: [
    {
      field: "name",
      title: "名称",
      itemRender: { name: "a-input", props: { placeholder: "请输入名称" } }
    },
    {
      field: "sex",
      title: "性别",
      itemRender: {
        name: "a-select",
        props: {
          api: getSelectData,
          valueField: "id",
          labelField: "name",
          dataField: "data.data"
        }
      }
    }
  ]
}
```

> **选择建议：** 简单搜索用 `headToolbar.search`（内嵌工具栏），复杂搜索用 `searchConfig`（独立区域）。

---

## 九、setColumns 列设置

### 9.1 启用方式

```js
// 方式一：通过 headToolbar.tools
headToolbar: {
  tools: { setColumns: true }
}

// 方式二：独立配置
setcolumnsConfig: {
  modal: { props: { title: "设置表头" } }
}
```

### 9.2 远程保存列配置

```js
setcolumnsConfig: {
  proxyConfig: {
    ajax: {
      query: (params) => fetchColumns(params),   // 获取用户自定义列
      submit: (params) => saveColumns(params)    // 保存用户自定义列
    }
  }
}
```

### 9.3 方法调用

```js
this.$refs.dataTableRef.showSetColumns();  // 打开列设置弹窗
```

---

## 十、proxyColumns 远程列配置

从接口获取列定义并自动渲染：

```js
proxyColumns: {
  ajax: {
    query: (params) => getColumnsApi(params)
  }
}
```

接口返回的列配置与本地 `columns` 会自动合并（通过 `field` 匹配）：

```js
// 本地 columns（定义特殊列如 checkbox、操作列）
columns: [
  { type: "checkbox", colIndex: 0, width: 60, fixed: "left" },
  { type: "seq", title: "序号", colIndex: 1, width: 80 },
  { title: "操作", width: 200, slots: { default: "operate" } }
]

// 接口返回（定义数据列）
// { field: "name", title: "名称", width: 140, show: true }
// { field: "age", title: "年龄", width: 100, show: false }
```

- `colIndex` 控制本地列的插入位置
- `show: false` 的列默认隐藏（可通过列设置显示）

---

## 十一、事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `current-change` | `{ row, rowIndex }` | 高亮行切换（`row: null` 表示取消） |
| `cell-click` | event 对象 | 单元格点击 |
| `checkbox-change` | `{ records }` | checkbox 变更（含空格键触发） |
| `toobarButtonClick` | `code` | 工具栏按钮点击 |
| `enterLastItem` | — | 最后一行最后一个编辑单元格按 Enter |
| `keyDown` | event | 键盘事件（keyboardSpace 启用时） |
| 所有 vxe-grid 事件 | — | 通过 `$listeners` 透传 |

---

## 十二、方法（通过 $refs 调用）

### 12.1 数据操作

```js
// 获取表格数据
const data = this.$refs.dataTableRef.getData();

// 刷新数据（重新请求接口）
this.$refs.dataTableRef.reload();

// 带参数刷新
this.$refs.dataTableRef.query({ extraParam: "value" });
```

### 12.2 搜索表单操作

```js
// 设置搜索表单值
this.$refs.dataTableRef.setSearchData({ name: "测试", sex: 1 });

// 获取搜索表单值
const searchData = this.$refs.dataTableRef.getSearchData();

// 触发搜索
this.$refs.dataTableRef.headSearch();
```

### 12.3 行选择操作

```js
// 获取当前高亮行
const row = this.$refs.dataTableRef.getCurrentRecord();

// 清除高亮
this.$refs.dataTableRef.clearCurrentRow();

// 设置高亮行
this.$refs.dataTableRef.setSelectRow(0);  // 高亮第 0 行

// 获取 checkbox 选中记录
const records = this.$refs.dataTableRef.getCheckboxRecords();
```

### 12.4 列操作

```js
// 动态更新列
this.$refs.dataTableRef.setTableColumns(newColumns);

// 打开列设置
this.$refs.dataTableRef.showSetColumns();

// 远程获取列
this.$refs.dataTableRef.fetchColumns();
```

### 12.5 编辑操作

```js
// 聚焦到指定行的编辑模式
this.$refs.dataTableRef.focusEditRow(0);

// 聚焦到指定单元格
this.$refs.dataTableRef.itemFieldFocus({ field: "name", rowIndex: 0 });

// 退出行编辑模式
this.$refs.dataTableRef.onBlurEditLine();
```

### 12.6 下拉数据操作

```js
// 设置编辑列的下拉选项
this.$refs.dataTableRef.setFieldsOptions({
  select: [{ id: 1, name: "选项1" }, { id: 2, name: "选项2" }]
});

// 获取当前下拉数据
const options = this.$refs.dataTableRef.getFieldsOptions();

// 重新加载下拉数据
this.$refs.dataTableRef.loadOptionsData();
```

---

## 十三、树形表格

```html
<DataTable
  :tree-config="{}"
  :data="tableData"
  rowKey
/>
```

数据中的 `children` 字段自动展开为树形结构：

```js
tableData: [
  {
    id: 1,
    name: "父节点",
    children: [
      { id: "a1", name: "子节点1" },
      { id: "a2", name: "子节点2" }
    ]
  }
]
```

在列中指定树形节点显示列：

```js
{ field: "name", title: "名称", treeNode: true }
```

---

## 十四、拖拽排序

```html
<DataTable :dragSort="true" :columns="columns">
  <template v-slot:drag_default>
    <span class="drag-btn"><i class="vxe-icon--menu"></i></span>
  </template>
</DataTable>
```

列配置中添加拖拽列：

```js
{
  width: 60,
  align: "center",
  slots: {
    default: "drag_default",
    header: () => "排序"
  }
}
```

---

## 十五、全局配置

```js
import DataTable from "opu-components-vue/packages/dataTable";

DataTable.setupConfig({
  // 编辑控件尺寸
  editSize: "default",

  // 默认分页
  pagerConfig: {
    pageIndex: 1,
    pageSize: 20,
    layouts: ["PrevJump", "PrevPage", "Number", "NextPage", "NextJump", "Sizes", "FullJump", "Total"],
    perfect: true,
    props: { pageSize: "pageSize", currentPage: "pageIndex" }
  },

  // 默认代理配置
  proxyConfig: {
    seq: true,
    props: { result: "data.data", total: "data.total" }
  },

  // 默认代理列配置
  proxyColumns: {
    props: { list: "data.data", show: "show" }
  },

  // 默认下拉数据配置
  getSelectOptions: {
    api: null,
    valueField: "value",
    labelField: "label",
    dataField: "data"
  },

  // 默认列设置弹窗
  setColumns: {
    modal: { props: { title: "设置表头", width: 800 } }
  },

  // 各编辑控件默认 props
  defaultProps: {
    select: { showSearch: true, placeholder: "请选择", allowClear: true }
  },

  // 表格默认属性
  props: {
    border: true,
    resizable: true,
    keyboardConfig: { isArrow: true }
  }
});
```

---

## 十六、完整示例

```html
<template>
  <DataTable
    ref="dataTableRef"
    height="calc(100vh - 100px)"
    :loading="loading"
    :columns="columns"
    :headToolbar="headToolbar"
    :proxyConfig="proxyConfig"
    :pagerConfig="pagerConfig"
    highlight-hover-row
    highlight-current-row
    show-overflow
    keep-source
    size="small"
    :checkboxConfig="{ highlight: true, trigger: 'row' }"
    :edit-config="{ trigger: 'click', mode: 'cell' }"
    :sortable="true"
    :sort-config="{ remote: true }"
    @current-change="onCurrentChange"
  >
    <template v-slot:operate="{ row }">
      <a-button @click="editRow(row)">编辑</a-button>
      <a-button type="danger" @click="deleteRow(row)">删除</a-button>
    </template>
  </DataTable>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      columns: [
        { type: "checkbox", width: 60, fixed: "left" },
        { type: "seq", title: "序号", width: 80 },
        {
          field: "name",
          title: "名称",
          minWidth: 140,
          editRender: { name: "AInput" }
        },
        {
          field: "sex",
          title: "性别",
          width: 140,
          editRender: {
            name: "ASelect",
            options: [
              { value: 1, label: "男" },
              { value: 2, label: "女" }
            ]
          }
        },
        { title: "操作", width: 200, slots: { default: "operate" } }
      ],
      headToolbar: {
        buttons: [
          {
            name: "新增",
            code: "add",
            icon: "plus",
            type: "primary",
            on: { click: this.onAdd }
          }
        ],
        tools: {
          refresh: true,
          setColumns: true
        }
      },
      proxyConfig: {
        props: { result: "data.data", total: "data.total" },
        ajax: { query: getDataApi }
      },
      pagerConfig: {
        pageSize: 20
      }
    };
  },
  methods: {
    onCurrentChange({ row }) {
      this.currentRow = row;
    },
    editRow(row) {
      console.log("编辑:", row);
    },
    deleteRow(row) {
      console.log("删除:", row);
    },
    onAdd() {
      console.log("新增");
    }
  }
};
</script>
```

---

## 十七、最佳实践建议

### 1. 推荐使用 proxyConfig 管理数据

使用 `proxyConfig` 代理模式替代手动管理数据，组件自动处理分页、搜索参数、排序等逻辑。

### 2. 列配置与 proxyColumns 分离

将固定列（checkbox、序号、操作）放在本地 `columns`，数据列通过 `proxyColumns` 从接口获取，实现列配置的动态化和用户个性化。

### 3. 合理使用 headToolbar.search

对于搜索字段较少（1-3 个）的场景，使用 `headToolbar.search` 内嵌搜索更紧凑；字段多时使用 `searchConfig` 或高级搜索弹窗。

### 4. 统一接口返回格式

在全局配置中统一 `proxyConfig.props`，确保项目所有接口返回格式一致，避免每个页面重复配置。

### 5. 编辑模式选择

- **`mode: 'cell'`** — 适合表格数据量大、按需编辑的场景
- **`mode: 'row'`** — 适合整行编辑后统一提交的场景
- **`editLine: true`** — 适合同时只编辑一行的场景

### 6. loading 状态管理

配合 `loading` prop 在数据加载和操作时显示加载状态：

```js
async onSave() {
  this.loading = true;
  try {
    await saveData();
    this.$refs.dataTableRef.reload();
  } finally {
    this.loading = false;
  }
}
```

### 7. 空格键导航

默认启用 `keyboardSpace`，在 checkbox 列中可通过空格键切换选中，配合方向键实现快速数据浏览。

### 8. 性能优化

- 大数据量时设置 `height` 开启虚拟滚动
- 使用 `show-overflow` 溢出文本省略
- 使用 `keep-source` 保留数据源用于差异比对

### 9. 默认选中首行

使用 `defaultSelectFristRow` 实现列表-详情联动的场景，数据加载后自动选中第一行并触发 `current-change` 事件。

### 10. 远程排序

启用 `sortable` 后配合 `sort-config: { remote: true }` 实现服务端排序，避免前端排序大数据量的性能问题。
