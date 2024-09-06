<script setup lang="ts">
import { callNodeApi, showOpenDialog } from '@/utils/ipc'
// 调用示例
const readFile = async () => {
  const data = await callNodeApi({
    fn: 'getLocalBackupFile',
    path: 'E:\\git-project\\games-docs-sync-desktop\\backup'
  })
  console.log('data', data)
}
const openFile = async () => {
  showOpenDialog()
}
</script>

<template>
  <div>
    <h1>游戏</h1>
    <button @click="readFile">读取文件</button>
    <button @click="openFile">打开文件</button>
  </div>
</template>
