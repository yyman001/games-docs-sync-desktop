<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Empty, message } from 'ant-design-vue'
import Card, { CardEmitItem } from '@/components/Card/index.vue'
import ModalBackup from '@/modal/backup/index.vue'
import useModel, { modal } from '@/hooks/useModal'
import { GameItem } from '@/model'
import { useGames } from './db'
import { useConfigStoreWhitOut } from '@/store/config'
import { storeToRefs } from 'pinia'
import { callNodesync } from '@/utils/ipc'

const simpleImage = Empty.PRESENTED_IMAGE_DEFAULT
const { backupPath } = storeToRefs(useConfigStoreWhitOut())

// todo: 支持 搜索
const searchText = ref('')

// todo: 备份还原
const GAME_DOC_PATH = ref('')
const GAME_FILES_BACKUP_PATH = ref('')
const GAME_DOC_DIR = ref('')
const pathType = ref('')

const { gameList } = useGames()

const GameItems = computed(() => {
  if (!searchText.value) return gameList.value
  return gameList.value.filter((game: any) => {
    const regExp = new RegExp(searchText.value, 'i')
    return regExp.test(game.gameName) || regExp.test(game.nickName) || regExp.test(game.steamId)
  })
})

const hasGameDoc = (gameDocDir: string) => {
  return gameList.value.some((item: any) => item.gameDocDir === gameDocDir)
}

const hasGamePath = (gameDocDir: string) => {
  return gameList.value.some((item: any) => item.gameDocDir === gameDocDir)
}

// todo: 支持右键菜单
const onContextMenu = (event: MouseEvent, item: GameItem) => {
  console.log(event, item)
}

// todo
const handleClickCard = ([appStatus, item]: CardEmitItem) => {
  console.log(appStatus, item)
  switch (appStatus) {
    case 'backup':
      const gameDocFullPath = callNodesync({
        modName: 'path',
        functionName: 'getGameDocPath',
        data: item.gameDocPath
      })

      const isValidPath = callNodesync({
        modName: 'file',
        functionName: 'checkPathExists',
        data: gameDocFullPath
      })

      if (!isValidPath) {
        message.error('游戏存档路径不存在!')
        return
      }

      const backupGameDocFullPath = callNodesync({
        modName: 'path',
        functionName: 'getPath',
        data: [backupPath.value, item.gameDocDir]
      })

      GAME_DOC_DIR.value = item.gameDocDir
      GAME_DOC_PATH.value = gameDocFullPath
      GAME_FILES_BACKUP_PATH.value = backupGameDocFullPath
      onModalOpen()
      return
    case 'restore':
      /*
      lastFile = localFile.getLastFile(gameDocDir)
          if (!lastFile) return error('未找到可以还原的备份存档文件!')
          showRestoreFile(lastFile)
      旧方案: 获取最新备份文件，并还原
      新方案: 获取最近10个备份文件, 选中一个进行还原
      新方案2: 跳转到���份文件列表页让用户自己选(可以把这个功能添加到右键菜单)
      */
      return
    default:
      return
  }
}

const { isVisible, onModalOpen, onModalClose } = useModel()
// 注入参数
provide(modal, {
  isVisible,
  onModalClose,

  GAME_DOC_DIR,
  GAME_DOC_PATH,
  GAME_FILES_BACKUP_PATH
})
</script>

<template>
  <div class="grid grid-rows-[auto,1fr,auto] h-screen w-full relative">
    <header class="h-24 p-4">
      <h2 class="text-2xl font-bold text-black">我的游戏库</h2>
    </header>
    <main class="grid p-4 overflow-hidden bg-gray-100">
      <template v-if="GameItems?.length">
        <ScrollArea class="w-full h-full border rounded-md config-page bg-slate-100">
          <div class="grid grid-cols-4 gap-4">
            <Card
              :key="item.gameName"
              v-for="item in GameItems"
              :item="item"
              :appName="GAME_DOC_DIR"
              :hasGameDoc="hasGameDoc(item.gameDocDir)"
              :hasGamePath="hasGamePath(item.gameDocDir)"
              @handleClick="handleClickCard"
              @contextmenu="onContextMenu($event, item)"
            />
          </div>
        </ScrollArea>
      </template>
      <template v-else>
        <div class="grid h-full place-content-center">
          <Empty description="未找到游戏" :image="simpleImage" />
        </div>
      </template>
    </main>
  </div>
  <ModalBackup />
</template>
<style scoped lang="scss"></style>
