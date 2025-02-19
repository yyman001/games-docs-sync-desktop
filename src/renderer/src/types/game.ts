export interface GameItem {
  gameAppPath: string | null
  createTime: number
  gameDocDir: string
  gameDocPath: string
  gameName: string
  gamePlatform: string | any[] | null
  lastRestoreTime?: number
  lastBackTime?: number
  lastRunTime?: number
  playtime?: number
  nickName: string
  steamId: string | null
  systemType: string
  pathType?: string
  createdAt?: string
}

export interface GameDocItem {
  pathType?: string
  steamId?: string
  gameDocDir: string
  gameDocPath: string
  gameName: string
  nickName: string
  systemType: string
}

export interface BackupItem {
  fileName: string
  filePath: string
  fileType: string
  gameDocDir: string
  gameDocPath: string
  gameName: string
  platformTye: string
  timeStamp: number
  remask?: string
  steamId?: string
}