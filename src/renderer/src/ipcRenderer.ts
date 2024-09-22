import { storeToRefs } from 'pinia'
import { useLocalFileStoreWhitOut } from '@/store/localFile'
import { useConfigStoreWhitOut } from '@/store/config'
import { callNodeAsync } from '@/utils/ipc'

window.electron.ipcRenderer.on('main-process-load', (event) => {
  console.log('应用启动完成!')

  // 初始化配置信息
  const useConfigStore = useConfigStoreWhitOut()
  useConfigStore.initConfig()
  // 初始化本地文件
  const { backupPath } = storeToRefs(useConfigStore)
  const localFileStore = useLocalFileStoreWhitOut()
  callNodeAsync({
    modName:'scan',
    functionName: 'getLocalBackupFile',
    data: backupPath.value
  })
    .then((data) => {
      localFileStore.setLocalFile(data)
      console.log('----本地备份文件列表获取完成----', data);
    })
    .catch((e) => {
      console.log('----本地备份文件列表获取失败----', e);
    })
})
