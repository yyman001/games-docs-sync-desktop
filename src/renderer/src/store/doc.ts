import { defineStore } from 'pinia'
import { ref, unref, watch } from 'vue'
import useModal from '@/hooks/useModal'
import { callNodesync } from '@/utils/ipc'

export const useDocForm = defineStore('doc-form', () => {
  const { isVisible, onModalOpen, onModalClose } = useModal()

  const steamId = ref('')
  const gameName = ref('')
  const nickName = ref('')
  const gameDocDir = ref('')
  const gameDocPath = ref('') // 存档相对路径(部分)
  const gameDocFullPath = ref('') // 存档绝对路径
  const tempParseGameDocPath = ref('') // 用于分析的路径
  const pathType = ref('')

  const isUpdate = ref(false)
  const setUpdateStatus = (status: boolean = false) => {
    isUpdate.value = status
  }

  /*
  路径类型: 未处理,详细内容表
  | APPDATA            | "C:\\Users\\yyman001_cp\\AppData\\Roaming" |
  | DOCUMENTS          | "\\Documents"                              |
  | DOCUMENTS_MY_GAMES | "\\Documents\\My Games"                    |
  | HOME               | "C:\\Users\\yyman001_cp"                   |
  | LOCALAPPDATA       | "C:\\Users\\yyman001_cp\\AppData\\Local"   |
  | PUBLIC             | "C:\\Users\\Public"                        |
  | USERNAME           | "yyman001_cp"                              |
  | USERPROFILE        | "C:\\Users\\yyman001_cp"                   |
  */

  const onSetDocForm = (gameItem: any) => {
    steamId.value = gameItem.steamId
    gameName.value = gameItem.gameName
    nickName.value = gameItem.nickName
    gameDocDir.value = gameItem.gameDocDir
    gameDocPath.value = gameItem.gameDocPath
    pathType.value = callNodesync({
      modName: 'path',
      functionName: 'getGameDocType',
      data: gameDocPath.value
    })
  }

  const onInitDocForm = () => {
    steamId.value = ''
    gameName.value = ''
    nickName.value = ''
    gameDocDir.value = ''
    gameDocPath.value = ''
    gameDocFullPath.value = ''
    tempParseGameDocPath.value = ''
    pathType.value = ''
  }

  const onCloseDocModal = () => {
    onInitDocForm()
    onModalClose()
  }

  const parsePath = (path: string) => {
    return callNodesync({
      modName: 'path',
      functionName: 'getParsePathObject',
      data: path
    })
  }

  watch(
    () => unref(tempParseGameDocPath),
    (value) => {
      if (!value) return

      let pathObject = null
      // 移除前后空格
      let tempPath = value.replace(/^\s+|\s+$/g, '')
      const regex = /%([^%]+)%/ // => %USERPROFILE%, %APPDATA%, %LOCALAPPDATA%
      const relativePath = callNodesync({
        modName: 'path',
        functionName: 'convertVariablePathToRelative',
        data: tempPath
      })

      console.log('relativePath', relativePath);

      pathType.value = callNodesync({
        modName: 'path',
        functionName: 'getGameDocType',
        data: relativePath
      })

      gameDocFullPath.value = callNodesync({
        modName: 'path',
        functionName: 'getGameDocPath',
        data: relativePath
      })

      pathObject = parsePath(relativePath)
      gameDocPath.value = relativePath
      gameDocDir.value = pathObject?.name || ''
      gameName.value = pathObject?.name?.replace(/_/gi, ' ')
    }
  )

  return {
    isUpdate,
    setUpdateStatus,
    isVisible,
    onModalOpen,
    onModalClose,
    onCloseDocModal,

    pathType,
    steamId,
    gameName,
    nickName,
    gameDocDir,
    gameDocPath,
    gameDocFullPath,
    tempParseGameDocPath,

    onInitDocForm,
    onSetDocForm
  }
})

export const useDocFormStoreWhitOut = () => {
  return useDocForm()
}
