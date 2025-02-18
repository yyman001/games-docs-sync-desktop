export interface IpcParameter {
  // 调用模块名
  modName?: string
  // 调用函数名
  functionName: string
  data: any
  shouldSpread?: boolean
}

export interface dialogParameter {
  // 窗口标题
  title?: string
  // 打开文件类型, 空则打开"文件夹"
  openFileType?: string
}