
import { IpcParameter, dialogParameter } from "@/types/ipc"

// 渲染进程代码示例
// @ts-ignore
const ipcRenderer = window.electron.ipcRenderer

// 发送文件操作请求
export async function callNodeApi(data: any) {
  const rtx = await ipcRenderer.invoke('nodeApi', data)
  return rtx
}

export function callNodesync(data: IpcParameter) {
  const rtx = ipcRenderer.sendSync('ipcSync', data)
  return rtx
}

export async function callNodeAsync(data: IpcParameter) {
  // 判断数据是否可克隆
  const isCloneable = (obj: any): boolean => {
    return obj && (typeof obj === 'object' || Array.isArray(obj)) && !(obj instanceof Date);
  };

  if (!isCloneable(data)) {
    throw new Error("数据不可克隆");
  }
  const clonedData = JSON.parse(JSON.stringify(data));
  const rtx = await ipcRenderer.invoke('ipcAsync', clonedData)
  return rtx
}

// api: https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowopendialogbrowserwindow-options
export const showOpenDialog = async ({ title = '', openFileType = '' } = {} as dialogParameter) => {
  let filters: { name: string; extensions: string[] }[] | undefined
  let properties: string[]

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
  } as IpcParameter)

  if (canceled) return ''
  return filePaths.pop()
}

// 发送同步消息，并等待主进程返回结果
export function getPath(relativePath: string): string {
  const result = ipcRenderer.sendSync('sync', relativePath)
  console.log('Resolved Path:', result)
  return result
}
