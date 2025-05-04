<template>
	<div class="overflow-hidden rounded-md shadow-md file-explorer">
		<div class="file-explorer__header">
			<div
				class="flex items-center justify-between h-[48px] bg-custom-primary text-sm border-b-[1px] border-solid border-color">
				<div class="flex items-center justify-center flex-none w-1/12">
					<a-checkbox disabled></a-checkbox>
				</div>
				<div class="flex-auto w-auto overflow-hidden text-foreground">文件名</div>
				<div class="flex-none w-1/12 text-center text-foreground">状态</div>
				<div class="flex-none w-1/12 text-center text-foreground">类型</div>
				<div class="flex-none w-1/12 text-center text-foreground">大小</div>
				<div class="flex-none w-2/12 text-foreground">创建时间</div>
				<div class="flex-none w-2/12 text-foreground">预留功能</div>
			</div>
		</div>
		<div class="file-explorer__body">
			<slot />
		</div>
	</div>
</template>

<script>
	export default {}
</script>

<style lang="scss">
	.file-explorer__header {
		position: sticky;
		top: 0;
		z-index: 9;
		width: 100%;
		height: 100%;
		background: var(--background);
	}
	.file-explorer__body {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		background: var(--background);
	}
	.file__icon {
		height: 50px;
		width: 50px;
		background-repeat: no-repeat;
		background-position: 0 50%;
		background-size: 65%;
		filter: var(--icon-filter);
	}
	.file__icon--dir {
		background-image: url(./assets/file-dir.png);
	}
	.file__icon--zip {
		background-image: url(./assets/zip.png);
	}
	.file__cloud-status {
		height: 100%;
		background-repeat: no-repeat;
		background-position: 50%;
		background-size: 50%;
		filter: var(--icon-filter);
	}
	.file__cloud-status--up {
		cursor: pointer;
		background-image: url('./assets/cloud-up.png');
	}
	.file__cloud-status--down {
		cursor: pointer;
		background-image: url('./assets/cloud-down.png');
	}
	.file__cloud-status--sync {
		background-image: url('./assets/cloud-sync.png');
	}
	.file__cloud-status--success {
		background-image: url('./assets/cloud-success.png');
	}
	.file__cloud-status--fail {
		background-image: url('./assets/cloud-fail.png');
	}

	.is-disabled {
		opacity: 0.5;
		cursor: no-drop;
	}

	:root {
		--icon-filter: none;
	}

	[data-theme='dark'] {
		--icon-filter: invert(1) hue-rotate(180deg);
	}
</style>
