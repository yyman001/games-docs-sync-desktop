import { TreeItem } from "./treeItem"

export interface Modal {
  isVisible?: boolean
  onModalOpen: Function
  onModalClose: Function
}

export interface BackModal extends Modal {
  loading?: boolean
  selectedKeys: string[]
  treeData: TreeItem[]
  nodeSize: number
  docPath: string
  backPath: string
  GAME_DOC_DIR: string // 游戏目录名
  GAME_DOC_PATH: string // 游戏存档路径
  GAME_FILES_BACKUP_PATH: string // 备份文件路径
}

export interface RestoreModal extends Modal {
  loading?: boolean
  selectedKeys: string[]
  treeData: TreeItem[]
  docPath: string
  filePath: string
  setDocPath: Function
  setFilePath: Function
  onCreateNode: Function
  isSubmit: boolean
  onSbumit: Function
}
