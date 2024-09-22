<template>
  <div class="shadow-md file-explorer">
    <div class="file-explorer__header">
      <div
        class="flex items-center justify-between h-[48px] bg-white text-sm border-b-[1px] border-gray-200 border-solid"
      >
        <div class="flex items-center justify-center flex-none w-1/12">
          <a-checkbox disabled></a-checkbox>
        </div>
        <div class="flex-auto w-auto overflow-hidden">文件名</div>
        <div class="flex-none w-1/12 text-center">状态</div>
        <div class="flex-none w-1/12 text-center">类型</div>
        <div class="flex-none w-1/12 text-center">大小</div>
        <div class="flex-none w-2/12">创建时间</div>
        <div class="flex-none w-2/12">修改时间</div>
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
@import '@/sass/_var.scss';

.file-explorer {
  &__header {
    position: sticky;
    top: 0;
    z-index: 9;

    width: 100%;
    height: 100%;

    background: $color-master;
  }
  &__body {
    position: relative;
    display: block;

    width: 100%;
    height: 100%;
    background: $color-master;
  }
}

.file {
  &__icon {
    height: 50px;
    width: 50px;
    background-repeat: no-repeat;
    background-position: 0 50%;
    background-size: 65%;
    background-image: url(./assets/default.png);
    &--dir {
      background-image: url(./assets/file-dir.png);
    }
    &--zip {
      background-image: url(./assets/zip.png);
    }
  }

  &__cloud-status {
    height: 100%;

    &--up {
      cursor: pointer;
      background-image: url('./assets/cloud-up.png');
    }
    &--down {
      cursor: pointer;
      background-image: url('./assets/cloud-down.png');
    }
    &--sync {
      background-image: url('./assets/cloud-sync.png');
    }
    &--success {
      background-image: url('./assets/cloud-success.png');
    }
    &--fail {
      background-image: url('./assets/cloud-fail.png');
    }
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 50%;
  }
}

.is-disabled {
  opacity: 0.5;
  cursor: no-drop;
}
</style>
