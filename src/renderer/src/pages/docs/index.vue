<template>
	<div class="grid grid-rows-[auto,1fr,auto] h-screen w-full relative">
		<!-- Header -->
		<header class="p-4">
			<h2 class="mb-2 text-2xl font-bold text-black">游戏库</h2>
			<div class="flex items-center gap-2">
				<div class="relative items-center max-w-sm">
					<a-input-group compact>
						<a-select v-model:value="searchType" class="w-[120px]">
							<a-select-option value="gameName">游戏名</a-select-option>
							<a-select-option value="steamId">steamId</a-select-option>
						</a-select>
						<a-input v-model:value="searchText" style="width: 60%" />
					</a-input-group>
				</div>
				<div>
					<Button class="h-8 text-base button" @click="onModalOpen">
						<Plus class="size-6 text-muted-foreground" />
						新增存档模板
					</Button>
				</div>
				<div class="ml-auto">
					<Button variant="outline" size="icon">
						<ArrowDownAZ class="w-4 h-4" />
					</Button>
				</div>
			</div>
			<ModalDoc />
		</header>

		<!-- Content -->
		<main class="relative p-4 overflow-hidden">
			<ScrollArea class="w-full h-full p-4 config-page">
				<div
					:key="record.steamId"
					v-for="record in GameDocItems"
					class="flex justify-between p-3 mb-4 rounded-md master-primary-color">
					<div class="w-2/5 overflow-hidden bg-white rounded-md">
						<img
							:src="horizontalCover(record.steamId, 'schinese')"
							:alt="record.gameName"
							@error="handleImageError($event, record.steamId)"
							class="w-full h-auto horizontalCover" />
					</div>

					<div class="relative w-3/5 p-4">
						<h2 class="mb-4 text-xl text-black">{{ record.gameName }}</h2>
						<button
							class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
							@click="onAddGameDocToMyLib(record)">
							添加到我的游戏库
						</button>

            <button @click="onUpdate(record)" class="absolute px-4 py-2 text-white bg-blue-500 rounded top-2 right-2 hover:bg-blue-600">修改</button>
					</div>
				</div>
			</ScrollArea>
      <a-empty class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" v-if="GameDocItems.length === 0" :description="null" />
		</main>

		<!-- Footer -->
		<footer class="flex justify-center p-4 mb-2">
			<a-pagination
				v-model:current="currentPage"
				v-model:pageSize="pageSize"
				show-size-changer
				:total="total"
				:show-total="(total) => `共 ${total} 条`"
				:disabled="loading"
				@showSizeChange="onShowSizeChange" />
			<a-spin :spinning="loading" class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
		</footer>
	</div>
</template>

<script lang="ts" setup>
	import { ScrollArea } from '@/components/ui/scroll-area'
	import { Input } from '@/components/ui/input'
	import { Button } from '@/components/ui/button'
	import { message, InputGroup as AInputGroup, Select as ASelect, Input as AInput, Empty as AEmpty } from 'ant-design-vue'
	import { PlusOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons-vue'
	import { Search, Plus, FolderSearch, Menu, ArrowDownAZ, RefreshCw } from 'lucide-vue-next'
	import { ref, onMounted, onBeforeUnmount, defineComponent, inject, computed, unref, Ref, watch } from 'vue'
	import ModalDoc from '@/modal/doc/index.vue'

	import { horizontalCover } from '@/utils/steamPrivew'
	import { deepCopy } from '@/utils/deepCopy'
	import { GameItem, GameDocItem } from '@/types'
	import { callNodeAsync } from '@/utils/ipc'
	import { useDocFormStoreWhitOut } from '@/store/doc'
	import { useGames } from '../games/db'
	import { useLocalGamesDoc } from '@/hooks/useLocalGamesDoc'

	const { onModalOpen, onSetDocForm, setUpdateStatus } = useDocFormStoreWhitOut()
	const { addGame, searchGame } = useGames()
	const { searchType, searchText, loading, total, currentPage, pageSize, tableList, fetchPageData } = useLocalGamesDoc()

	const onAddGameDocToMyLib = async (item: GameDocItem) => {
		const hasGame = await searchGame(item.gameDocDir)
		if (hasGame) {
			message.error('游戏已经存在!')
			return
		}

		console.log('item', item)
		// todo: GameDocItem 改为 GameItem
		const rtx = await addGame(deepCopy(item))
		console.log(rtx)
		if (rtx !== null) {
			message.success('添加成功!')
			return
		}

		message.error('添加失败!')
	}

	const onUpdate = async (record: any) => {
    setUpdateStatus(true)
    onSetDocForm(record)
    onModalOpen()
  }

	const onDel = async (gameDocDir: string) => {}

	onMounted(() => {
		fetchPageData()
	})

	const onShowSizeChange = (current: number, size: number) => {
		pageSize.value = size
		currentPage.value = current
	}

	const GameDocItems = computed(() => {
		if (!Array.isArray(unref(tableList))) return []
		return unref(tableList)
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

	watch(
		() => [searchType.value, searchText.value, currentPage.value, pageSize.value],
		() => {
			fetchPageData({
				page: currentPage.value,
				pageSize: pageSize.value,
				searchField: searchType.value,
				searchValue: searchText.value
			})
		}
	)
</script>
<style lang="scss">
	.horizontalCover {
		max-height: 140px;
	}
</style>
