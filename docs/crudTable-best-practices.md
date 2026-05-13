# CrudTable 组件最佳实践

> CrudTable 是 opu-components-vue 中的 CRUD 编排组件，将 DataTable + DataForm + Modal 整合为一体，开箱即用地提供增删改查能力。

---

## 一、组件架构

CrudTable 是 DataTable、DataForm、Modal 三者的编排层：

```
CrudTable
  |
  +-- FormModal (ref="formModal")
  |     +-- Modal (弹窗)
  |     |     +-- DataForm (弹窗内的表单)
  |     +-- 方法: show(), setFormData(), setReadonly(), setTitle()...
  |
  +-- DataTable (ref="table")
        +-- 工具栏 (按钮 + 搜索)
        +-- vxe-grid (表格 + 分页)
```

**核心思路：** 通过 `proxyConfig` 声明四个 CRUD 操作（add/edit/del/view），CrudTable 自动生成按钮、处理弹窗、管理表单提交。

---

## 二、基础用法

### 2.1 最简示例

```html
<crud-table
  ref="crudTable"
  :form="form"
  :proxy-config="proxyConfig"
  :table="table"
/>
```

```js
export default {
  data() {
    return {
      // 新增/编辑表单配置
      form: {
        props: {
          colspan: 2,
          titleWidth: 100,
          items: [
            { field: "id", itemRender: { name: "hidden" } },
            {
              field: "name",
              title: "名称",
              option: { rules: [{ required: true, message: "请输入名称!" }] },
              itemRender: { name: "a-input", props: { placeholder: "请输入名称" } }
            },
            {
              field: "sex",
              title: "性别",
              itemRender: {
                name: "a-select",
                props: {
                  valueField: "id",
                  labelField: "text",
                  options: [
                    { id: 1, text: "男" },
                    { id: 2, text: "女" }
                  ]
                }
              }
            },
            {
              field: "age",
              title: "年龄",
              itemRender: { name: "a-input-number" }
            }
          ]
        }
      },
      // 表格配置
      table: {
        props: {
          columns: [
            { type: "seq", title: "序号", width: 80 },
            { field: "name", title: "名称" },
            { field: "sex", title: "性别" },
            { field: "age", title: "年龄", width: 200 },
            { field: "id", title: "操作", slots: { default: "rowAction" } }
          ],
          height: "calc(100vh - 100px)",
          proxyConfig: {
            props: { result: "data.data", total: "data.total" },
            ajax: { query: getDataApi }
          }
        }
      },
      // CRUD 操作配置
      proxyConfig: {
        add: {
          modalTitle: "新增记录",
          submit: saveDataApi
        },
        edit: {
          modalTitle: "编辑记录",
          query: getInfoApi,
          submit: saveDataApi
        },
        del: {
          submit: deleteDataApi
        },
        view: {
          query: getInfoApi
        }
      }
    };
  }
};
```

### 2.2 引入方式

```js
import { CrudTable } from "opu-components-vue";
```

---

## 三、Props 配置

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `form` | `Object` | — | 弹窗表单配置，结构同 DataForm |
| `modal` | `Object` | `{}` | 弹窗配置 |
| `table` | `Object` | — | 表格配置，结构同 DataTable |
| `proxyConfig` | `Object` | — | CRUD 操作配置（核心） |
| `permissions` | `Boolean \| Array` | `[]` | 权限控制 |

---

## 四、proxyConfig 详解

### 4.1 add（新增）

```js
proxyConfig: {
  add: {
    modalTitle: "新增会员",        // 弹窗标题
    reloadType: "query",           // 提交后刷新方式："query" 保留当前页，否则从第1页开始
    props: {                       // 工具栏按钮属性
      icon: "file-add",
      name: "新增",
      type: "primary"
    },
    permission: ["add"],           // 权限数组（与 permissions prop 交叉匹配）
    autoSetDefaultValue: true,     // 自动设置下拉默认值

    // 打开弹窗前的钩子
    // 返回 false 阻止打开
    // 返回函数作为打开后的回调（可返回表单初始数据）
    open: () => {
      console.log("打开前");
      return () => {
        console.log("打开后");
        return { name: "默认值" };  // 返回表单初始数据
      };
    },

    // 提交处理（必须返回 Promise）
    submit: (values) => {
      return new Promise((resolve, reject) => {
        saveDataApi(values)
          .then(res => resolve(res))
          .catch(() => reject());
      });
    },

    // 响应解析
    responseCodeField: "code",    // 接口返回码字段路径
    responseMsgField: "message",  // 接口返回消息字段路径
    successMsgCode: "0"           // 成功时的返回码
  }
}
```

