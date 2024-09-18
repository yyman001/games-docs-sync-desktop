const Database = require('better-sqlite3')

// 创建数据库连接
const db = new Database('./pub_games_doc.sqlite')

const docJson = require('./gamesDocTable.json')

// 创建表: 游戏存档表
db.exec(`
  CREATE TABLE IF NOT EXISTS gamesDocTable (
    gameDocDir TEXT NOT NULL,
    gameDocPath TEXT NOT NULL,
    gameName TEXT NOT NULL,
    nickName TEXT,
    pathType TEXT,
    saveGameDataLocationForWindows TEXT,
    steamId TEXT,
    systemType TEXT,
    version INTEGER NULL,  -- 新增的可空字段，用于标记游戏版本号
    UNIQUE (gameDocDir)
  )
`)

// 插入测试数据
const insert = db.prepare(`
  INSERT INTO gamesDocTable (gameDocDir, gameDocPath, gameName, nickName, pathType, saveGameDataLocationForWindows, steamId, systemType, version)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

docJson.forEach((element) => {
  const {
    gameDocDir,
    gameDocPath,
    gameName,
    nickName = '',
    pathType = '',
    saveGameDataLocationForWindows = '',
    steamId = '',
    systemType = '',
    version = ''
  } = element

 insert.run(
    gameDocDir,
    gameDocPath,
    gameName,
    nickName,
    pathType,
    saveGameDataLocationForWindows,
    steamId,
    systemType,
    version
  );
})

/* insert.run(
  "Aeterna Noctis",
  "\\AppData\\LocalLow\\AeternaTheGame\\Aeterna Noctis",
  "Aeterna Noctis",
  "黑暗之王",
  "USERPROFILE",
  "%USERPROFILE%\\AppData\\LocalLow\\AeternaTheGame\\Aeterna Noctis",
  "1517970",
  "Windows_NT",
  ""
); */

// 查询数据
const getGames = db.prepare('SELECT * FROM gamesDocTable')
const games = getGames.all()

console.log(games)

// 关闭数据库连接
db.close()
