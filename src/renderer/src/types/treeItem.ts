// 本地node扫描文件对象结构
export interface TreeItem {
  // '引燃的大坑.wld'
  basename: string
  children: TreeItem[] | null
  depth: number
  dirname: string | null
  // '.bak'
  ext: string
  // '引燃的大坑.wld.bak'
  filename: string
  isLeaf: boolean
  // 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria\\Worlds\\引燃的大坑.wld.bak'
  key: string
  // 'Worlds'
  parent_dir: string
  // 'C:\\Users\\yyman001_cp\\Documents\\My Games\\Terraria\\Worlds\\引燃的大坑.wld.bak'
  path: string
  // '\\Worlds'
  relative_parent_path: string
  // '\\Worlds\\引燃的大坑.wld.bak'
  relative_path: string
  // 2990329
  size: number
  timeStamp: number
  // '引燃的大坑.wld'
  title: string
  type: 'file' | 'directory'
}
