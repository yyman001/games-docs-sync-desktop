import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import { join } from 'path'
import { cwd } from 'process'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as scan from '../renderer/src/utils/tools'
import * as file from '../renderer/src/utils/node/FileClass'
import { localGamesDocDatabase } from '../renderer/src/utils/node/sqlite'
import * as tree from '../renderer/src/utils/node/scanFileTree'
import * as path from '../renderer/src/utils/node/path'
import * as backup from '../renderer/src/utils/node/backup'
import * as compressing from '../renderer/src/utils/node/compressing'

const APP_HOME_DIR = cwd()
const modules = {
  dialog,
  shell,
  file,
  scan,
  localGamesDocDatabase,
  tree,
  path,
  backup,
  compressing
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    autoHideMenuBar: false, // 菜单条
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-load')
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.autoHideMenuBar = false
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  // 异步
  ipcMain.handle('ipcAsync', async (_event, argument: any) => {
    try {
      const { modName, functionName, shouldSpread = false, data } = argument as IpcParameter
      console.log('ipcAsync:', modName, functionName, data)
      console.log('data type:', typeof data)

      // 动态调用指定模块的函数
      if (modName && functionName && modules[modName]) {
        const module = modules[modName]
        if (typeof module[functionName] === 'function' && data) {

          if (shouldSpread) {
            return await module[functionName].apply(null, data as string[])
          }

          return await module[functionName](data)
        }
      }

      return null
    } catch (error) {
      console.log('ipcAsync error:', error)
    }
  })

  // 同步
  ipcMain.on('ipcSync', (event, argument: any) => {
    const { modName, functionName, data } = argument as IpcParameter
    console.log('ipcSync:', modName, functionName, data)
    console.log('data type:', typeof data)

    // 动态调用指定模块的函数
    if (modName && functionName && modules[modName]) {
      const module = modules[modName]
      if (typeof module[functionName] === 'function' && data) {
        const result = module[functionName](data) // 调用指定函数
        event.returnValue = result
        console.log('ipcSync:result:', result)
      }
    }

    event.returnValue = null
  })

  ipcMain.on('sync', (event, params: any) => {
    // 检查 params 是否是数组
    if (!Array.isArray(params)) {
      params = [params] // 如果不是数组，将其转换为数组
    }
    event.returnValue = join(APP_HOME_DIR, ...params) // 通过 returnValue 返回给渲染进程
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
