<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select/index.ts'
import { defineComponent } from 'vue'
defineComponent({
  name: 'ColudSelect'
})
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

<template>
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
</template>
