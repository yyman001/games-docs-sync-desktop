<template>
  <div
    class="flex items-center justify-between w-full text-xs text-gray-500 border-gray-300 border-opacity-50 hover:text-black flex-nowrap hover:bg-gray-100"
  >
    <div class="flex items-center justify-center flex-none w-1/12">
      <a-checkbox disabled></a-checkbox>
    </div>
    <div class="flex flex-auto w-auto overflow-hidden">
      <div class="flex-none file__icon" :class="fileIcon"></div>
      <div
        class="flex-auto text-sm inline-flex flex-wrap flex-col justify-center text-[#141416] max-w-full leading-normal cursor-pointer hover:underline file__name"
        @click="handleClick"
      >
        <span class="text-sm">{{ fileName }}</span>
        <span class="text-xs text-black text-opacity-45">{{ nickName }}</span>
      </div>
    </div>
    <!-- 状态 -->
    <div class="self-stretch flex-none w-1/12 text-center" :class="{ 'is-disabled': disabled }">
      <a-tooltip placement="top" :title="cloudText">
        <div
          class="h-full file__cloud-status"
          :class="cloudStatus"
          @click="handleAction(cloudType)"
        ></div>
      </a-tooltip>
    </div>
    <div class="flex-none w-1/12 text-center">
      {{ fileTypeName }}
    </div>
    <div class="flex-none w-1/12 text-center">
      {{ fileSize }}
    </div>
    <div class="flex-none w-2/12">
      {{ time }}
    </div>
    <div class="flex-none w-2/12">
      ---
    </div>
  </div>
</template>

<script>
import { RollbackOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'

export default {
  name: 'file-item',
  components: {
    RollbackOutlined,
    DeleteOutlined,
    FolderOpenOutlined
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    fileType: String,
    fileName: String,
    nickName: String,
    fileSize: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    // 是否未云文件
    isCloudFile: Boolean,
    // 是否已经同步(已存在云文件)
    isSyncSuccess: Boolean,
    // 正在同步
    isSyncing: Boolean,
    // 引用同步状态
    disabled: Boolean
  },
  computed: {
    isFolder() {
      return this.fileType === 'directory'
    },
    fileIcon() {
      switch (this.fileType) {
        case 'file':
          return 'file__icon--zip'
        case 'directory':
          return 'file__icon--dir'
        default:
          return ''
      }
    },
    fileTypeName() {
      switch (this.fileType) {
        case 'file':
          return '压缩包'
        case 'directory':
          return '文件夹'
        default:
          return '未知类型'
      }
    },
    cloudStatus() {
      // TODO: 断网状态, 初始化状态, 错误状态
      if (this.isSyncSuccess) return 'file__cloud-status--success'
      // TODO: 借用同步中状态, 后期同步中状态改为会动的
      if (this.isFolder) return 'file__cloud-status--sync'
      // if (this.isSyncing) return 'file__cloud-status--sync'
      return this.isCloudFile ? 'file__cloud-status--down' : 'file__cloud-status--up'
    },
    cloudText() {
      if (this.isSyncSuccess) return '已同步'
      if (this.isFolder) return '开始同步'
      // if (this.isSyncing) return '正在同步...'
      return this.isCloudFile ? '下载' : '上传'
    },
    cloudType() {
      if (this.isSyncSuccess) return 'cloud-success'
      if (this.isFolder) return 'cloud-sync'
      // if (this.isSyncing) return 'cloud-sync'
      return this.isCloudFile ? 'cloud-down' : 'cloud-up'
    }
  },
  methods: {
    handleClick() {
      this.$emit('handleOpenFile', {
        ...this.item,
        fileType: this.item.type
      })
    },
    handleAction(eventType) {
      if (this.disabled) return

      this.$emit('handleAction', {
        ...this.item,
        eventType
      })
    }
  }
}
</script>

<style lang="scss">
</style>
