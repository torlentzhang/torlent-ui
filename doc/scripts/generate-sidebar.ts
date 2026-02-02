import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件的路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 类型定义
interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

interface SidebarConfig {
  scanDirs: string[]
  ignoreFiles: string[]
  rootDir: string
}

// 配置项
const config: SidebarConfig = {
  // 需要扫描的目录
  scanDirs: ['readme', 'components', 'utils'],
  // 忽略的文件
  ignoreFiles: [],
  // 根目录
  rootDir: path.join(__dirname, '..'),
}

/**
 * 读取文件标题，优先从 YAML front matter 中提取 title 字段
 * @param filePath 文件路径
 * @returns 标题文本
 */
function getFileTitle(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const trimmedContent = content.trim()

    // 检查是否有 YAML front matter
    if (trimmedContent.startsWith('---')) {
      // 找到 front matter 的结束
      const endIndex = trimmedContent.indexOf('---', 3)
      if (endIndex !== -1) {
        const frontMatter = trimmedContent.substring(3, endIndex).trim()
        // 提取 title 字段
        const titleMatch = frontMatter.match(/^title:\s*(.+)$/m)
        if (titleMatch && titleMatch[1]) {
          // 移除可能的引号并返回
          return titleMatch[1].replace(/^["']|['"]$/g, '').trim() || '无标题'
        }
      }
    }

    // 如果没有 front matter 或 title 字段，回退到读取第一行
    const firstLine = trimmedContent.split('\n')[0]
    // 移除 # 号和空格
    return firstLine.replace(/^#+\s*/, '').trim() || '无标题'
  } catch (error) {
    console.warn(`读取文件标题失败: ${filePath}`)
    return '无标题'
  }
}

/**
 * 递归扫描目录
 * @param dir 当前目录
 * @param basePath 基础路径
 * @returns 侧边栏配置
 */
function scanDirectory(dir: string, basePath: string = ''): SidebarItem[] {
  const items: SidebarItem[] = []
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // 检查目录下是否有 index.md 文件
      const indexMdPath = path.join(fullPath, 'index.md')
      if (fs.existsSync(indexMdPath)) {
        // 如果有 index.md，直接生成该项，不递归
        const relativePath = path.join(basePath, file, 'index.md').replace(/\\/g, '/')
        const link = `/${relativePath}`
        const title = getFileTitle(indexMdPath)

        items.push({
          text: title,
          link: link,
        })
      } else {
        // 如果没有 index.md，递归扫描子目录
        const subItems = scanDirectory(fullPath, path.join(basePath, file))
        if (subItems.length > 0) {
          items.push({
            text: file, // 使用目录名作为标题
            items: subItems,
          })
        }
      }
    }
  })

  return items
}

/** 生成侧边栏配置 */
function generateSidebar(): SidebarItem[] {
  const sidebar: SidebarItem[] = []

  config.scanDirs.forEach((dir) => {
    const dirPath = path.join(config.rootDir, dir)
    if (fs.existsSync(dirPath)) {
      const items = scanDirectory(dirPath, dir)
      if (items.length > 0) {
        sidebar.push({
          text: dir,
          collapsed: true,
          items: items,
        })
      }
    }
  })

  return sidebar
}

/**
 * 生成侧边栏配置的函数
 * 在 config.mts 中直接使用
 * @returns 侧边栏配置
 */
function getSidebar() {
  return generateSidebar()
}

// 导出函数
export { getSidebar, generateSidebar }
export default getSidebar
