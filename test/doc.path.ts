/*
### window 环境变量路径类型

| 名称               | 路径                                       |
| ------------------ | ------------------------------------------ |
| LOCAL_APP_DATA       | "C:\\Users\\yyman001_cp\\AppData\\Local"   |
| APP_DATA            | "C:\\Users\\yyman001_cp\\AppData\\Roaming" |
| LOCAL_LOW           | "C:\\Users\\yyman001_cp\\AppData\\LocalLow" |
| HOME               | "C:\\Users\\yyman001_cp"                   |
| PUBLIC             | "C:\\Users\\Public"                        | #这个路径下一般没有存档, 不排除奇葩游戏
| PUBLIC_Documents   | "C:\\Users\\Public\Documents"              |
| USER_PROFILE        | "C:\\Users\\yyman001_cp"                   |
| USER_PROFILE_SAVED_GAMES        | C:\Users\yyman001\Saved Games             |
| DOCUMENTS          | "\\Documents"                              |
| DOCUMENTS_MY_GAMES | "\\Documents\\My Games"                    |
| USERNAME           | "yyman001_cp"                              |
*/

import {join} from 'path'

export const getPathType = (fullPath: string) => {
  const isFullPath = /\w+:/.test(fullPath)
  console.log('isFullPath:', isFullPath)
}

export const parsePath = (path: string, homeDir: string) => {
  if (!path){
    throw new Error("Path is empty")
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
    { parent: 'UserProfile', children: [{name: 'Saved Games', key:'USER_PROFILE_SAVED_GAMES'}], key: 'USER_PROFILE' },
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

export const getGameDocPath = (path: string, homeDir: string) {
  const type = parsePath(path, homeDir)
  switch (type) {
    case 'APP_DATA':
    case 'LOCAL_LOW':
    case 'LOCAL_APP_DATA':
    case 'DOCUMENTS':
    case 'DOCUMENTS_MY_GAMES':
    case 'USER_PROFILE_SAVED_GAMES':
      return join(homeDir, path)
    case 'USER_PROFILE':
      return homeDir
    default:
      return 'UNKNOWN'
  }
}

// 测试用例
const testParsePath = () => {
  const homeDir = 'C:\\Users\\yyman001'
  const testCases = [
    { input: `${homeDir}\\AppData\\Roaming\\GameName`, expected: 'APP_DATA' },
    { input: `${homeDir}\\AppData\\Local\\GameName`, expected: 'LOCAL_APP_DATA' },
    { input: `${homeDir}\\AppData\\LocalLow\\GameName`, expected: 'LOCAL_LOW' },
    { input: `${homeDir}\\Documents\\My Games\\GameName`, expected: 'DOCUMENTS_MY_GAMES' },
    { input: `${homeDir}\\Documents\\GameName`, expected: 'DOCUMENTS' },
    { input: `C:\\Users\\Public\\Documents\\GameName`, expected: 'PUBLIC_DOCUMENTS' }, // C:\Users\Public\Documents
    { input: homeDir, expected: 'USER_PROFILE' },
    { input: `${homeDir}\\\Saved Games`, expected: 'USER_PROFILE_SAVED_GAMES' },
    { input: 'C:\\UnknownPath', expected: 'UNKNOWN' },
    { input: '%USERPROFILE%\\Documents\\30XX\\' , expected: 'DOCUMENTS' }
  ]

  testCases.forEach(({ input, expected }) => {
    const result = parsePath(input, homeDir)
    console.log(`Input: ${input}, Expected: ${expected}, Result: ${result}`)
    console.assert(result === expected, `Test failed for input: ${input}`)
  })
}

testParsePath()