### 4.2 edit（编辑）

```js
proxyConfig: {
  edit: {
    modalTitle: "编辑会员",
    props: { icon: "edit", name: "编辑" },
    permission: ({ row }) => {     // 函数形式：根据行数据判断权限
      return row.id !== 1;         // 返回 false 时按钮禁用
    },

    // 编辑前获取详情
    // 返回 Promise，resolve 的数据会填充到表单
    query: (row) => {
      return new Promise(resolve => {
        getInfoApi(row).then(res => {
          resolve(res.data);        // 返回表单数据对象
        });
      });
    },
    queryDataField: "data",        // 或直接指定响应数据路径，组件自动提取

    // 打开前钩子
    open: (row) => {
      console.log("编辑行:", row);
      return () => {
        console.log("编辑弹窗已打开");
      };
    },

    // 提交
    submit: saveDataApi,

    disabledTip: (row) => {        // 按钮禁用时的 Tooltip 提示
      return row.name;
    }
  }
}
```

### 4.3 del（删除）

```js
proxyConfig: {
  del: {
    popconfirmTitle: "确认删除该记录吗？",  // 确认弹窗文本
    props: { icon: "delete", name: "删除" },
    permission: ({ row }) => {
      return row.id !== 3;          // 条件禁用
    },

    // 删除提交（直接传行数据，不经过弹窗表单）
    submit: (row) => {
      return new Promise(resolve => {
        deleteDataApi(row).then(res => resolve(res));
      });
    },

    disabledTip: (row) => row.name
  }
}
```

> **注意：** 删除操作不打开弹窗表单，直接将行数据传给 `submit`。

### 4.4 view（查看）

```js
proxyConfig: {
  view: {
    modalTitle: "查看详情",
    trigger: ["dblclick", "button"],  // 触发方式
    // "click"     — 单击行触发
    // "dblclick"  — 双击行触发
    // "button"    — 生成行操作按钮
    query: getInfoApi,                // 获取详情接口
    queryDataField: "data",           // 响应数据路径
    permission: ({ row }) => {
      return row.id === 1;            // 仅 id=1 的行可查看
    }
  }
}
```

> **查看模式：** 弹窗表单自动设为只读，确定按钮隐藏。

---

## 五、form 表单配置

### 5.1 基本结构

```js
form: {
  props: {
    colspan: 2,          // 列数
    titleWidth: 100,     // 标题宽度
    titleAlign: "right", // 标题对齐
    layout: "grid",      // 布局模式
    autoFocus: true,     // 自动聚焦
    items: [             // 表单项（同 DataForm items）
      {
        field: "name",
        title: "名称",
        itemRender: { name: "a-input" }
      }
    ]
  }
}
```

### 5.2 表单项过滤（filter）

通过 `filter` 控制表单项在不同操作中的显示：

```js
items: [
  {
    field: "name",
    title: "名称",
    filter: ["add", "edit"],  // 仅在新增和编辑时显示，查看时不显示
    option: { rules: [{ required: true, message: "请输入!" }] },
    itemRender: { name: "a-input" }
  },
  {
    field: "createTime",
    title: "创建时间",
    filter: ["view"],  // 仅在查看时显示
    itemRender: { name: "a-input" }
  }
]
```

### 5.3 表单插槽

```html
<crud-table :form="form" :table="table" :proxy-config="proxyConfig">
  <!-- 整项插槽 -->
  <template slot="formSlot">
    自定义内容
  </template>

  <!-- 输入区域插槽 -->
  <template v-slot:formInputSlot="value">
    {{ value }}
    <a-input v-model="aaa"></a-input>
  </template>
</crud-table>
```

```js
// items 中配置
{
  field: "formSlot",
  slot: "formSlot"           // 整项插槽
},
{
  field: "formInputSlot",
  title: "插槽",
  itemRender: { slot: "formInputSlot" }  // 输入区域插槽
}
```

