import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { FileItem, WebDavFile } from '@/model'

export const useLocalFileStore = defineStore('localFile', () => {

  const directoryItem = ref<FileItem[]>([])
  const fileItems = ref<FileItem[]>([])

  // 文件夹名称列表
  const localDirectoryListName = computed(() => {
    return unref(directoryItem).map((f) => f.basename)
  })

  // 本地文件名: 格式规范 = (文件夹/文件名) = Aragami/Aragami_t1641735966693.zip
  const localFileListName = computed(() => {
    return unref(fileItems).map((f) => f.comparsedName)
  })

  // 获取文件夹的备份列表
  const getDirectoryChildren = (dirname: string) => {
    return unref(fileItems)
      .filter((f) => f.dirname === dirname)
      .sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp))
  }

  // 还原文件需要获取最后更新的一个文件
  const getLastFile = (dirname: string) => {
    const list = getDirectoryChildren(dirname)
    if (list.length) {
      return list[0]
    }

    return null
  }

  const setLocalFile = (data: any) => {
    if (data === null || data === undefined) return
    directoryItem.value = data.directoryItem
    fileItems.value = data.fileItems
  }

  const removeFile = (comparsedName: string) => {
    fileItems.value = unref(fileItems).filter((f: any) => f.comparsedName !== comparsedName)
  }

  const downloadFile = async (file: WebDavFile, dirname: string) => {
    // 组成: 配置的存档文件夹/游戏目录/游戏存档文件.后缀
    // eg: "/games_doc_sync/test/game.file.config.json"
    const downloadUrl = file.filename
    // 备份文件路径如果设置了读配置

    /* cloudFileStore.downloadCloudFile(downloadUrl, filePath, () => {
      const localFile: FileItem = {
        ...file,
        path: filePath,
        dirname,
        fileType: file.type,
        // 创建文件时间
        timeStamp: Date.now()
      }
      // TODO: 文件夹对象添加
      // directoryItem.value.push()
      // 添加到本地文件
      fileItems.value.push(localFile)
    }) */
  }

  const uploadFile = async (file: FileItem) => {
    // cloudFileStore.uploadFile(file)
  }

  return {
    fileItems,
    directoryItem,

    localFileListName,
    localDirectoryListName,

    setLocalFile,
    getDirectoryChildren,

    removeFile,
    getLastFile,
    // 云上传*云下载
    downloadFile,
    uploadFile
  }
})

export const useLocalFileStoreWhitOut = () => {
  return useLocalFileStore()
}
