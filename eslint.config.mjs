import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default defineConfig([
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // 用 TS 官方推荐规则
      ...tseslint.configs.recommended.rules,
    },
  },
  eslintConfigPrettier,
  globalIgnores([
    // 依赖目录
    'node_modules/',
    '.pnpm-store/',
    // 构建输出
    'dist/',
    'dist-ssr/',
    'build/',
    'target/',
    // 日志和临时文件
    'logs/',
    '*.log',
    '*.tmp',
    '.cache/',
    // 环境变量
    '.env*',
    '!.env.example',
    // 编辑器配置
    '.vscode/',
    '.idea/',
    '.DS_Store',
    // 测试覆盖率
    'coverage/',
    // 其他配置目录
    '.config/',
  ]),
])
