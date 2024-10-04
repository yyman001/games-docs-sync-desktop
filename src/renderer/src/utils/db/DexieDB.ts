// 数据库关系图: https://dbdiagram.io/d/60c7496c0c1ff875fcd4bb3c
import { electronGames } from '@/interface/electronGames'
import Dexie from 'dexie'
export const electronGamesDatabaseInstance = new Dexie('electronGames') as electronGames

electronGamesDatabaseInstance.version(1).stores({
  backupTable: 'fileName, steamId, gameName, nickName, gameDocDir, fileType',
  gamesTable: 'gameDocDir, steamId, gameName, nickName, systemType'
})

electronGamesDatabaseInstance.open().catch(function (err: { stack: any }) {
  console.error(err.stack || err)
})
