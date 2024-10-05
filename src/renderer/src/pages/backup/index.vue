<template>
  <div class="grid grid-rows-[auto,1fr,auto] h-screen w-full relative">
    <header class="p-4">
      <h2 class="text-2xl font-bold text-black">存档备份/还原</h2>
      <div
        v-show="activeDirectoryName"
        @click="handleSetDirectory()"
        class="flex items-center ml-2 text-black cursor-pointer"
      >
        <div><ArrowLeftOutlined /></div>
        <div class="ml-4 text-xl">{{ activeDirectoryName }}</div>
      </div>
      <ModalRestore />
    </header>
    <main class="p-4 overflow-hidden bg-gray-100">
      <template v-if="filterList.length">
        <FileExplorer>
          <FileItem
            v-for="item in filterList"
            :key="item.basename"
            :fileName="item.basename"
            :nickName="getGameNickName(item.basename)"
            :fileType="item.type"
            :fileSize="formatFileSize(fileOrDirSize(item))"
            :item="item"
            :time="formatTimestamp(item.timeStamp, 'YYYY-MM-DD HH:mm')"
            :isSyncSuccess="getSyncStatus(item)"
            :isCloudFile="!item.path"
            :disabled="false"
            @handleOpenFile="handleOpenFile"
            @handleAction="handleAction"
          />
        </FileExplorer>
      </template>
      <template v-else>
        <Empty description="未找到相关备份文件" :image="simpleImage" />
      </template>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { Empty } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import FileExplorer from '@/components/FileExplorer/index.vue'
import FileItem from '@/components/FileExplorer/FileItem.vue'
import { formatTimestamp, formatFileSize } from '@/utils/index'
import ModalRestore  from '@/modal/restore/index.vue'
import useCore from './useCore'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const {
  filterList,
  fileOrDirSize,
  getSyncStatus,
  getGameNickName,
  activeDirectoryName,
  handleSetDirectory,
  handleOpenFile,
  handleAction
} = useCore()
</script>

<style lang="sass" scoped></style>
