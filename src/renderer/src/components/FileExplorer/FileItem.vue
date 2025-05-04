<template>
	<div
		class="flex items-center justify-between w-full text-xs border-opacity-50 flex-nowrap text-muted-foreground border-border hover:file-explorer-hover">
		<div class="flex items-center justify-center flex-none w-1/12">
			<a-checkbox disabled></a-checkbox>
		</div>
		<div class="flex flex-auto w-auto overflow-hidden">
			<div class="flex-none file__icon" :class="fileIcon"></div>
			<div
				class="inline-flex flex-col flex-wrap justify-center flex-auto max-w-full text-sm leading-normal cursor-pointer hover:underline file__name"
				@click="handleClick">
				<span class="text-sm text-foreground">{{ fileName }}</span>
				<span class="text-xs text-muted-foreground">{{ nickName }}</span>
			</div>
		</div>
		<!-- 状态 -->
		<div class="self-stretch flex-none w-1/12 text-center" :class="{ 'is-disabled': disabled }">
			<a-tooltip placement="top" :title="cloudText">
				<div class="h-full file__cloud-status" :class="cloudStatus" @click="handleAction(cloudType)"></div>
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
		<div class="flex-none w-2/12">---</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { RollbackOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'

	interface FileItem {
		type: string
		[key: string]: any
	}

	const props = withDefaults(
		defineProps<{
			item: FileItem
			fileType: string
			fileName: string
			nickName: string
			fileSize?: string
			time?: string
			isCloudFile: boolean
			isSyncSuccess: boolean
			isSyncing: boolean
			disabled: boolean
		}>(),
		{
			fileSize: '',
			time: ''
		}
	)

	const emit = defineEmits<{
		handleOpenFile: [payload: FileItem]
		handleAction: [payload: FileItem & { eventType: string }]
	}>()

	const isFolder = computed(() => props.fileType === 'directory')

	const fileIcon = computed(() => {
		switch (props.fileType) {
			case 'file':
				return 'file__icon--zip'
			case 'directory':
				return 'file__icon--dir'
			default:
				return ''
		}
	})

	const fileTypeName = computed(() => {
		switch (props.fileType) {
			case 'file':
				return '压缩包'
			case 'directory':
				return '文件夹'
			default:
				return '未知类型'
		}
	})

	const cloudStatus = computed(() => {
		// TODO: 断网状态, 初始化状态, 错误状态
		if (props.isSyncSuccess) return 'file__cloud-status--success'
		// TODO: 借用同步中状态, 后期同步中状态改为会动的
		if (isFolder.value) return 'file__cloud-status--sync'
		// if (props.isSyncing) return 'file__cloud-status--sync'
		return props.isCloudFile ? 'file__cloud-status--down' : 'file__cloud-status--up'
	})

	const cloudText = computed(() => {
		if (props.isSyncSuccess) return '已同步'
		if (isFolder.value) return '开始同步'
		// if (props.isSyncing) return '正在同步...'
		return props.isCloudFile ? '下载' : '上传'
	})

	const cloudType = computed(() => {
		if (props.isSyncSuccess) return 'cloud-success'
		if (isFolder.value) return 'cloud-sync'
		// if (props.isSyncing) return 'cloud-sync'
		return props.isCloudFile ? 'cloud-down' : 'cloud-up'
	})

	const handleClick = () => {
		emit('handleOpenFile', {
			...props.item,
			fileType: props.item.type
		})
	}

	const handleAction = (eventType: string) => {
		if (props.disabled) return

		emit('handleAction', {
			...props.item,
			eventType
		})
	}
</script>

<style lang="scss"></style>