---

## 六、modal 弹窗配置

```js
modal: {
  props: {
    width: 800,
    destroyOnClose: true,    // 关闭时销毁（默认 true）
    maskClosable: false       // 点击遮罩不关闭（默认 false）
    // title 不需要设置，CrudTable 根据 proxyConfig 自动设置
  },
  on: {
    cancel() {
      console.log("弹窗关闭");
    }
  }
}
```

> **弹窗标题自动管理：** CrudTable 根据当前操作自动设置标题为 `proxyConfig[action].modalTitle`。

---

## 七、table 表格配置

```js
table: {
  props: {
    // 表格列定义
    columns: [
      { type: "seq", title: "序号", width: 80 },
      { field: "name", title: "名称", sortable: true },
      { field: "sex", title: "性别" },
      { field: "age", title: "年龄", width: 200, editRender: { name: "AInputNumber" } },
      { field: "id", title: "操作", slots: { default: "rowAction" } }
    ],

    // 表格高度
    height: "calc(100vh - 100px)",

    // 编辑配置
    editConfig: { trigger: "click", mode: "cell" },

    // 排序配置
    sortConfig: { remote: false },

    // 数据代理（分页查询）
    proxyConfig: {
      props: { result: "data.data", total: "data.total" },
      ajax: { query: getDataApi }
    },

    // 工具栏（可选，CrudTable 会自动注入"新增"按钮）
    headToolbar: {
      buttons: [
        { name: "新增", code: "add", type: "primary", action: "add" },
        {
          name: "同步数据",
          code: "sync",
          type: "primary",
          on: { click: () => { console.log("自定义按钮"); } }
        }
      ],
      search: {
        layout: "inline",
        titleWidth: "auto",
        items: [ /* 搜索表单项 */ ]
      },
      tools: {
        setColumns: true,
        export: true,
        refresh: true
      }
    }
  },
  on: {
    "edit-closed": (e) => {
      console.log("编辑关闭:", e);
    }
  }
}
```

> **自动注入：** 若未配置 `headToolbar.buttons` 且存在 `proxyConfig.add`，CrudTable 会自动生成"新增"按钮。

---

## 八、permissions 权限控制

### 8.1 数组模式

```js
// 页面中声明当前用户拥有的权限
permissions: ["add", "edit"]

// proxyConfig 中声明每个操作需要的权限
proxyConfig: {
  add: { permission: ["add"], ... },
  edit: { permission: ["edit"], ... },
  del: { permission: ["del"], ... }  // 用户没有 "del" 权限，删除按钮将被禁用
}
```

### 8.2 函数模式

```js
proxyConfig: {
  edit: {
    permission: ({ row }) => {
      return row.status !== "closed";  // 已关闭的记录不可编辑
    }
  },
  del: {
    permission: ({ row }) => {
      return row.id !== 1;  // id=1 的记录不可删除
    }
  }
}
```

### 8.3 全局禁用提示

```js
// 全局配置
CrudTable.setupConfig({
  showPermissionsTip: true,        // 启用权限提示
  showPermissionsTipText: "没有权限"  // 提示文本
});
```

---

## 九、插槽

| 插槽名 | 类型 | 说明 |
|--------|------|------|
| `rowAction` | Scoped `{ row }` | 自定义行操作列（完全替换自动生成的按钮） |
| `rowActionBefore` | Scoped `{ row }` | 行操作列前置内容（保留自动生成的按钮） |
| `rowActionAfter` | Scoped `{ row }` | 行操作列后置内容（保留自动生成的按钮） |
| `headToolbar_buttons` | Slot | 自定义工具栏按钮区域 |
| `formSlot` | Slot | 弹窗表单整项插槽 |
| `formInputSlot` | Scoped | 弹窗表单输入区域插槽 |
| `searchFormSlot` | Slot | 搜索表单插槽 |
| 其他 | Slot/Scoped | 透传到 DataTable 和 DataForm |

```html
<crud-table :form="form" :table="table" :proxy-config="proxyConfig">
  <!-- 行操作前置 -->
  <template v-slot:rowActionBefore="{ row }">
    <a-button>前置操作{{ row.id }}</a-button>
  </template>

  <!-- 行操作后置 -->
  <template v-slot:rowActionAfter="{ row }">
    <a-button>后置操作{{ row.id }}</a-button>
  </template>

  <!-- 自定义工具栏按钮 -->
  <template slot="headToolbar_buttons">
    <a-button @click="reload">刷新</a-button>
  </template>
</crud-table>
```

