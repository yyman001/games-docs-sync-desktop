export interface FileItem {
  basename: string
  dirname: string
  fileType: string
  path: string
  size: number
  // 创建时间
  ctimeStamp?: string | number
  // 修改时间
  timeStamp: string | number
  type: 'directory' | 'file'
  comparsedName: string
}

export interface LocalFile {
  // 文件名
  // : "Aragami_t1641735966693.zip"
  basename: string
  // 文件夹名称
  // Aragami
  dirname: string
  // 文件绝对路径
  // "C:\\my_git_project\\game-document-sync\\backup\\Aragami\\Aragami_t1641735966693.zip",
  path: string
  // 文件大小(字节)
  size: number
  // 时间戳
  timeStamp: number
  // 文件类型
  type: 'file' | 'directory'
}

export interface LocalFileFormat extends LocalFile {
  // 用于比较同步文名标识: = 本地文件名: 格式规范 = (文件夹/文件名) = Aragami/Aragami_t1641735966693.zip
  comparsedName: string
}