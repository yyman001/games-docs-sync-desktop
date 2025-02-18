import { ElectronAPI } from '@electron-toolkit/preload'

interface IpcRenderer {
  invoke(channel: string, data?: any): Promise<any>
  send(channel: string, data?: any): void
  sendSync(channel: string, data?: any): any
}

declare global {
  interface Window {
    electron: ElectronAPI & { // 确保 ElectronAPI 正确导入
      ipcRenderer: IpcRenderer;
    };
    api: unknown
  }
}

export {}
