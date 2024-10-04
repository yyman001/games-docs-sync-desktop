import { ref, unref } from 'vue'
import { message } from 'ant-design-vue'
import { backupFile, BackupFileData } from '@/utils/node/backup'
import { useConfigStoreWhitOut } from '@/store/config'
import { callNodeAsync } from '@/utils/ipc'

export interface IBackupParams {
  docPath: string; // 文档路径(绝对路径)
  backPath: string; // 备份路径(绝对路径)
  gameDocDir: string; // 游戏文件夹名
  saveFiles: string[]; // 选择备份文件列表
}

export function useBackupFile() {
  const { HOME_DIR, SYSTEM_TYPE } = window?.systemInfo
  const { success: messageSuccess, error: messageError } = message
  const useConfigStore = useConfigStoreWhitOut()

  const remask = ref('')
  const loading = ref(false)
  const progress = ref(0)
  const onStartBackup = async ({ docPath, backPath, gameDocDir, saveFiles }: IBackupParams) => {
    const tempPath = useConfigStore.getTempPath(gameDocDir)
    console.log('tempPath', tempPath);
    if (!saveFiles.length) return messageError('请勾选要备份的文件!')

    loading.value = true
    // const gameData = await getGamesDocInfo(gameDocDir)
    // if (!gameData) return messageError('未查找游戏数据!')

    const [errorText, backupData] = await callNodeAsync({
      modName: 'backup',
      functionName: 'backupFile',
      data: {
        docPath,
        tempPath,
        backPath,
        gameDocDir,
        saveFiles
      }
    })
    if (errorText || !backupData) {
      messageError(errorText as string)
      return
    }

    // TODO: 只保留 备注, 其他在读取本地列表和云列表的时候重新更新
    // TODO: 重新设计文件详细信息到备份列表到谷歌数据库
    /* const backupWriteResult = await addBackup({
      steamId: gameData.steamId,
      gameName: gameData.gameName,
      gameDocDir,
      gameDocPath: gameData.gameDocPath,
      fileName: backupData.fileName,
      filePath: `${backupData.savePath}.${backupData.platform}`,
      platformTye: SYSTEM_TYPE,
      fileType: backupData.platform,
      timeStamp: backupData.timeStamp,
      remask: unref(remask)
    }) */

    /* if (backupWriteResult === null) {
      messageError('添加备份历史记录失败!')
      return
    } */

    loading.value = false
    messageSuccess('备份成功!')
  }

  return {
    onStartBackup,
    remask,
    loading
  }
}
