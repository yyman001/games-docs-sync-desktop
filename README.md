# 游戏存档管理器 (game-document-sync-desktop)

## 项目简介 (Introduction)
一款用于管理游戏存档备份的桌面应用程序，主要针对无云备份游戏或云备份不可靠的游戏。支持本地备份和多种云存储方案，让您的游戏存档更安全。

## 功能特性 (Features)

### 存档备份 (Save Backup)
- ✔️ 全量备份：支持完整的文件备份
- ✔️ 本地备份：自动备份至软件目录下的`backup`文件夹
- 🚧 备份信息记录：
  - 游戏名称
  - 文件名称
  - 存档文件夹
  - 备份时间
  - 平台信息
  - 文件类型
  - 文件路径

### 存档还原 (Save Restore)
- ✔️ 备份列表选择还原
- ✔️ 支持压缩包文件还原
- ✔️ 存档管理功能
  - ❌删除备份
  - ❌打开存档位置
  - ❌打开存档文件

### 云同步 (Cloud Sync)
目前支持的云存储服务：
- ❌ 阿里云 OSS
- ❌ 坚果云网盘

### 游戏管理 (Game Management)
- ✔️ 存档游戏创建
  ❌ 通过配置管理界面创建
  ❌ 通过配置管理界面创建
- ✔️ 游戏列表功能
  ❌ 大图显示
  ❌ 搜索功能
  ❌ 删除操作

## 开发计划 (Roadmap)

### 基础功能 (Basic Features)
- [ ] 多语言支持 (Multi-language Support)
- [ ] 系统托盘支持 (System Tray Support)
- [ ] 自动更新功能 (Auto Update)
- [ ] 日志系统 (Logging System)
- [ ] 软件图标优化 (Software Logo/Icon Enhancement)

### 存档备份功能 (Backup Features)
- [ ] 增量备份功能 (Incremental Backup)
- [ ] 文件MD5校验 (File MD5 Verification)
- [ ] 自定义备份路径 (Custom Backup Path)
- [ ] 文件类型/路径过滤 (File Type/Path Filtering)
- [ ] 备份文件清单及MD5记录 (Backup File List with MD5)
- [ ] 备份版本号支持 (Backup Version Number)
- [ ] 备份信息扩展 (Extended Backup Info)
  - [ ] 版本号 (Version Number)
  - [ ] 备份次数 (Backup Count)
  - [ ] 机器码 (Machine Code)
  - [ ] 备注 (Notes)

### 存档还原功能 (Restore Features)
- [ ] 多路径还原支持 (Multi-path Restore)
- [ ] 文件筛选功能 (File Filtering)

### 云同步功能 (Cloud Sync Features)
- [ ] 云还原支持 (Cloud Restore)
  - [ ] 压缩包模式 (Archive Mode)
  - [ ] 散文件模式 (Individual Files Mode)
- [ ] 更多云存储支持 (More Cloud Storage Support)
  - [ ] OSS
    - [ ] 阿里云OSS
    - [ ] minio
    - [ ] 腾讯oss
  - [ ] GitHub
  - [ ] Google Drive
  - [ ] OneDrive
  - [ ] 私有服务器 (Private Server)

### 游戏管理功能 (Game Management)
- [ ] 游戏启动器集成 (Game Launcher Integration)
  - Steam
  - Epic
  - 学习版支持 (Other Version Support)
- [ ] 游戏存档扫描 (Game Save Scanning)
- [ ] 拖拽创建游戏配置 (Drag & Drop Game Config)
- [ ] 游戏列表优化 (Game List Enhancement)
  - 缩略图视图 (Thumbnail View)
  - 分类排列 (Category Sorting)

### 界面优化 (UI Enhancement)
- [ ] UI界面重构 (UI Reconstruction)
- [ ] 操作流程优化 (Operation Flow Optimization)
- [ ] 视觉风格统一 (Visual Style Unification)


## 技术栈 (Tech Stack)
- 框架：Electron + Vue 3
- 构建工具：Vite
- 包管理器：pnpm
- UI框架：Tailwind CSS
- 开发语言：TypeScript

## 系统要求 (Requirements)
- Node.js >= 16.0.0
- pnpm >= 8.0.0

## 开发环境推荐 (Recommended IDE Setup)
- [VSCode](https://code.visualstudio.com/)
- 推荐插件：
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)


## 安装与运行 (Installation & Running)

### 安装依赖 (Install Dependencies)
```bash
pnpm install
```

### 开发模式 (Development)
```bash
pnpm dev
```

### 构建应用 (Build)
```bash
# Windows
pnpm build:win

# macOS
pnpm build:mac

# Linux
pnpm build:linux
```

## 贡献指南 (Contributing)
欢迎提交问题和功能建议！如果您想贡献代码，请先fork本仓库并提交pull request。
