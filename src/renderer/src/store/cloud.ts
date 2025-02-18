import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { SdkConfig } from '@/model'
import { showOpenDialog, callNodeAsync } from '@/utils/ipc'
import { camelCase } from 'change-case'
import { deepCopy } from '@/utils/deepCopy'

export const useCloudStore = defineStore('cloud', () => {
  const loading = ref(false)
  const cloudConfigList = ref([]) // 云账号配置信息列表
  const cloudType = ref('jianguoyun')
  const cloudTypeList = ref([
    { label: '坚果云', value: 'jianguoyun' },
    { label: '阿里云', value: 'ali-oss' }
  ])

  const initialCloudConfig = {
    jianguoyun: {
      name: '坚果云',
      type: 'jianguoyun',
      url: '',
      usearname: '',
      password: '',
      rootDirectoryName: 'games_doc_sync'
    },
    aliOss: {
      name: '阿里云',
      type: 'ali-oss',
      accessKeyId: '',
      accessKeySecret: '',
      bucket: ''
    }
  }

  const cloudAccountConfig = reactive<{ [key: string]: SdkConfig }>(initialCloudConfig)

  const resetCloudConfig = () => {
    Object.assign(cloudAccountConfig, initialCloudConfig)
  }

  const updateCloudConfig = (cloudType: string, newConfig: Partial<SdkConfig>) => {
    const key = camelCase(cloudType)
    Object.assign(cloudAccountConfig[key], newConfig)
  }

  const targetCloudAccount = computed(() => {
    return cloudAccountConfig[camelCase(cloudType.value)] || {}
  })

  const setCloudType = (type) => {
    cloudType.value = type
  }

  const setConfigList = (cloudList) => {
    cloudConfigList.value = cloudList
  }

  const loadConfig = async (path: string) => {
    try {
      // todo: 判断配置文件是否存在
      const fileJson: Array<any> = await callNodeAsync({
        modName: 'file',
        functionName: 'readJson',
        data: path
      })

      if (Array.isArray(fileJson)) {
        fileJson.forEach((item) => {
          updateCloudConfig(item.type, item)
        })

        message.success('加载配置成功!')
        return true
      }
    } catch (error) {
      console.log('error:', error)
      message.error('加载配置失败!')
      return false
    }
  }

  const handleSetConfig = async (configFilePath: Ref<string>) => {
    const configPath = await showOpenDialog({
      title: '选择配置文件',
      openFileType: 'config'
    })
    debugger
    if (!configPath || !configPath.endsWith('.json')) {
      message.error('请选择一个有效的JSON配置文件。')
      return
    }

    const isSuccess = await loadConfig(configPath)
    if (isSuccess) {
      const cloudConfigList = Object.values(cloudAccountConfig)
      hanldeSaveConfig(unref(cloudConfigList), unref(configFilePath))
    }
  }

  const hanldeSaveConfig = async (cloudList: SdkConfig[], outPath: string) => {
    if (unref(loading)) return
    loading.value = true
    try {
      console.log('outPath:', outPath, JSON.stringify(cloudList))
      await callNodeAsync({
        modName: 'file',
        functionName: 'outputJson',
        data: deepCopy({ filePath: outPath, fileBuffer: cloudList })
      })

      message.success('保存配置成功!')
    } catch (error) {
      message.error('保存配置失败!')
    }

    loading.value = false
  }

  const onSwitchCloud = (type: string) => {
    cloudType.value = type
  }

  const handleSave = (outPath: string) => {
    console.log('handleSave')
    const cloudConfigList = Object.values(cloudAccountConfig)
    hanldeSaveConfig(unref(cloudConfigList), outPath)
  }

  return {
    cloudAccountConfig,
    cloudConfigList,

    cloudType,
    cloudTypeList,
    targetCloudAccount,
    setCloudType,
    setConfigList,

    loadConfig,
    handleSetConfig,
    resetCloudConfig,
    onSwitchCloud,
    hanldeSaveConfig,
    handleSave
  }
})

export const useCloudStoreWhitOut = () => {
  return useCloudStore()
}
