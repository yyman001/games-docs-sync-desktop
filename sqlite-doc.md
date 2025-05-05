
# 开发文档 & API 文档

## 📄 开发文档（Development Guide）

### 🧩 项目模块说明

本项目包含两个主要模块：

| 文件名 | 描述 |
|--------|------|
| `useLocalGamesDoc.ts` | 前端侧的一个 Vue Composition API hook，用于管理本地游戏文档数据，包括读取、同步、更新等逻辑。 |
| `sqlite.ts` | SQLite 数据库操作模块，提供数据的增删改查功能，用于本地持久化存储。 |

---

## 📘 API 文档

### 1. `sqlite.ts` – 本地数据库操作模块

#### 引入方式：
```ts
import db from './sqlite';
```

#### 导出的对象：
一个包含数据库操作方法的对象。

---

#### `db.init()`

初始化数据库并创建表。

- **参数**：无
- **返回值**：`Promise<void>`

---

#### `db.getAllDocs(): Promise<any[]>`

获取所有文档记录。

- **返回值**：`Promise`，数组形式返回所有文档对象。

---

#### `db.saveDoc(doc: { id: string; data: any }): Promise<void>`

保存或更新单个文档数据。

- **参数**：
  - `doc.id`：文档 ID（`string`）
  - `doc.data`：文档内容（任意结构）

- **返回值**：`Promise<void>`

---

#### `db.removeDoc(id: string): Promise<void>`

删除指定 ID 的文档。

- **参数**：
  - `id`: 文档 ID

- **返回值**：`Promise<void>`

---

### 2. `useLocalGamesDoc.ts` – 前端文档同步 Hook

#### 引入方式：

```ts
import useLocalGamesDoc from './useLocalGamesDoc';
```

#### `useLocalGamesDoc()`

该函数返回与文档数据相关的响应式状态和操作函数。

- **返回值**：

```ts
{
  loading: Ref<boolean>,
  dataMap: Ref<Record<string, any>>,
  syncLocalDoc: (docs: any[]) => Promise<void>,
  setDoc: (id: string, data: any) => Promise<void>,
  removeDoc: (id: string) => Promise<void>,
}
```

---

#### 属性说明：

- `loading`: 正在加载的状态标志（`Ref<boolean>`）
- `dataMap`: 本地文档数据映射（ID => 数据）

---

#### 方法说明：

##### `syncLocalDoc(docs: any[]): Promise<void>`

将传入的文档数组同步到本地数据库并更新响应式数据。

- **参数**：
  - `docs`: 来自远程或其它来源的文档数组，每个文档需有 `id` 字段

- **返回值**：`Promise<void>`

---

##### `setDoc(id: string, data: any): Promise<void>`

更新本地数据库中指定 ID 的文档，并同步到响应式数据中。

- **参数**：
  - `id`: 文档 ID
  - `data`: 要保存的文档内容

- **返回值**：`Promise<void>`

---

##### `removeDoc(id: string): Promise<void>`

删除指定文档，并从响应式数据中移除。

- **参数**：
  - `id`: 文档 ID

- **返回值**：`Promise<void>`

---

## 💡 使用示例

```ts
// 在 Vue 组件中
const {
  loading,
  dataMap,
  syncLocalDoc,
  setDoc,
  removeDoc
} = useLocalGamesDoc();

// 同步文档
await syncLocalDoc(remoteDocs);

// 设置/更新文档
await setDoc('game-1', { name: 'New Game' });

// 删除文档
await removeDoc('game-1');
```
