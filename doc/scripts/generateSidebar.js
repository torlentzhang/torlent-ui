const fs = require('fs')
const path = require('path')

const DOC_ROOT = path.resolve(__dirname, '../zh')

function getTitleFromMd(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/^#\s+(.*)/m)
  return match ? match[1].trim() : path.basename(filePath, '.md')
}

function walk(dir, baseLink) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  let indexFile = null
  const items = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    // 处理 index.md（作为目录入口）
    if (entry.isFile() && entry.name === 'index.md') {
      indexFile = fullPath
      continue
    }

    if (entry.isDirectory()) {
      const children = walk(fullPath, `${baseLink}/${entry.name}`)
      if (children) items.push(children)
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      const title = getTitleFromMd(fullPath)
      items.push({
        text: title,
        link: `${baseLink}/${entry.name.replace(/\.md$/, '')}`,
      })
    }
  }

  // 如果有 index.md，把当前目录包装成一个分组
  if (indexFile) {
    return {
      text: getTitleFromMd(indexFile),
      link: baseLink,
      items,
    }
  }

  // 没有 index.md，返回 items（给上层用）
  return items.length
    ? {
        text: path.basename(dir),
        items,
      }
    : null
}

const result = walk(DOC_ROOT, '/zh')

const sidebar = {
  '/zh/': Array.isArray(result) ? result : [result],
}

const output = `
export const sidebar = ${JSON.stringify(sidebar, null, 2)}
`

fs.writeFileSync(path.resolve(__dirname, '../.vitepress/sidebar.auto.ts'), output.trim())

console.log('✅ sidebar.auto.ts generated')
