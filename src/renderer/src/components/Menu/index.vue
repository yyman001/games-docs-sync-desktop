<template>
  <div class="menu">
    <div class="menu__item" v-for="item in menuList" :key="item.key">
      <router-link
        :class="['menu__link', selectedKeys === item.key ? 'is-active' : '']"
        :to="item.path"
        @click.stop="onMenuSelected(item)"
      >
        <Button
          class="flex justify-between w-full"
          :variant="selectedKeys === item.key ? '' : 'ghost'"
        >
          <AppstoreOutlined v-if="item.icon === 'home'" class="menu__item-icon" />
          <FolderOutlined v-if="item.icon === 'save'" class="menu__item-icon" />
          <AppstoreAddOutlined v-if="item.icon === 'appstore'" class="menu__item-icon" />
          <SettingOutlined v-if="item.icon === 'setting'" class="menu__item-icon" />
          <span class="font-bold"> {{ item.name }} </span>
        </Button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue'
import {
  FolderOutlined,
  AppstoreOutlined,
  AppstoreAddOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import { Button } from '@/components/ui/button'

const selectedKeys = ref('games')
const menuList = ref([
  {
    key: 'games',
    icon: 'home',
    name: '我的游戏库',
    path: '/games'
  },
  {
    key: 'backup',
    icon: 'save',
    name: '存档',
    path: '/backup'
  },
  {
    key: 'docs',
    icon: 'appstore',
    name: '游戏库',
    path: '/docs'
  },
  {
    key: 'config',
    icon: 'setting',
    name: '设置',
    path: '/config'
  }
])

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
  /*  !注意:
  onMenuChange: (selectedItem: any) => void , 方式 emits 会报错,但实际可运行,跟插件检测有关,非正真错误
  */
  (event: 'onMenuChange', selectedItem: any): void
}>()

const onMenuSelected = (selectedItem: any) => {
  selectedKeys.value = selectedItem.key
  emits('onMenuChange', selectedItem)
}
</script>

<style lang="scss" scoped>
@import '@/sass/catppuccin.scss';

.menu {
  width: 100%;

  &__item {
    margin-bottom: 8px;
    padding: 0 16px;
    &-icon {
      margin-right: 12px;
      font-size: 20px;
    }
  }

  &__link {
    border-radius: 5px;
  }
}
</style>
