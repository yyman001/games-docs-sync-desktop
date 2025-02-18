import { formatFileSize } from '../formatFileSize'

/* 创建多选用的树结构 */
const rd = require('rd')
const path = require('path')

export interface TreeItem {
  // '引燃的大坑.wld'
  basename: string
  children: TreeItem[] | null
  depth: number
  dirname: string | null
  // '.bak'
  ext: string
  // '引燃的大坑.wld.bak'
  filename: string
  isLeaf: boolean
  // 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria\\Worlds\\引燃的大坑.wld.bak'
  key: string
  // 'Worlds'
  parent_dir: string
  // 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria\\Worlds\\引燃的大坑.wld.bak'
  path: string
  // '\\Worlds'
  relative_parent_path: string
  // '\\Worlds\\引燃的大坑.wld.bak'
  relative_path: string
  // 2990329
  size: number
  timeStamp: number
  // '引燃的大坑.wld'
  title: string
  type: 'file' | 'directory'
}

function getParentDir(dir: string): string | null {
  const parts = dir.split('\\')
  if (parts.length <= 1) {
    return null
  }

  return parts.pop() || ''
}

/**
 * 根据文件路径获取树节点
 * 该函数通过遍历指定的文件路径，生成一个树形结构的节点数组每个节点包含文件或目录的详细信息
 *
 * @param filePath - 需要遍历的文件路径
 * @param rootDir - 根目录路径，用于计算相对路径
 * @returns 返回一个Promise对象，解析为TreeItem类型的数组
 */
export function getTreeNode(filePath: string, rootDir: string): Promise<TreeItem[]> {
  // 存储文件详细列表的数组
  const fileDetailedList: TreeItem[] = []
  return new Promise((resolve) => {
    // 使用rd.each遍历文件路径
    rd.each(
      filePath,
      function (fileFullPath: string, stats: any, next: any) {
        try {
          // 解析文件路径信息
          const parsedPath = path.parse(fileFullPath)
          // 计算相对于根目录的父路径
          const relativeParentPath = path.relative(rootDir, parsedPath.dir)
          // 计算相对于根目录的路径
          const relativePath = path.relative(rootDir, fileFullPath)
          // 计算深度，以gamedir为根目录
          const depth = relativePath.split('\\').length - 1
          // 获取父目录名称
          const parentDir = getParentDir(parsedPath.dir) || null
          // 判断是否为文件
          const isFile = stats.isFile()

          // 构造路径对象，包含文件/目录的详细信息
          const pathObjct = {
            depth,
            children: isFile ? null : [],
            isLeaf: isFile,
            key: fileFullPath,
            path: fileFullPath,
            title: isFile ? `${parsedPath.name} - ${formatFileSize(stats.size)}` : parsedPath.name,
            relative_path: relativePath,
            relative_parent_path: relativeParentPath,
            parent_dir: parentDir,
            type: isFile ? 'file' : 'directory',
            dirname: parsedPath.dirname || null,
            basename: parsedPath.name,
            filename: isFile ? parsedPath.name + parsedPath.ext : null,
            size: stats.size,
            timeStamp: stats.ctimeMs,
            ext: parsedPath.ext
          } as TreeItem

          // 将路径对象添加到文件详细列表中
          fileDetailedList.push(pathObjct)
          // 调用next继续遍历
          next()
        } catch (error) {
          // 捕获异常并拒绝Promise
          reject(error)
        }
      },
      function (err: Error | null) {
        // 遍历完成后，检查是否有错误
        if (err) {
          reject(err)
        } else {
          // 如果没有错误，解析Promise为文件详细列表
          resolve(fileDetailedList)
        }
      }
    )
  })
}

export async function createNodeTree({
  filePath,
  gameDocDir
}: {
  filePath: string
  gameDocDir: string
}) {
  // const filePath = 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria'
  const rootDir = filePath.replace(gameDocDir, '')
  const fileDetailedList: TreeItem[] = await getTreeNode(filePath, rootDir)
  const filesPath = fileDetailedList.map(({ path }) => path)
  const allDir = fileDetailedList.filter((f) => f.type === 'directory')

  // 关联子父元素
  allDir.forEach((dirItem) => {
    const children = fileDetailedList.filter(
      (f) => f.relative_parent_path === dirItem.relative_path
    )
    dirItem.children = children
  })

  const tree = allDir.find((f) => f.depth === 0) as TreeItem
  return { tree, filesPath, fileDetailedList }
}
