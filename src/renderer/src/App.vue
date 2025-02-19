<template>
  <div class="flex w-full">
    <div class="relative flex flex-col flex-wrap w-1/4 h-full p-2 border-r-[1px] border-gray-200 max-w-[240px]">
      <div class="flex justify-center items-center p-4 w-full">
        <div class="flex flex-1 justify-center items-center"><Gamepad class="w-12 h-12" /></div>
        <div class="flex-auto text-xl font-bold text-nowrap">G D S</div>
        <div class="flex flex-1 justify-center items-center"><ThemeSwitch /></div>
      </div>
      <Menu />
      <div class="flex pb-4 mt-auto w-full">
        <div class="flex-auto">
          <ColudSelect />
        </div>
        <div class="flex flex-1 justify-center items-center">
          <ReloadOutlined />
        </div>
      </div>
    </div>
    <div class="flex p-2 w-3/4 layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from './components/Menu/index.vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { Gamepad } from 'lucide-vue-next'
import ThemeSwitch from '@/components/ThemeSwitch/index.vue'
import ColudSelect from '@/components/CloudSelect/index.vue'
</script>

<style lang="scss">
@import '@/sass/_var.scss';

#app {
  display: flex;
  height: 100%;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
