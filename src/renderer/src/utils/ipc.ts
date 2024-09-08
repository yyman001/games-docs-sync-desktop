export interface IpcParameter {
  // 调用模块名
  modName?: string
  // 调用函数名
  functionName: string
  data: any
}

export interface dialogParameter {
  // 窗口标题
  title?: string
  // 打开文件类型, 空则打开"文件夹"
  openFileType?: string
}

// 渲染进程代码示例
const ipcRenderer = window.electron.ipcRenderer
// 发送文件操作请求
export async function callNodeApi(data: any) {
  const rtx = await ipcRenderer.invoke('nodeApi', data)
  return rtx
}

// api: https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options
export const showOpenDialog = async ({ title = '', openFileType = '' } = {} as dialogParameter) => {
  let filters
  let properties
  if (openFileType === 'rar') {
    filters = [{ name: '压缩存档', extensions: ['zip', 'tar', 'tgz'] }]
    properties = ['openFile']
  } else if (openFileType === 'config') {
    filters = [{ name: '配置文件', extensions: ['json'] }]
    properties = ['openFile']
  } else if (openFileType === 'exe') {
    filters = [{ name: '应用程序', extensions: ['exe'] }]
    properties = ['openFile']
  } else {
    properties = ['openDirectory']
  }

  const { canceled, filePaths } = await ipcRenderer.invoke('ipcAsync', {
    modName: 'dialog',
    functionName: 'showOpenDialog',
    data: { title, properties, filters }
  })
  if (canceled) return ''
  return filePaths.pop()
}

// 发送同步消息，并等待主进程返回结果
export function getPath(relativePath) {
  const result = ipcRenderer.sendSync('sync', relativePath)
  console.log('Resolved Path:', result)
  return result
}
