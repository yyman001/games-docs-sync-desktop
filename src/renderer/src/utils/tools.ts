import { FileItem } from '@/model'
// https://www.npmjs.com/package/rd
const rd = require('rd')

const crypto = require('crypto')
function md5(input) {
  return crypto.createHash('md5').update(input).digest('hex')
}

/**
 * 扫描路径下的目录列表(文件夹+文件)
 *
 * @param {String} filePath 扫描输入路径
 * @returns {Promise<Array<FileItem>>}
 */
export function getDirectoryItem(filePath: string): Promise<FileItem[]> {
  const fileDetailedList: FileItem[] = []

  return new Promise((resolve) => {
    rd.each(
      filePath,
      function (fileFullPath: string, stats: any, next: Function) {
        const splitArray = fileFullPath.split('\\')
        const [basename] = splitArray.slice(-1)
        const [dirname] = splitArray.slice(-2)
        fileDetailedList.push({
          type: stats.isFile() ? 'file' : 'directory',
          path: fileFullPath,
          dirname,
          basename,
          size: stats.size,
          ctimeStamp: stats.ctimeMs,
          // 修改时间
          timeStamp: stats.mtimeMs
        } as FileItem)

        next()
      },
      function () {
        // 完成
        resolve(fileDetailedList)
      }
    )
  })
}

/**
 * 获取文件夹列表
 *
 * @param list <FileItem>
 * @returns Array<dir>
 */
export function getDirItems(list: FileItem[]) {
  return list.filter((f) => f.type === 'directory')
}

/**
 * 获取文件列表
 *
 * @param list <FileItem>
 * @returns Array<file>
 */
export function getFileItems(list: FileItem[]) {
  return list.filter((f) => f.type === 'file')
}

/**
* 获取本地备份文件列表
* @param dirPath <string> 目录路径
* @returns {
    directoryItem,
    fileItems
  }
*/
export async function getLocalBackupFile(dirPath: string) {
  const fileList: FileItem[] = await getDirectoryItem(dirPath)

  // 文件校验
  if (fileList.length === 0) {
    throw new Error('没有找到任何文件或目录') // 添加校验错误处理
  }

  const directoryItem = getDirItems(fileList)
  // 移除第一个备份目录
  directoryItem.shift()
  const fileItems = getFileItems(fileList).map((f: FileItem) => {
    return {
      ...f,
      // 用于: 比较同步文名标识
      comparsedName: `${f.dirname}/${f.basename}`
    }
  })

  return {
    directoryItem,
    fileItems
  }
}
