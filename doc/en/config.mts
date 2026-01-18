export default {
  enThemeConfig: {
    nav: [
      { text: 'Home', link: '/en/' },
      { text: 'Examples', link: '/en/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/en/markdown-examples' },
          { text: 'Runtime API Examples', link: '/en/api-examples' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
}