---

## 十、方法（通过 $refs 调用）

### 10.1 CrudTable 方法

```js
// 新增
this.$refs.crudTable.add();

// 编辑（传入行数据）
this.$refs.crudTable.edit(row);

// 删除（传入行数据）
this.$refs.crudTable.del(row);

// 查看（传入行数据）
this.$refs.crudTable.view(row);

// 刷新表格（从第1页开始）
this.$refs.crudTable.reloadTable();

// 刷新表格（保留当前页）
this.$refs.crudTable.queryTable({ extraParam: "value" });

// 触发搜索
this.$refs.crudTable.headSearch();

// 获取表格数据
const data = this.$refs.crudTable.getTableData();

// 获取所有子组件引用
const refs = this.$refs.crudTable.getRefs();
// refs.table     — DataTable 引用
// refs.formModal — FormModal 引用
```

### 10.2 通过 getRefs 访问子组件

```js
const { table, formModal } = this.$refs.crudTable.getRefs();

// DataTable 方法
table.reload();
table.getData();
table.setSearchData({ name: "测试" });
table.getCheckboxRecords();

// FormModal 方法
formModal.show(callback, actionType);
formModal.setFormData(data);
formModal.setReadonly(true);
formModal.setTitle("自定义标题");
formModal.setItems(items);
formModal.setLoading(true);

// 内部 DataForm 方法
formModal.$refs.form.setData({ name: "值" });
formModal.$refs.form.validateFields();
formModal.$refs.form.resetFields();
```

---

## 十一、完整示例

```html
<template>
  <crud-table
    ref="crudTable"
    :form="form"
    :proxy-config="proxyConfig"
    :modal="modal"
    :table="table"
    :permissions="permissions"
  >
    <template v-slot:rowActionBefore="{ row }">
      <a-button type="link" size="small" @click="onCopy(row)">复制</a-button>
    </template>
  </crud-table>
</template>

<script>
import { getData, saveData, getInfo, deleteData } from "@/api/member";

export default {
  data() {
    return {
      permissions: ["add", "edit", "del", "view"],
      form: {
        props: {
          colspan: 2,
          titleWidth: 100,
          autoFocus: true,
          items: [
            { field: "id", itemRender: { name: "hidden" } },
            {
              field: "name",
              title: "名称",
              filter: ["add", "edit"],
              option: { rules: [{ required: true, message: "请输入名称!" }] },
              itemRender: { name: "a-input", props: { placeholder: "请输入名称" } }
            },
            {
              field: "sex",
              title: "性别",
              itemRender: {
                name: "a-select",
                props: {
                  valueField: "id",
                  labelField: "text",
                  options: [
                    { id: 1, text: "男" },
                    { id: 2, text: "女", isSelected: true }
                  ]
                }
              }
            },
            {
              field: "age",
              title: "年龄",
              itemRender: { name: "a-input-number" }
            }
          ]
        }
      },
      modal: {
        props: { width: 600 },
        on: {
          cancel() { console.log("关闭弹窗"); }
        }
      },
      table: {
        props: {
          columns: [
            { type: "seq", title: "序号", width: 80 },
            { field: "name", title: "名称", sortable: true },
            { field: "sex", title: "性别" },
            { field: "age", title: "年龄", width: 200 },
            { field: "id", title: "操作", width: 250, slots: { default: "rowAction" } }
          ],
          height: "calc(100vh - 100px)",
          headToolbar: {
            search: {
              layout: "inline",
              titleWidth: "auto",
              items: [
                {
                  field: "name",
                  title: "名称",
                  itemRender: { name: "a-input", props: { placeholder: "请输入名称" } }
                }
              ]
            },
            tools: { refresh: true }
          },
          proxyConfig: {
            props: { result: "data.data", total: "data.total" },
            ajax: { query: getData }
          }
        }
      },
      proxyConfig: {
        add: {
          modalTitle: "新增会员",
          reloadType: "query",
          props: { icon: "file-add", name: "新增", type: "primary" },
          permission: ["add"],
          submit: saveData
        },
        edit: {
          modalTitle: "编辑会员",
          props: { icon: "edit", name: "编辑" },
          permission: ["edit"],
          query: (row) => {
            return new Promise(resolve => {
              getInfo(row).then(res => resolve(res.data));
            });
          },
          submit: saveData
        },
        del: {
          popconfirmTitle: "确认删除该会员吗？",
          props: { icon: "delete", name: "删除" },
          permission: ["del"],
          submit: deleteData
        },
        view: {
          modalTitle: "查看会员",
          trigger: ["dblclick"],
          query: (row) => {
            return new Promise(resolve => {
              getInfo(row).then(res => resolve(res.data));
            });
          }
        }
      }
    };
  },
  methods: {
    onCopy(row) {
      console.log("复制:", row);
    }
  }
};
</script>
```

