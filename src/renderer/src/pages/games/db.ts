import { useObservable, from } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'

import { electronGamesDatabaseInstance } from '@/utils/db/DexieDB'
import { GameDatabase } from '@/interface/database'

export function useGames() {
const gamesTable = new GameDatabase(electronGamesDatabaseInstance, 'gamesTable');

  return {
    addGame: (object: any) => gamesTable.addGame(object),
    updateGame: (updateGameItem: any) => gamesTable.updateGame(updateGameItem),
    delGame: (gameName: string) => gamesTable.delGame(gameName),
    searchGame: (gameDocDir: string) => gamesTable.searchGame(gameDocDir),
    gameList: useObservable(
      from(
        liveQuery(() => {
          return gamesTable.getAll()
        })
      )
    )
  }
}
