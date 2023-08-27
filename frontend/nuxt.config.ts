// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // modules:[
  //   'nuxt-delay-hydration',
  // ],
  // delayHydration: {
  //   // enables nuxt-delay-hydration in dev mode for testing
  //   debug: process.env.NODE_ENV === 'development',
  //   mode: 'init'
  // },  
  plugins: [
    {src: '~/plugins/iframe-resize', mode: 'client'}
  ],
  modules:[
    ['@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate']
      }
    ]
  ],
  imports: {
    dirs: ['stores']
  },
  css: ['vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.min.css',
        'prismjs/themes/prism.css',
        'prismjs/themes/prism-tomorrow.css'],        
  build: {
    transpile: ['vuetify',
                'vuedompurifyhtml'],    
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
      'process.env.APPWRITE_ENDPOINT': JSON.stringify(process.env.APPWRITE_ENDPOINT),
      'process.env.APPWRITE_PROJECT':  JSON.stringify(process.env.APPWRITE_PROJECT),
      'process.env.FORUM_DATABASE_ID': JSON.stringify(process.env.FORUM_DATABASE_ID),
      'process.env.PAGE_COLLECTION_ID': JSON.stringify(process.env.PAGE_COLLECTION_ID),
      'process.env.PROFILES_COLLECTION_ID': JSON.stringify(process.env.PROFILES_COLLECTION_ID),
      'process.env.POSTS_COLLECTION_ID': JSON.stringify(process.env.POSTS_COLLECTION_ID),
      'process.env.POST_USERS_COLLECTION_ID': JSON.stringify(process.env.POST_USERS_COLLECTION_ID),
      'process.env.WEBSITE_URL': JSON.stringify(process.env.WEBSITE_URL),
      'process.env.POST_HOMEPAGE_COLLECTION_ID': JSON.stringify(process.env.POST_HOMEPAGE_COLLECTION_ID),
      'process.env.IMAGES_BUCKET_ID': JSON.stringify(process.env.IMAGES_BUCKET_ID),
      'process.env.GET_POST_FUNCTION_ID': JSON.stringify(process.env.GET_POST_FUNCTION_ID),
      'process.env.SERIES_COLLECTION_ID': JSON.stringify(process.env.SERIES_COLLECTION_ID),
      'process.env.GET_SERIES_FUNCTION_ID': JSON.stringify(process.env.GET_SERIES_FUNCTION_ID),
      'process.env.GET_HOME_POST_FUNCTION_ID' : JSON.stringify(process.env.GET_HOME_POST_FUNCTION_ID),
      'process.env.WARGA_ENDPOINT' : JSON.stringify(process.env.WARGA_ENDPOINT),
      'process.env.POST_COMMENTS_COLLECTION_ID' : JSON.stringify(process.env.POST_COMMENTS_COLLECTION_ID)
    },
  },
  devtools: { enabled: true },
  routeRules: {
    '/*': {cors: true},
    '/@*': {ssr: true},
    '/@*/*': {ssr: true},
    '/@*/*/edit': {ssr: false},
    '/new': {ssr: false},
    '/onboard': {ssr: false},
  },

})