---

## 十二、全局配置

```js
import { CrudTable } from "opu-components-vue";

CrudTable.setupConfig({
  // 弹窗默认配置
  modal: {
    props: {
      destroyOnClose: true,
      maskClosable: false
    }
  },

  // 表单默认配置
  form: {
    props: {
      colspan: 2,
      titleWidth: 100
    }
  },

  // 表格默认配置
  table: {
    border: true,
    resizable: true
  },

  // CRUD 操作默认配置
  proxyConfig: {
    add: {
      modalTitle: "新增",
      responseMsgField: "message",
      props: { name: "新增" }
    },
    edit: {
      modalTitle: "编辑",
      queryDataField: "",
      responseMsgField: "message",
      props: { name: "编辑" }
    },
    del: {
      modalTitle: "删除",
      popconfirmTitle: "您确认删除吗?",
      responseMsgField: "message",
      props: { name: "删除", type: "danger" }
    },
    view: {
      modalTitle: "查看",
      trigger: ["dblclick", "button"],
      queryDataField: "",
      props: { name: "查看" }
    }
  },

  // 权限提示
  permissions: [],
  showPermissionsTip: false,
  showPermissionsTipText: "没有权限"
});
```

---

## 十三、最佳实践建议

### 1. 统一接口规范

在全局配置中统一 `responseMsgField` 和 `responseCodeField`，确保项目所有接口返回格式一致，减少每个页面重复配置。

### 2. 善用 filter 控制表单项显示

利用 `filter: ["add", "edit"]` 控制表单项在不同操作中的可见性，避免创建多个表单配置。常见场景：编辑时显示"创建时间"但新增时隐藏。

### 3. 编辑操作的 query 钩子

编辑时推荐使用 `query` 钩子从后端获取最新数据，而非直接使用列表行数据。列表数据通常是摘要信息，编辑表单可能需要更完整的字段。

### 4. 合理配置 reloadType

- 新增操作推荐 `reloadType: "query"` — 保留当前页，用户不会丢失浏览位置
- 编辑/删除操作默认从第1页重新加载即可

### 5. 权限函数模式的灵活运用

使用函数模式 `permission: ({ row }) => boolean` 实现行级权限控制，例如"已审核的记录不可编辑"。

### 6. 自定义 submit 处理

直接传 API 函数（`submit: saveData`）即可满足大部分场景。需要额外处理时，使用函数形式：

```js
submit: (values) => {
  // 提交前处理
  return new Promise((resolve, reject) => {
    saveData({ ...values, extraField: "value" })
      .then(res => {
        // 提交后处理
        resolve(res);
      })
      .catch(() => reject());
  });
}
```

### 7. 利用 getRefs 访问子组件

通过 `getRefs()` 可以灵活访问内部的 DataTable 和 FormModal，在复杂场景下进行精细控制。

### 8. 查看（view）触发方式选择

- `"dblclick"` — 适合查看详情为主的场景，双击行即可查看
- `"click"` — 注意与行编辑模式的冲突
- `"button"` — 适合操作项较多的场景

### 9. 行操作插槽组合

使用 `rowActionBefore` 和 `rowActionAfter` 在自动生成的 CRUD 按钮前后添加自定义操作，无需完全重写行操作列。

### 10. 搜索表单与弹窗表单分离

`table.props.headToolbar.search` 管理搜索/筛选，`form.props.items` 管理新增/编辑字段，二者独立配置，职责清晰。
