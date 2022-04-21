console.log('env===>', process.env.NODE_ENV);
const port = process.env.PORT || 3000

module.exports = {
  // 關閉 Are you interested in participating?
  telemetry: false,
  srcDir: 'src/client/',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Team-Bu',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/_main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios',
    '~/plugins/utils',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // ['@nuxtjs/eslint-module', { ignoreDuringBuilds: true }],
    ['@nuxtjs/dotenv', { path: './', filename: `.env.${process.env.NODE_ENV}` }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/gtm',
    'cookie-universal-nuxt',
  ],

  gtm: {
    id: 'GTM-TMZK8TX'
  },

  bootstrapVue: {
    icons: true
  },
  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.

  // },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: `/`,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
}
