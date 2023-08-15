import VueDOMPurifyHTML from 'vue-dompurify-html'

export default defineNuxtPlugin(nuxtApp => {
    
    nuxtApp.vueApp.use(VueDOMPurifyHTML, {
        default: {
            USE_PROFILES: {html: true},
            ADD_TAGS: ["iframe"]
        }
    })
})