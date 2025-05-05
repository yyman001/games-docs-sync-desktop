// @ts-ignore
import Database from 'better-sqlite3'
import { getAppPath } from './path'

const sqlFilePath = getAppPath('pub_games_doc.sqlite')
const GAMES_DOC_TABLE = 'gamesDocTable'

interface PaginationOptions {
  page: number
  pageSize: number
  orderBy?: string
  orderDirection?: string
}

interface FilteredPaginationOptions {
  filter: {
    field: string
    value: string
  }
  page: number
  pageSize: number
  orderBy?: string
  orderDirection?: 'ASC' | 'DESC'
}

class GamesDocDatabase {
  private db: Database.Database

  constructor() {
    this.db = new Database(sqlFilePath)
    this.initDatabase()
  }

  private createGamesDocTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ${GAMES_DOC_TABLE} (
        gameDocDir TEXT NOT NULL,
        gameDocPath TEXT NOT NULL,
        gameName TEXT NOT NULL,
        nickName TEXT,
        pathType TEXT,
        saveGameDataLocationForWindows TEXT,
        steamId TEXT,
        systemType TEXT,
        version INTEGER NULL,
        UNIQUE (gameDocDir)
      )
    `)
  }

  private insertData(element: any) {
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

    const insert = this.db.prepare(`
      INSERT INTO ${GAMES_DOC_TABLE} (gameDocDir, gameDocPath, gameName, nickName, pathType, saveGameDataLocationForWindows, steamId, systemType, version)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

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
    )
  }

  public insert(data: any[]) {
    const errorLog = [] as string[]
    data.forEach((element) => {
      try {
        this.insertData(element)
      } catch (e: any) {
        console.error(e)
        errorLog.push(`${element}: ${e.message}`)
      }
    })
    return errorLog
  }

  private updateData(element: any) {
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

    const update = this.db.prepare(`
      UPDATE ${GAMES_DOC_TABLE}
      SET gameDocPath = ?, gameName = ?, nickName = ?, pathType = ?, saveGameDataLocationForWindows = ?, steamId = ?, systemType = ?, version = ?
      WHERE gameDocDir = ?
    `)

    update.run(
      gameDocPath,
      gameName,
      nickName,
      pathType,
      saveGameDataLocationForWindows,
      steamId,
      systemType,
      version,
      gameDocDir
    )
  }

  public update(data: any[]) {
    const errorLog = [] as string[]
    data.forEach((element) => {
      try {
        this.updateData(element)
      } catch (e) {
        console.error(e)
        errorLog.push(`${element}: ${e}`)
      }
    })
    return errorLog
  }

  private initDatabase() {
    const result = this.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?;")
      .get(GAMES_DOC_TABLE)
    if (!result) {
      console.log(`table ~${GAMES_DOC_TABLE}~ cannot be found, creating...`)
      this.createGamesDocTable()
    } else {
      console.log('sqlite database is ready')
    }
  }

  private getTotalCount() {
    const totalCountQuery = this.db.prepare(`SELECT COUNT(*) as count FROM ${GAMES_DOC_TABLE}`)
    const totalCountResult = totalCountQuery.get()
    return totalCountResult.count // 返回总数据长度
  }

  public getPage({ page = 1, pageSize = 10, orderBy = 'gameName', orderDirection = 'ASC' } : PaginationOptions) {
    const validOrderBys = ['gameName', 'gameDocDir', 'steamId'] // 允许的排序字段
    const validOrderDirections = ['ASC', 'DESC'] // 允许的排序方向

    // 验证 orderBy 和 orderDirection
    if (!validOrderBys.includes(orderBy)) {
      orderBy = 'gameName' // 默认值
    }
    if (!validOrderDirections.includes(orderDirection)) {
      orderDirection = 'ASC' // 默认值
    }

    const offset = (page - 1) * pageSize
    const query = this.db.prepare(`
      SELECT * FROM ${GAMES_DOC_TABLE}
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT ? OFFSET ?
    `)

    return query.all(pageSize, offset)
  }

  public getPagePagination(data: PaginationOptions) {
    const totalCount = this.getTotalCount()
    const currentPageData = this.getPage(data)

    return {
      totalCount,
      currentPageData
    }
  }

  public getFilteredPaginatedData({
    filter,
    page = 1,
    pageSize = 10,
    orderBy = 'gameName',
    orderDirection = 'ASC'
  }: FilteredPaginationOptions) {
    const validOrderBys = ['gameName', 'gameDocDir', 'steamId', 'nickName']
    if (!validOrderBys.includes(orderBy)) {
      orderBy = 'gameName'
    }

    const offset = (page - 1) * pageSize
    let whereClauses = '1=1'
    let searchParams: string[] = []

    // 只有当filter有值且value不为空时才进行搜索
    if (filter?.field && filter?.value) {
      if (filter.field === 'gameName') {
        whereClauses = 'gameName LIKE ? OR nickName LIKE ?'
        searchParams = [`%${filter.value}%`, `%${filter.value}%`]
      } else if (filter.field === 'steamId') {
        whereClauses = 'steamId LIKE ?'
        searchParams = [`%${filter.value}%`]
      }
    }

    const countQuery = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM ${GAMES_DOC_TABLE}
      WHERE ${whereClauses}
    `)
    const totalCount = countQuery.get(...searchParams).count

    const query = this.db.prepare(`
      SELECT * FROM ${GAMES_DOC_TABLE}
      WHERE ${whereClauses}
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT ? OFFSET ?
    `)

    const currentPageData = query.all(...searchParams, pageSize, offset)

    return {
      totalCount,
      currentPageData
    }
  }

  public queryGameInfo(gameDocDir: string) {
    const query = this.db.prepare(`
      SELECT * FROM ${GAMES_DOC_TABLE}
      WHERE gameDocDir = ?
      LIMIT 1
    `)

    return query.get(gameDocDir) // 返回匹配的第一条记录
  }

  public queryHasGameDoc(gameName?: string, steamId?: string) {
    if (!gameName && !steamId) {
      throw new Error('至少需要输入一个条件: gameName 或 steamId')
    }

    const conditions: string[] = []
    const params: string[] = []

    if (gameName) {
      conditions.push('gameName LIKE ?')
      params.push(`%${gameName}%`)
    }
    if (steamId) {
      conditions.push('steamId = ?')
      params.push(steamId)
    }

    const query = this.db.prepare(`
      SELECT * FROM ${GAMES_DOC_TABLE}
      WHERE ${conditions.join(' OR ')}
    `)

    return query.all(...params)
  }
}

// 使用示例
export const localGamesDocDatabase = new GamesDocDatabase()
