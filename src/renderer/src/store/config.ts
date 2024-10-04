import { defineStore } from 'pinia'
import { ref, unref, watch } from 'vue'
import { useCloudStoreWhitOut } from '@/store/cloud'
// getPath 是以当前应用目录为基础
import { getPath, callNodesync } from '@/utils/ipc'

enum LOCAL_CONFIG {
  DEFAULT_BACK_PATH = 'backup',
  DEFAULT_TEMP_PATH = 'temp',
  CUSTOM_TEMP_PATH = '_custom_temp_path',
  CUSTOM_BACK_PATH = '_custom_back_path',
  CUSTOM_DB_INPUT_PATH = '_custom_db_input_path',
  CUSTOM_DB_OUT_PATH = '_custom_db_out_path'
}

const setLocalStorageItem = (key: LOCAL_CONFIG, value: string) => {
  localStorage.setItem(key, value)
}

const getLocalStorageItem = (key: LOCAL_CONFIG) => {
  return localStorage.getItem(key)
}

export const useConfigStore = defineStore('config', () => {
  const { loadConfig } = useCloudStoreWhitOut()

  /* 文件恢复,备份 操作时的临时目录 */
  const tempPath = ref('')
  const setTempPath = (path: string) => {
    tempPath.value = path
    setLocalStorageItem(LOCAL_CONFIG.CUSTOM_TEMP_PATH, path)
  }
  const setDefaultTempPath = () => {
    setTempPath(getPath(LOCAL_CONFIG.DEFAULT_TEMP_PATH))
  }
  const getTempPath = (...param: any) => {
    return callNodesync({
      modName: 'path',
      functionName: 'getPath',
      data: [unref(tempPath), ...param]
    })
  }

  /* 文件备份目录 */
  const backupPath = ref('')
  const setBackPath = (path: string) => {
    console.log('setBackPath', path)

    backupPath.value = path
    setLocalStorageItem(LOCAL_CONFIG.DEFAULT_BACK_PATH, path)
  }
  // 改名为恢复默认路径
  const setDefaultBackPath = () => {
    const path = getPath(LOCAL_CONFIG.DEFAULT_BACK_PATH)
    console.log('path', path)

    setBackPath(path)
  }
  const getBackupPath = (...param: any) => {
    return getPath(unref(backupPath), ...param)
  }

  /* 配置文件 */
  const configFileName = 'cloud.config.json'
  const configFilePath = ref('')
  const setConfigFilePath = (path: string) => {
    configFilePath.value = path
  }
  const setDefalutConfigPath = () => {
    const path = getPath(configFileName)
    setConfigFilePath(path)
  }

  /* 数据导入导出 */
  const databseInputPath = ref('')
  const databaseExportPath = ref('')

  const setDatabseInputPath = (path: string) => {
    databseInputPath.value = path
    setLocalStorageItem(LOCAL_CONFIG.CUSTOM_DB_INPUT_PATH, path)
  }
  const setDatabaseExportPath = (path: string) => {
    databaseExportPath.value = path
    setLocalStorageItem(LOCAL_CONFIG.CUSTOM_DB_OUT_PATH, path)
  }

  const recoverDefalutDatabaseInputPath = () => {
    setDatabseInputPath(getAppPath('backupDatabase.json'))
  }

  const recoverDefalutDatabaseExportPath = () => {
    setDatabaseExportPath(getAppPath())
  }

  /* 初始化配置方法 */
  const initConfig = () => {
    const customBackPath = getLocalStorageItem(LOCAL_CONFIG.CUSTOM_BACK_PATH)
    const customTempPath = getLocalStorageItem(LOCAL_CONFIG.CUSTOM_TEMP_PATH)

    customTempPath ? setTempPath(customTempPath) : setDefaultTempPath()
    customBackPath ? setBackPath(customBackPath) : setDefaultBackPath()

    setDefalutConfigPath()
  }

  watch(
    () => unref(configFilePath),
    (value) => {
      console.log('*****watch:configFilePath******', value)
      loadConfig(unref(configFilePath))
    }
  )

  return {
    initConfig,

    tempPath,
    setTempPath,
    getTempPath,
    setDefaultTempPath,

    backupPath,
    setBackPath,
    getBackupPath,
    setDefaultBackPath,

    configFilePath,
    setConfigFilePath,
    setDefalutConfigPath,

    databseInputPath,
    databaseExportPath,
    setDatabseInputPath,
    setDatabaseExportPath,
    recoverDefalutDatabaseInputPath,
    recoverDefalutDatabaseExportPath
  }
})

export const useConfigStoreWhitOut = () => {
  return useConfigStore()
}
