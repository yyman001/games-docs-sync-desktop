<template>
  <div class="grid grid-rows-[auto,1fr,auto] h-screen w-full relative">
    <!-- Header -->
    <header class="p-4">
      <h2 class="text-2xl font-bold text-black">游戏库</h2>
    </header>

    <!-- Content -->
    <main class="p-4 overflow-hidden bg-gray-100">
      <ScrollArea class="w-full h-full p-4 border rounded-md config-page bg-slate-100">
        <div
          :key="record.steamId"
          v-for="record in GameDocItems"
          class="flex justify-between p-4 mb-2"
        >
          <div class="w-3/5 p-1 bg-white">
            <img
              :src="horizontalCover(record.steamId, 'schinese')"
              :alt="record.gameName"
              @error="handleImageError($event, record.steamId)"
              class="w-full h-auto horizontalCover"
            />
          </div>

          <div class="w-2/5 p-4">
            <h2 class="mb-4 text-xl text-black">{{ record.gameName }}</h2>
            <button class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
              添加到游戏库
            </button>
          </div>
        </div>
      </ScrollArea>
    </main>

    <!-- Footer -->
    <footer class="flex justify-center p-4 mb-2">
      <a-pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        show-size-changer
        :total="total"
        :disabled="loading"
        @showSizeChange="onShowSizeChange"
      />
      <a-spin
        :spinning="loading"
        class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      />
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ScrollArea } from '@/components/ui/scroll-area'
import { message } from 'ant-design-vue'
import { PlusOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons-vue'
import {
  ref,
  onMounted,
  onBeforeUnmount,
  defineComponent,
  inject,
  computed,
  unref,
  Ref,
  watch
} from 'vue'

import { horizontalCover } from '@/utils/steamPrivew'
import { deepCopy } from '@/utils/deepCopy'
import { GameItem, GameDocItem } from '@/model'
import { callNodeAsync } from '@/utils/ipc'

const searchText = ref('')
const tableColumns = [
  {
    title: '游戏名',
    key: 'gameName'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const onAdd = async (item: GameDocItem) => {}

const onUpdate = async (record: any) => {}

const onDel = async (gameDocDir: string) => {}

const loading = ref(false)
const tableList = ref<GameDocItem[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
async function fetchPageData() {
  if (loading.value) return
  loading.value = true
  try {
    const { totalCount, currentPageData } = await callNodeAsync({
      functionName: 'getPagePagination',
      modName: 'localGamesDocDatabase',
      data: {
        page: currentPage.value,
        pageSize: pageSize.value
      }
    })
    total.value = totalCount
    tableList.value = currentPageData
  } catch (error) {
    throw error
  }
  setTimeout(() => {
    loading.value = false
  }, 500)
}

onMounted(() => {
  fetchPageData()
})

watch(currentPage, () => {
  fetchPageData()
})
const onShowSizeChange = (current: number, pageSize: number) => {
  fetchPageData()
}

const GameDocItems = computed(() => {
  if (!Array.isArray(unref(tableList))) return []
  if (!unref(searchText)) return unref(tableList)

  return unref(tableList as Readonly<Ref<GameDocItem[]>>).filter((game: any) => {
    const regExp = new RegExp(unref(searchText), 'i')
    return regExp.test(game.gameName) || regExp.test(game.nickName) || regExp.test(game.steamId)
  })
})

/**
 * Handle image error event by replacing the image source with a horizontal cover.
 * @param {Event} event - The event object that triggered the error.
 * @param {string} steamId - The Steam ID used to generate the horizontal cover.
 */
const handleImageError = (event: Event, steamId: string) => {
  // Check if the target element is null
  if (event.target === null) {
    return
  }

  // Cast the event target to the appropriate type that has the src property
  const targetElement = event.target as HTMLImageElement

  // Replace the image source with a horizontal cover
  targetElement.src = horizontalCover(steamId)
}
</script>
<style lang="scss">
.horizontalCover {
  max-height: 140px;
}
</style>
