<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'
import Card, { CardEmitItem } from '@/components/Card/index.vue'
import { GameItem } from '@/model'
import { useGames } from './db'
const { gameList } = useGames()

const searchText = ref('')

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

const onContextMenu = (event: MouseEvent, item: GameItem) => {
}

</script>

<template>
  <div class="grid grid-rows-[auto, 1fr] h-screen w-full relative">
    <header class="p-4">
      <h2 class="text-2xl font-bold text-black">我的游戏库</h2>
    </header>
    <main class="p-4 overflow-hidden bg-gray-100">
      <ScrollArea class="w-full h-full border rounded-md config-page bg-slate-100">
        <template v-if="GameItems?.length">
          <div class="grid grid-cols-4 gap-4">
            <Card
              :key="item.gameName"
              v-for="item in GameItems"
              :item="item"
              :appStatus="appStatus"
              :appName="GAME_DOC_DIR"
              :hasGameDoc="hasGameDoc(item.gameDocDir)"
              :hasGamePath="hasGamePath(item.gameDocDir)"
              @handleClick="handleClick"
              @contextmenu="onContextMenu($event, item)"
            />
          </div>
        </template>
        <template v-else>
          <Empty description="未找到游戏" :image="simpleImage" />
        </template>
      </ScrollArea>
    </main>
  </div>
</template>
