import { BackupItem, GameDocItem, GameItem } from '@/model'
import Dexie from 'dexie'
export class electronGames extends Dexie {
  backupTable!: Dexie.Table<BackupItem>
  gamesTable!: Dexie.Table<GameItem>

  constructor () {
    super('electronGames')
    this.version(1).stores({
      backupTable: 'fileName, steamId, gameName, nickName, gameDocDir, fileType',
      gamesTable: 'gameDocDir, steamId, gameName, nickName, systemType'
    })
  }
}
