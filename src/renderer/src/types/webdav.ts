import { BufferLike, GetFileContentsOptions } from 'webdav'

export interface WebDavFile {
  // "Terraria_t1646059713386.zip"
  basename: string
  // "Terraria/Terraria_t1646059713386.zip"
  comparsedName: string
  // "pv25HsbR5U2ntsjUNbL6gQ"
  etag: string
  // "/games_doc_sync/Terraria/Terraria_t1646059713386.zip"
  filename: string
  // "Mon, 28 Feb 2022 14:51:29 GMT"
  lastmod: string
  // "application/zip"
  mime: string
  //  5283447
  size: number
  type: 'file'
}

export interface WebDavDirectory {
  basename: string
  etag: string
  filename: string
  lastmod: string
  size: number
  type: 'directory'
}

export interface SdkConfig {
  type: string
  url: string
  usearname: string
  password: string
  rootDirectoryName?: string
  accessKeyId?: string
  accessKeySecret?: string
  bucket?: string
}

/* 上传下载sdk接口规范 */
export interface SDK {
  [x: string]: any
  // 创建
  getClient(): void
  // 销毁
  destroy(): void
  // 上传
  uploadFile(
    filePath: Buffer | string,
    gameDocDir: string,
    fileName: string,
    isOverwrite?: boolean,
    cb?: Function,
    progressFn?: Function
  ): Promise<boolean>
  // 下载
  downloadFile(coludFilename: string, writeFilePath: string, cb: Function): Promise<boolean>
}

export interface IWebDav extends SDK {
  getDirectoryContents(filename: string): Array<any>
  getFileContents(filename: string, options?: GetFileContentsOptions):Promise<BufferLike>
  getDirectoryStructure(): { directoryItems: any[]; fileItems: any[] }
  ensureDir(path: string): boolean
}