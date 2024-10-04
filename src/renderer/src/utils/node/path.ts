import { join, normalize } from 'path'
import { cwd } from 'process'
import useSystem from './useSystem'
const APP_HOME_DIR = cwd()
const { HOME_DIR } = useSystem()
export const getAppPath = (...params: any) => {
  return join(APP_HOME_DIR, ...params)
}

export const getPath = (params: any) => {
  return join.apply(null, params)
}

/**
 * 解析给定的文件路径，并将其归类到预定义的路径类型中
 * @param path 要解析的文件路径
 * @param homeDir 用户的主目录路径，用于识别用户特定的路径
 * @returns 返回识别的路径类型键值
 *
 * 此函数首先标准化输入的路径，然后通过比较路径中是否包含预定义的关键子目录
 * 来确定路径的类型每个预定义的路径类型包含一个父目录名和一个关联的键值，以及
 * 可能包含的子目录如果路径中包含某个父目录名，则该路径被归类为对应的类型如果
 * 还包含子目录名，则进一步细化分类如果路径与用户的主目录相匹配，则直接归类为
 * 用户配置文件类型
 */
export const parsePath = (path: string, homeDir: string) => {
  if (!path) {
    throw new Error('Path is empty')
  }
  // 标准化路径分隔符
  const normalizedPath = path.replace(/\//g, '\\') // 将 / 替换为 \
  const userProfilePath = homeDir.replace(/\//g, '\\')
  const pathTypeX = [
    {
      parent: 'AppData',
      children: [
        { name: 'Roaming', key: 'APP_DATA' },
        { name: 'LocalLow', key: 'LOCAL_LOW' },
        { name: 'Local', key: 'LOCAL_APP_DATA' }
      ]
    },
    {
      parent: 'Documents',
      key: 'DOCUMENTS',
      children: [{ name: 'My Games', key: 'DOCUMENTS_MY_GAMES' }]
    },
    { parent: 'Public', children: [{ name: 'Documents', key: 'PUBLIC_DOCUMENTS' }], key: 'PUBLIC' },
    {
      parent: 'UserProfile',
      children: [{ name: 'Saved Games', key: 'USER_PROFILE_SAVED_GAMES' }],
      key: 'USER_PROFILE'
    },
    { parent: 'Epic Games', children: null, key: 'EPIC_GAMES' },
    { parent: 'GOG', children: null, key: 'GOG' },
    { parent: 'Origin', children: null, key: 'ORIGIN' },
    { parent: 'Ubisoft', children: null, key: 'UBISOFT' }
  ]
  let result = 'UNKNOWN' // 默认未知类型

  for (const type of pathTypeX) {
    if (normalizedPath.indexOf(type.parent) !== -1) {
      result = type.key

      if (type.children === null) {
        break
      }

      for (const child of type.children) {
        if (normalizedPath.indexOf(child.name) !== -1) {
          // 检查切割后的路径部分
          result = child.key // 记录小类
          break // 找到小类后退出循环
        }
      }
    }
  }

  // 处理 USER_PROFILE 的情况
  if (normalizedPath === userProfilePath) {
    result = 'USER_PROFILE'
  }

  return result // 返回结果
}

/**
 * 获取游戏文档的路径
 *
 * 此函数用于根据给定的路径获取游戏文档的路径它首先解析输入路径的类型，
 * 然后根据解析的类型返回相应的路径如果类型是用户配置文件，则返回用户配置文件路径；
 * 如果是其他预定义的目录类型，则返回从用户主目录下相应的位置拼接的路径；
 * 对于未知类型，返回'UNKNOWN'
 *
 * @param path {string} - 输入的路径字符串
 * @returns {string} - 返回解析后的游戏文档路径或者'UNKNOWN'对于未知类型
 */
export const getGameDocPath = (path: string) => {
  // 解析输入路径的类型
  const type = parsePath(path, HOME_DIR)

  // 根据解析的路径类型，返回相应的游戏文档路径
  switch (type) {
    // 对于以下预定义的目录类型，从用户主目录下相应的位置拼接并返回路径
    case 'APP_DATA':
    case 'LOCAL_LOW':
    case 'LOCAL_APP_DATA':
    case 'DOCUMENTS':
    case 'DOCUMENTS_MY_GAMES':
    case 'USER_PROFILE_SAVED_GAMES':
      return join(HOME_DIR, path)
    // 如果解析的类型是用户配置文件，返回用户配置文件路径
    case 'USER_PROFILE':
      return HOME_DIR
    // 对于未知的路径类型，返回'UNKNOWN'
    default:
      return 'UNKNOWN'
  }
}

export const applyGetGameDocPath = (params: any) => {
  return getGameDocPath.apply(null, params)
}
