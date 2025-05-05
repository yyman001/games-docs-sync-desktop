<template>
	<div class="modal-doc">
		<a-modal
			class="doc-form-modal"
			:title="isUpdate ? '更新游戏存档信息' : '添加游戏存档信息'"
			:visible="isVisible"
			:footer="null"
			:maskClosable="false"
			@cancel="onModalClose">
			<a-form class="doc-form" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">
				<a-form-item label="SteamId" name="steamId">
					<a-input v-model:value="steamId" />
					<button :disabled="isPulling" @click="getGameInfoForSteamId(steamId)">自动识别</button>
				</a-form-item>

				<a-form-item label="游戏名" name="gameName">
					<a-input-search v-model:value="gameName" @search="onChangeSearchGameName" />
				</a-form-item>

				<a-form-item label="游戏别名" name="nickName">
					<a-input v-model:value="nickName" />
				</a-form-item>

				<a-form-item label="文件夹存档名" name="gameDocDir">
					<a-input v-model:value="gameDocDir" disabled />
				</a-form-item>

				<a-form-item label="<自动分析>存档路径" name="tempParseGameDocPath">
					<a-input v-model:value="tempParseGameDocPath" />
				</a-form-item>

				<a-form-item label="存档路径类型" name="pathType">
					<a-input :value="pathType" disabled />
				</a-form-item>

				<a-form-item label="存档路径(相对)" name="gameDocPath">
					<a-input :value="gameDocPath" disabled />
				</a-form-item>

				<a-form-item label="存档路径(绝对)" name="gameDocFullPath">
					<a-input :value="gameDocFullPath" disabled />
				</a-form-item>

				<a-form-item label="系统类型" name="systemType">
					<a-input :value="SYSTEM_TYPE" disabled />
				</a-form-item>

				<a-form-item label="用户目录" name="homedir">
					<a-input :value="HOME_DIR" disabled />
				</a-form-item>

				<a-form-item :wrapper-col="{ offset: 8, span: 16 }">
					<a-space :size="100">
						<a-button html-type="submit" @click="onModalClose">取消</a-button>
						<a-button type="primary" html-type="submit" @click="onSubmit">
							{{ isUpdate ? '更新' : '添加' }}
						</a-button>
					</a-space>
				</a-form-item>
			</a-form>
		</a-modal>

		<a-modal
			title="游戏存档信息"
			:visible="isGameModal"
			:footer="null"
			:maskClosable="false"
			@cancel="onCloseFullModal"
			width="auto"
			:centered="true">
			<a-table :dataSource="dataSource" :columns="columns" :pagination="false" size="small">
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action' && record.content !== 'Location'">
						<span>
							<a @click="onClickRow(record)">使用</a>
						</span>
					</template>
				</template>
			</a-table>
		</a-modal>
	</div>
</template>

<script lang="ts" setup>
	import { ref, unref } from 'vue'
	import { storeToRefs } from 'pinia'
	import { message } from 'ant-design-vue'
	import { useDocFormStoreWhitOut } from '@/store/doc'
	import { callNodeAsync } from '@/utils/ipc'
	import { usePullGame } from './usePullGame'
	import { useLocalGamesDoc } from '@/hooks/useLocalGamesDoc'

	defineOptions({
		name: 'modal-doc'
	})

	const docFrom = useDocFormStoreWhitOut()
	const {
		isVisible,
		isUpdate,
		pathType,
		steamId,
		gameName,
		nickName,
		gameDocDir,
		gameDocPath,
		gameDocFullPath,
		tempParseGameDocPath
	} = storeToRefs(docFrom)

	const {
		isPulling,
		isGameModal,
		dataSource,
		columns,
		onClickRow,
		getGameInfoForSteamId,
		onModalClose: onCloseFullModal
	} = usePullGame()

	const { searchGameDoc, createGameDoc, updateGameDoc } = useLocalGamesDoc()

	const { HOME_DIR, SYSTEM_TYPE } = window.systemInfo

	const repetitionGame = ref<any[]>([])

	const onModalClose = () => {
		// 重置标记状态
		docFrom.setUpdateStatus()
		docFrom.onCloseDocModal()
	}

	const onSubmit = async () => {
		const item = {
			steamId: unref(steamId),
			gameName: unref(gameName),
			nickName: unref(nickName),
			gameDocDir: unref(gameDocDir),
			gameDocPath: unref(gameDocPath),
			systemType: SYSTEM_TYPE,
			pathType: unref(pathType),
			saveGameDataLocationForWindows: ''
		}

		console.log('isUpdate:', unref(isUpdate))
		console.log('onSubmit data:', item)
		try {
			if (unref(isUpdate)) {
				const rtx = await updateGameDoc(item)
				rtx.success ? message.success('更新文档成功') : message.error(rtx.message)
			} else {
				// 先查询是否存在，存在则跳过
				const games = await searchGameDoc(item?.gameName, item?.steamId)

				if (games.length > 0) {
					message.error('游戏已经存在!')
					return
				}

				const rtx = await createGameDoc(item)
				rtx.success ? message.success('创建文档成功') : message.error(rtx.message)
			}
			onModalClose()
		} catch (e) {
			console.error(e)
			message.error('操作失败!')
		}
	}

	const onChangeSearchGameName = async (e: Event) => {
		if (unref(isUpdate)) return
		if (!unref(gameName)) {
			message.warn('请输入游戏名或关键字!')
			return
		}

		const games = await searchGameDoc(unref(gameName))
		if (games.length === 0) {
			message.warn('未找到游戏文档!')
			return
		}

		repetitionGame.value = games[0]
		console.log('onChangeSearchGameName:', unref(gameName), repetitionGame.value)

		message.warning(`存档${unref(gameName)}已存在！`)
	}
</script>

<style>
	.doc-form .ant-form-item {
		margin-bottom: 14px;
	}
	.doc-form .ant-input[disabled] {
		font-weight: bold;
		color: rgb(0 0 0 / 50%);
	}
</style>
