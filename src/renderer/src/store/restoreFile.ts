import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { message, notification } from 'ant-design-vue'
import useModal, { modal, RestoreModal } from '@/hooks/useModal'
import useDocTree from '@/hooks/useDocTree'
import { callNodeAsync, callNodesync } from '@/utils/ipc'
import { useConfigStoreWhitOut } from '@/store/config'

// 查询数据库获取游戏文档信息
const queryGameInfo = (gameDocDir: string) => {
  if (!gameDocDir) return null

  return callNodeAsync({
    functionName: 'queryGameInfo',
    modName: 'localGamesDocDatabase',
    data: gameDocDir
  })
}

export const useRestoreFileStore = defineStore('restoreFile', () => {
  const docPath = ref('')
  const setDocPath = (path: string) => {
    docPath.value = path
  }
  const backupFilePath = ref('')
  const setBackupFilePath = (path: string) => {
    backupFilePath.value = path
  }

  const tempUnCompressRootPath = ref('')
  const setTempUnCompressPath = (path: string) => {
    tempUnCompressRootPath.value = path
  }

  const tempUnCompressGameDocPath = ref('')
  const setCopyDocPath = (path: string) => {
    tempUnCompressGameDocPath.value = path
  }

  const { selectedKeys, treeData, createNode, nodeSize } = useDocTree()
  const { isVisible, onModalOpen, onModalClose } = useModal()
  const useConfigStore = useConfigStoreWhitOut()
  const { tempPath } = storeToRefs(useConfigStore)
  const { HOME_DIR } = window.systemInfo

  const showRestoreFile = async (file: any) => {
    const gameDocItem = await queryGameInfo(file.dirname)
    console.log('gameDocItem', gameDocItem)

    if (!gameDocItem) {
      console.log('未找到game doc 对象！')
      message.error('未找到game doc 对象！')
      return
    }

    // 获取游戏文档路径
    const gameDocFullPath = callNodesync({
      modName: 'path',
      functionName: 'getGameDocPath',
      data: gameDocItem.gameDocPath
    })

    // 设置文件路径和文档路径
    setBackupFilePath(file.path)
    setDocPath(gameDocFullPath)

    // 解压临时路径
    // ! 压缩包解压到根目录:带游戏文件夹名, 复制: 目录到目录(带游戏文件夹名)
    const uncompressRoot = useConfigStore.getTempPath('uncompress_root')
    setTempUnCompressPath(uncompressRoot)
    console.log('tempUnCompressRootPath', tempUnCompressRootPath.value)

    const temp = callNodesync({
      modName: 'path',
      functionName: 'getPath',
      data: [unref(tempUnCompressRootPath), gameDocItem.gameDocDir]
    })
    setCopyDocPath(temp)

    try {
      // 解压文件! 只针对<压缩包>
      await callNodeAsync({
        functionName: 'unCompress',
        modName: 'compressing',
        shouldSpread: true, // 展开参数
        data: [file.path, unref(tempUnCompressRootPath)]
      })

      // 读取解压文件列表
      createNode(unref(tempUnCompressGameDocPath), gameDocItem.gameDocDir)
      onModalOpen()
    } catch (e) {
      console.error(e)
      message.error('解压失败!')
    }
  }

  const onRestoreBackup = async () => {
    if (!selectedKeys.value.length) {
      message.warn('请选择要恢复的文件!')
      return
    }

    try {
      // 复制文件
      await callNodeAsync({
        functionName: 'copyWithFilter',
        modName: 'file',
        shouldSpread: true, // 展开参数
        data: [unref(tempUnCompressGameDocPath), unref(docPath), unref(selectedKeys)]
      })
      // 删除解压文件
      await callNodeAsync({
        functionName: 'remove',
        modName: 'file',
        data: unref(tempUnCompressGameDocPath)
      })

      notification.open({
        placement: 'bottomRight',
        message: '消息',
        description: '存档恢复成功!'
      })
      onModalClose()
    } catch (error) {
      message.error('未找到game doc 对象！')
    }
  }

  const onRemoveTempDir = async () => {
    try {
      // 删除解压文件
      await callNodeAsync({
        functionName: 'remove',
        modName: 'file',
        data: unref(tempUnCompressGameDocPath)
      })
      onModalClose()
    } catch (error) {
      console.error(error)
    }
   }

  return {
    docPath,
    setDocPath,

    backupFilePath,
    setBackupFilePath,

    isVisible,
    onModalOpen,
    onModalClose,

    onRestoreBackup,
    onRemoveTempDir,
    showRestoreFile,

    selectedKeys,
    treeData,
    nodeSize
  }
})

export const useRestoreFileStoreWhitOut = () => useRestoreFileStore()
