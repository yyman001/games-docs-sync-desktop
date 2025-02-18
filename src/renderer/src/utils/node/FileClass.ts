import fs from 'fs-extra'
import path from 'path'
/**
 * 异步函数用于移动文件或目录
 *
 * 此函数将指定的文件或目录从当前位置移动到目标位置
 * 它使用fs模块的move方法来执行移动操作，并可以选择是否覆盖目标位置上已有的文件
 *
 * @param src 源文件或目录的路径这是需要移动的文件或目录
 * @param dest 目标文件或目录的路径这是文件或目录将被移动到的位置
 * @param is_overwrite 是否覆盖的布尔值，默认为true如果目标位置已存在同名文件或目录，且此参数为true，则会被覆盖
 *
 * 注意：本函数不返回任何内容，但它会在移动操作成功时在控制台打印'success!'，如果发生错误，则会打印错误信息
 */
export async function move(src: string, dest: string, is_overwrite: boolean = true) {
  try {
    await fs.move(src, dest, { overwrite: is_overwrite })
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

/**
 * 异步写入文件并读取内容
 *
 * 该函数主要用于将指定的内容写入到一个文件中，然后读取该文件的内容并打印出来
 * 如果文件路径不存在，该函数会尝试创建文件；如果文件已存在，则会覆盖原有内容
 *
 * @param {string} file_path - 目标文件的路径 默认为空字符串
 * @param {string} file_content - 要写入文件的内容 默认为'file_conetent'
 */
export async function outputFile(file_path = '', file_content = 'file_conetent') {
  try {
    // 将内容写入指定文件
    await fs.outputFile(file_path, file_content)

    // 读取文件内容
    const data = await fs.readFile(file_path, 'utf8')

    // 打印文件内容
    console.log(data) // => file_conetent!
  } catch (err) {
    // 出现错误时打印错误信息
    console.error(err)
  }
}

/**
 * 异步读取JSON文件内容
 *
 * 本函数用于异步读取指定路径上的JSON文件，并返回其内容
 * 如果文件读取或解析过程中发生错误，函数会捕获错误并输出到控制台，然后返回null
 *
 * @param filePath 文件路径
 * @returns 返回JSON文件的内容，如果发生错误则返回null
 */
export async function readJson(filePath: string) {
  try {
    // 异步读取并解析指定路径的JSON文件
    const packageObj = await fs.readJson(filePath)

    // 输出读取到的JSON文件内容
    console.log('readJson:', packageObj)

    // 返回JSON文件的内容
    return packageObj
  } catch (err) {
    // 如果发生错误，输出错误信息到控制台
    console.error(err)
  }

  // 如果发生错误，返回null
  return null
}

/**
 * 异步写入并读取JSON文件
 *
 * 该函数尝试将给定的文件路径和文件内容（Buffer形式）写入JSON文件，
 * 然后读取该文件并返回其内容如果写入或读取过程中发生错误，
 * 则返回false
 *
 * @param {object} params 包含文件路径和文件内容的对象
 * @param {string} params.filePath 文件路径
 * @param {Buffer} params.fileBuffer 要写入的文件内容，以Buffer形式
 * @returns {Promise<null|boolean>} 写入并读取的文件内容为null，或在发生错误时返回false
 */
export async function outputJson({
  filePath,
  fileBuffer
}: {
  filePath: string
  fileBuffer: Buffer
}): Promise<null | boolean> {
  try {
    await fs.outputJson(filePath, fileBuffer) // 写入JSON文件

    const data = await fs.readJson(filePath) // 读取JSON文件内容

    return data === null // 返回读取的内容是否为null，用于指示操作是否成功
  } catch (err) {
    console.error(err)
  }
  return false
}

/**
 * 同步读取目录中的文件和子目录
 *
 * 此函数尝试同步地读取指定目录中的所有文件和子目录名，并返回它们。
 * 如果在读取目录时发生错误，错误信息会被打印到控制台。
 *
 * @param dir_path 目录的路径，用于指定要读取的目录
 * @returns 返回一个字符串数组，包含指定目录中的所有文件和子目录名
 */
export function readdirSync(dir_path: string) {
  try {
    return fs.readdirSync(dir_path)
  } catch (error) {
    console.error(error)
  }
}

/**
 * 异步函数用于复制文件或目录
 * @param copy_path 要复制的文件或目录路径
 * @param save_path 复制的目标路径
 * @param filter_funtion 可选的过滤函数，用于决定哪些文件或目录要复制
 * @returns 返回一个数组，第一个元素是错误对象（如果有的话），第二个元素是布尔值，表示复制是否成功
 */
export async function copy(copy_path: string, save_path: string, filter_funtion?: Function) {
  try {
    // 日志：显示复制的源路径和目标路径
    console.log('copy_path:', copy_path)
    console.log('save_path:', save_path)

    // 验证路径参数的有效性
    if (!copy_path || !save_path) {
      throw new Error('Invalid path provided')
    }

    // 使用fs模块的copy方法进行文件或目录的复制，可选地应用过滤函数
    await fs.copy(copy_path, save_path, filter_funtion ? { filter: filter_funtion } : undefined)
    // 日志：确认复制操作成功
    console.log(`copy ${copy_path} is success!`)
    // 返回成功状态
    return [null, true]
  } catch (err) {
    // todo: 处理错误：记录错误信息到控制台，未来将实现记录到日志文件
    console.error(err)
    // 返回错误状态
    return [err, false]
  }
}

/**
 * 复制目录，并过滤掉指定的文件列表
 * @param {string} srcDir - 源目录路径
 * @param {string} destDir - 目标目录路径
 * @param {Array<string>} filterFiles - 需要过滤掉的文件列表（相对路径）
 */
export async function copyWithFilter(srcDir: string, destDir: string, filterFiles: string[]) {
  if (!srcDir || !destDir) {
    throw new Error('Invalid path provided')
  }
  // 确保 filterFiles 中的所有路径是标准化的绝对路径
  const normalizedFilterFiles = filterFiles.map((file) => path.resolve(file))

  // 自定义过滤器函数
  const filter = (src: string) => {
    const normalizedSrc = path.resolve(src)
    try {
      const stats = fs.statSync(normalizedSrc)

      if (stats.isDirectory()) {
        // 判断这个文件夹中是否有需要复制的文件
        const hasFilesToCopy = normalizedFilterFiles.some((file) => {
          return file.startsWith(normalizedSrc + path.sep)
        })

        // 如果该目录下包含需要复制的文件，则返回 true，允许递归复制该目录
        return hasFilesToCopy
      } else if (stats.isFile()) {
        // 如果是文件，检查是否在需要复制的文件列表中
        return normalizedFilterFiles.includes(normalizedSrc)
      }
    } catch (error) {
      console.error(`Error reading path: ${normalizedSrc}`, error)
      return false // 如果读取失败，跳过该文件或文件夹
    }
  }

  try {
    await fs.copy(srcDir, destDir, { filter })
    return [null, true]
  } catch (error) {
    console.log(error)
    return [err, false]
  }
}

/**
 * 确保目标目录存在，如果不存在则创建
 *
 * 该函数用于在文件操作前确保所需的目录已经存在它尝试异步方式确保目录的存在性如果目录不存在，
 * 将尝试创建必要目录结构在创建过程中，任何抛出的错误都将被捕获并在控制台中打印错误信息
 *
 * @param directory 目标目录的路径
 */
export async function ensureDir(directory: string) {
  try {
    // 尝试确保目录存在，如果不存在则创建
    await fs.ensureDir(directory)
  } catch (err) {
    // 捕获并打印创建目录时发生的错误
    console.error(err)
  }
}

/**
 * 异步删除指定路径的文件或目录
 *
 * 该函数尝试删除文件系统中指定的文件或目录如果删除成功，返回true；否则，返回false
 *
 * @param path 要删除的文件或目录的路径
 * @returns 删除操作的结果，成功时返回true，失败返回false
 */
export async function remove(path: string) {
  try {
    await fs.remove(path)
    console.log('success!')
    return true
  } catch (err) {
    console.error(err)
  }

  return false
}

/**
 * 异步检查路径是否存在
 *
 * 此函数使用await关键字等待文件系统操作完成，以检查指定路径是否存在
 * 它委托给fs.pathExists方法，异步地检查路径是否存在
 *
 * @param path 要检查的路径字符串，可以是文件或目录路径
 * @returns 返回一个Promise，解析为布尔值，指示路径是否存在
 */
export async function checkPathExistsAsync(path: string) {
  return await fs.pathExists(path)
}

/**
 * 同步检查文件路径是否存在
 *
 * 此函数用于检查给定的文件路径是否存在于文件系统中它使用fs.pathExistsSync方法，
 * 提供了一个同步的方式 来检查路径是否存在这个函数在需要快速判断路径是否存在，
 * 而又不想使用异步回调的情况下非常有用
 *
 * @param path {string} - 需要检查的文件路径
 * @returns {boolean} - 返回一个布尔值，如果路径存在返回true，否则返回false
 */
export function checkPathExists(path: string) {
  return fs.pathExistsSync(path)
}
