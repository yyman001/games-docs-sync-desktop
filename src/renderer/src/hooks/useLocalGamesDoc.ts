import { ref } from 'vue'
import { callNodeAsync } from '@/utils/ipc'
import type { GameDocItem } from '@/types'

export function useLocalGamesDoc() {
	const loading = ref(false)
	const total = ref(0)
	const currentPage = ref(1)
	const pageSize = ref(10)
	const tableList = ref<GameDocItem[]>([])
	const searchType = ref<'gameName' | 'steamId'>('gameName')
	const searchText = ref('')

	const fetchPageData = async (params?: {
		page?: number
		pageSize?: number
		searchField?: string
		searchValue?: string
		orderBy?: string
		orderDirection?: 'ASC' | 'DESC'
	}) => {
		if (loading.value) return
		loading.value = true

		try {
			const { totalCount, currentPageData } = await callNodeAsync({
				functionName: 'getFilteredPaginatedData',
				modName: 'localGamesDocDatabase',
				data: {
					page: params?.page || currentPage.value,
					pageSize: params?.pageSize || pageSize.value,
					filter:
						params?.searchField && params?.searchValue
							? {
									field: params?.searchField || searchType.value,
									value: params?.searchValue || searchText.value
								}
							: {},
					orderBy: params?.orderBy || 'gameName',
					orderDirection: params?.orderDirection || 'ASC'
				}
			})
			total.value = totalCount
			tableList.value = currentPageData
		} catch (error) {
			console.error(error)
			throw error
		} finally {
			setTimeout(() => {
				loading.value = false
			}, 500)
		}
	}

	const createGameDoc = async (item: GameDocItem) => {
		try {
			return await callNodeAsync({
				modName: 'localGamesDocDatabase',
				functionName: 'insertData',
				data: item
			})
		} catch (error) {
      console.error(error)
			return null
    }
	}

	const updateGameDoc = async (item: GameDocItem) => {
		try {
			return await callNodeAsync({
				modName: 'localGamesDocDatabase',
				functionName: 'updateData',
				data: item
			})
		} catch (error) {
			console.error(error)
			return null
		}
	}

	const queryGameDoc = async (gameDocDir: string) => {
		try {
			return await callNodeAsync({
				modName: 'localGamesDocDatabase',
				functionName: 'queryGameInfo',
				data: gameDocDir
			})
		} catch (error) {
			console.error(error)
			return null
		}
	}

	const searchGameDoc = async (gameName?: string, steamId?: string) => {
		try {
			return await callNodeAsync({
				modName: 'localGamesDocDatabase',
				functionName: 'queryHasGameDoc',
				data: gameName && steamId ? [gameName, steamId] : gameName || steamId
			})
		} catch (error) {
			console.error(error)
			return []
		}
	}

	return {
		loading,
		total,
		currentPage,
		pageSize,
		tableList,
		searchType,
		searchText,
		fetchPageData,
    createGameDoc,
		updateGameDoc,
		queryGameDoc,
		searchGameDoc
	}
}
