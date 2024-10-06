import { join, parse, normalize } from 'path'
import { cwd } from 'process'
import useSystem from './useSystem'
const APP_HOME_DIR = cwd()
const { HOME_DIR } = useSystem()
export const getAppPath = (...params: string[]) => {
  return join(APP_HOME_DIR, ...params)
}

export const getPath = (params: string[]) => {
  return join.apply(null, params)
}

// 提取路径中的环境变量
export const extractVariables = (path) => {
  const regex = /%([^%]+)%/g
  const matches = []
  let match

  while ((match = regex.exec(path)) !== null) {
    matches.push(match[1]) // 提取 % 里面的内容
  }

  return matches.join()
}

// 新增方法：将带有 % 的路径转换为相对路径
export const convertVariablePathToRelative = (path: string) => {
  const pathExtractVariables = extractVariables(path)
  const isFullPath = /\w+:/.test(path)
  // 处理带 环境变量的路径
  if (pathExtractVariables) {
    const tempPath = path.replace(/%([^%]+)%/g, '')
    console.log('tempPath:', tempPath);

    // TODO: 其他数据类型等遇到错误处理
    switch (pathExtractVariables) {
      case 'LOCALAPPDATA':
        return normalize(join('\\AppData', '\\Local', tempPath))
      case 'APPDATA':
        return normalize(join('\\AppData', '\\Roaming', tempPath))
      case 'DOCUMENTS':
        return normalize(join('\\Documents', tempPath))
      case 'USERPROFILE':
      case 'HOME':
        return normalize(join(tempPath))
      default:
        console.log('convertVariablePathToRelative: unkonw path type')
        return ''
    }
    // 处理绝对路径
  } else if (isFullPath) {
    // 表达式: \w+:\\users\\\w+?\\ 替换 C:\Users\???\
    // 移除绝对路径的用户路径段
    const _tempPath = path.replace(/\w+:\\users\\\w+?\\/gi, '\\')
    return normalize(_tempPath)
  }

  return ''
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
  const normalizedPath = convertVariablePathToRelative(path) || normalize(path)
  const userProfilePath = normalize(homeDir)
  console.log('normalizedPath', normalizedPath)
  console.log('userProfilePath', userProfilePath)

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

  return result
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
    case 'HOME':
      return HOME_DIR
    // 对于未知的路径类型，返回'UNKNOWN'
    default:
      return 'UNKNOWN'
  }
}

export const getGameDocType = (fullPath: string) => {
  return parsePath(fullPath, HOME_DIR)
}

export const applyGetGameDocPath = (params: any) => {
  return getGameDocPath.apply(null, params)
}

export const getParsePathObject = (path: string) => {
  console.log('=======getParsePathObject:', path)

  return parse(path)
}
