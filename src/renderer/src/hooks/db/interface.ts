export abstract class GameDatabase {
  abstract addGame(object: any): Promise<any>
  abstract updateGame(updateGameItem: any): Promise<any>
  abstract delGame(gameName: string): Promise<any>
  abstract searchGame(gameDocDir: string): Promise<any>
}
