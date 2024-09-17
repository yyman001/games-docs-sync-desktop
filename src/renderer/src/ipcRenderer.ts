import { useLocalFileStoreWhitOut } from '@/store/localFile'
import { useConfigStoreWhitOut } from '@/store/config'

window.electron.ipcRenderer.on('main-process-load', (event) => {
  console.log('应用启动完成!')

  // 初始化配置信息
  const useConfigStore = useConfigStoreWhitOut()
  useConfigStore.initConfig()
})
