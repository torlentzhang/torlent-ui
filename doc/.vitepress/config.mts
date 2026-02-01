import { defineConfig } from 'vitepress'
import enThemeConfig from '../en/config.mjs'

export default defineConfig({
  title: 'torlent-ui', // 网站标题
  titleTemplate: 'torlent', // 自定义标题后缀，不设置则默认使用title
  description: 'A VitePress Site', // 描述,没啥用，用于网站SEO
  head: [
    ['link', { rel: 'icon', href: '/vite.svg' }], // head配置项可以配置网站图标或者字体
  ],
  lang: 'zh-CN', // 语言，默认是en-US
  base: '/', // 部署到站点时需要配置base，否则会404，注意始终以/开头结尾
  cleanUrls: true, // 开启cleanUrls，会在url中去掉.html后缀
  rewrites: {
    'zh/:rest*': ':rest*',
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      themeConfig: enThemeConfig.enThemeConfig,
    },
  },
  themeConfig: {
    i18nRouting: true, // 开启i18n路由，会在url中添加语言前缀，例如/en-US/
    nav: [
      { text: '首页', link: '/' },
      { text: '示例', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/markdown-examples' },
          { text: '运行时 API 示例', link: '/api-examples' },
        ],
      },
      {
        text: '基础组件',
        items: [{ text: 'Button 按钮', link: '/components/base/tl-button/index.md' }],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
})
