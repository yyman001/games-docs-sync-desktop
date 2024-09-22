import { join } from 'path'
import { cwd } from 'process'
const APP_HOME_DIR = cwd()
export const getAppPath = (...params: any) => {
  return join(APP_HOME_DIR, ...params)
}
