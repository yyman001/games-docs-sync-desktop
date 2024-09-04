<template>
  <div class="flex w-full">
    <div class="relative flex flex-col flex-wrap w-1/4 h-full p-2 border-r-[1px] border-gray-200 max-w-[240px]">
      <div class="flex items-center justify-center w-full p-4">
        <div class="flex items-center justify-center flex-1"><Gamepad class="w-12 h-12" /></div>
        <div class="flex-auto text-xl font-bold text-nowrap">G D S</div>
      </div>

      <Menu />

      <div class="flex w-full pb-4 mt-auto">
        <div class="flex-auto">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="选择同步源" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>同步源:</SelectLabel>
                <SelectItem v-for="item in config" :key="item.name" :value="item.name"> {{ item.name }} </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center justify-center flex-1">
          <ReloadOutlined />
        </div>
      </div>
    </div>
    <div class="flex w-3/4 p-2 layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from './components/Menu/index.vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { Separator } from '@/components/ui/separator'
import { RefreshCw, Gamepad } from 'lucide-vue-next'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const config = [
  {
    "name": "坚果云",
    "type": "jianguoyun",
    "url": "https://dav.jianguoyun.com/dav/",
    "usearname": "yyman001@qq.com",
    "password": "akuz6vqd5iccz67w",
    "rootDirectoryName": "games_doc_sync"
  },
  {
    "name": "阿里云",
    "type": "ali-oss",
    "accessKeyId": "",
    "accessKeySecret": "",
    "bucket": "games-document-sync"
  }
]


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
