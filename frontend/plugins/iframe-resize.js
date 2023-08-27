import iframeResize from 'iframe-resizer/js/iframeResizer'

export default defineNuxtPlugin(nuxtApp => {
  
  nuxtApp.vueApp.directive('resize', {
    bind: function(el, { value = {} }) {
      el.addEventListener('load', () => iframeResize(value, el))
    }
  })
  
})