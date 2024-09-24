// 数据库抽象类
export abstract class DexieDatabase {
  abstract addGame(object: any): Promise<any>
  abstract updateGame(updateGameItem: any): Promise<any>
  abstract delGame(gameName: string): Promise<any>
  abstract searchGame(gameDocDir: string): Promise<any>
  abstract getAll(): Promise<any[]>
}

export class GameDatabase extends DexieDatabase {
  private table: any

  constructor(database: any, tableName: string) {
    super()
    this.table = database[tableName]
  }

  async addGame(object: any) {
    return await this.table.add(object)
  }

  async updateGame(updateGameItem: any) {
    return await this.table.update(updateGameItem.gameDocDir, updateGameItem)
  }

  async delGame(gameName: string) {
    return await this.table.delete(gameName)
  }

  async searchGame(gameDocDir: string) {
    return await this.table.get(gameDocDir)
  }
  async getAll() {
    return await this.table.toArray()
  }
}
