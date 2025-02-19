import { useObservable, from } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'

import { electronGamesDatabaseInstance } from '@/utils/db/DexieDB'
import { GameItem } from '@/types'
import { GameDatabase } from '@/interfaces/DexieDB'

export function useGames() {
const gamesTable = new GameDatabase(electronGamesDatabaseInstance, 'gamesTable');

  return {
    addGame: (object: GameItem) => gamesTable.addGame(object),
    updateGame: (updateGameItem: GameItem) => gamesTable.updateGame(updateGameItem),
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
