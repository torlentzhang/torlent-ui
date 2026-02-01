const fs = require("fs");
const path = require("path");

// 配置项
const config = {
  // 需要扫描的目录
  scanDirs: ["readme", "components", "utils"],
  // 忽略的文件
  ignoreFiles: [],
  // 根目录
  rootDir: path.join(__dirname, ".."),
};

/**
 * 读取文件第一行作为标题
 * @param {string} filePath 文件路径
 * @returns {string} 标题文本
 */
function getFileTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const firstLine = content.trim().split("\n")[0];
    // 移除 # 号和空格
    return firstLine.replace(/^#+\s*/, "").trim() || "无标题";
  } catch (error) {
    console.warn(`读取文件标题失败: ${filePath}`);
    return "无标题";
  }
}

/**
 * 递归扫描目录
 * @param {string} dir 当前目录
 * @param {string} basePath 基础路径
 * @returns {Array} 侧边栏配置
 */
function scanDirectory(dir, basePath = "") {
  const items = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 检查目录下是否有 index.md 文件
      const indexMdPath = path.join(fullPath, "index.md");
      if (fs.existsSync(indexMdPath)) {
        // 如果有 index.md，直接生成该项，不递归
        const relativePath = path
          .join(basePath, file, "index.md")
          .replace(/\\/g, "/");
        const link = `/${relativePath}`;
        const title = getFileTitle(indexMdPath);

        items.push({
          text: title,
          link: link,
        });
      } else {
        // 如果没有 index.md，递归扫描子目录
        const subItems = scanDirectory(fullPath, path.join(basePath, file));
        if (subItems.length > 0) {
          items.push({
            text: file, // 使用目录名作为标题
            items: subItems,
          });
        }
      }
    }
  });

  return items;
}

/** 生成侧边栏配置 */
function generateSidebar() {
  const sidebar = [];

  config.scanDirs.forEach((dir) => {
    const dirPath = path.join(config.rootDir, dir);
    if (fs.existsSync(dirPath)) {
      const items = scanDirectory(dirPath, dir);
      if (items.length > 0) {
        sidebar.push({
          text: dir,
          collapsed: true,
          items: items,
        });
      }
    }
  });

  return sidebar;
}

// 生成并输出配置
const sidebarConfig = generateSidebar();

// 生成配置文件
const outputDir = path.join(config.rootDir, ".vitepress");
const outputFile = path.join(outputDir, "auto-sidebar.ts");

// 确保 .vitepress 目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 生成配置内容
const configContent = `// 自动生成的侧边栏配置
// 生成时间: ${new Date().toLocaleString()}

export const autoSidebar = ${JSON.stringify(sidebarConfig, null, 2)};
`;

// 写入文件
try {
  fs.writeFileSync(outputFile, configContent);
  console.log(`✅ 配置文件生成成功:`);
  console.log(`   ${outputFile}`);
  console.log(`\n=== 使用方法 ===`);
  console.log(`1. 在 .vitepress/config.mts 中导入配置:`);
  console.log(`   import { autoSidebar } from "./auto-sidebar"`);
  console.log(`2. 在 themeConfig 中使用:`);
  console.log(`   sidebar: autoSidebar`);
  console.log(`3. 重启开发服务器查看效果`);
  console.log(`================`);
} catch (error) {
  console.error("❌ 生成配置文件失败:", error.message);
}

// 导出配置（如果需要在其他地方使用）
if (require.main !== module) {
  module.exports = generateSidebar;
}
