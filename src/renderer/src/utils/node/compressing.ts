/*
 * https://github.com/node-modules/compressing
 * */
const compressing = require('compressing')
// import * as compressing from 'compressing'

export type ResultCompressDirSuccess = [
  null,
  {
    entryPath: string
    outPath: string
    type: string // 'tar', 'zip'
  }
]
export type ResultCompressDirError = [any, null]

/**
 * 压缩文件
 *
 * @param entryPath - 输入压缩文件路径
 * @param outPath - 输出文件路径
 * @param type - 压缩文件类型
 * @returns {Promise.<Array<string|null, null| object>>}
 */
export async function compressDir(
  entryPath: string,
  outPath: string = 'untitled',
  type: string = 'tar'
): Promise<ResultCompressDirSuccess | ResultCompressDirError> {
  if (typeof entryPath !== 'string') {
    console.warn("must input 'entryPath' & type is string!")
    return ["must input 'entryPath' & type is string!", null]
  }

  try {
    if (type === 'tar') {
      await compressing.tar.compressDir(entryPath, `${outPath}.tar`)
      await compressing.gzip.compressFile(`${outPath}.tar`, `${outPath}.tgz`)
    } else if (type === 'zip') {
      await compressing.zip.compressDir(entryPath, `${outPath}.zip`)
    }

    return [
      null,
      {
        entryPath,
        outPath,
        type
      }
    ]
  } catch (err: any) {
    return [err, null]
  }
}

/**
 * 解压文件
 *
 * @param entryPath - 待解压输入文件路径
 * @param unCompressFilePath - 解压输出文件路径
 * @returns {Promise.<boolean>}
 */
export async function unCompress(entryPath: string, unCompressFilePath: string): Promise<boolean> {
  try {
    if (entryPath.indexOf('.tar') > -1) {
      await compressing.tar.uncompress(entryPath, unCompressFilePath)
    } else if (entryPath.indexOf('.tgz') > -1) {
      await compressing.gzip.uncompress(`${entryPath}.tgz`, `${unCompressFilePath}.tar`)
      await compressing.tar.uncompress(`${unCompressFilePath}.tar`, `${unCompressFilePath}`)
    } else if (entryPath.indexOf('.zip') > -1) {
      await compressing.zip.uncompress(entryPath, unCompressFilePath)
    }

    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export default {
  compressDir,
  unCompress
}
