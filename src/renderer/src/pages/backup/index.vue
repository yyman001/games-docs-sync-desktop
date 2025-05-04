<template>
  <div class="grid grid-rows-[auto,1fr,auto] h-screen w-full relative">
    <header class="p-4">
      <h2 class="mb-2 text-2xl font-bold text-black">存档备份/还原</h2>
      <div
        v-show="activeDirectoryName"
        @click="handleSetDirectory()"
        class="flex items-center ml-2 text-black cursor-pointer"
      >
        <div><ArrowLeftOutlined /></div>
        <div class="ml-4 text-xl">{{ activeDirectoryName }}</div>
      </div>
      <ModalRestore />
      <div class="flex items-center gap-2">
        <div class="relative items-center max-w-sm">
          <Input id="search" type="text" placeholder="Search..." class="pl-10" />
          <span class="absolute inset-y-0 flex items-center justify-center px-2 start-0">
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>

        <div class="ml-auto">
          <Button variant="outline" size="icon">
            <Menu class="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowDownAZ class="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
    <main class="p-4 overflow-hidden">
      <template v-if="filterList.length">
        <FileExplorer class="master-primary-color">
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
        <div class="grid h-full place-content-center">
          <Empty description="无游戏备份存档文件" :image="simpleImage" />
        </div>
      </template>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { Empty } from 'ant-design-vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { Search, Plus, FolderSearch, Menu, ArrowDownAZ, RefreshCw } from 'lucide-vue-next'
import FileExplorer from '@/components/FileExplorer/index.vue'
import FileItem from '@/components/FileExplorer/FileItem.vue'
import { formatTimestamp, formatFileSize } from '@/utils/index'
import ModalRestore from '@/modal/restore/index.vue'
import useCore from './useCore'

const simpleImage = Empty.PRESENTED_IMAGE_DEFAULT
const {
  fileList,
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
