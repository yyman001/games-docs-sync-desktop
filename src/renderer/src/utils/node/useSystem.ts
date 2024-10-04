import os from 'os'

export default function () {
  const USER_INFO = os.userInfo()
  const HOME_DIR = os.homedir()
  const SYSTEM_TYPE = os.type()
  const SYSTEM_TYPE_OPTIONS = {
    Windows_NT: 'Windows',
    Darwin: 'Mac',
    Linux: 'Linux'
  }

  return {
    HOME_DIR,
    USER_INFO,
    SYSTEM_TYPE,
    SYSTEM_TYPE_OPTIONS
  }
}
