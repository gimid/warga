// Prism
import Prism from 'prismjs';

import "../assets/iconfont.js"

import { MdEditor } from 'md-editor-v3';


// highlight code
import 'prismjs/components/prism-json';

export default defineNuxtPlugin(nuxtApp => {
  
  nuxtApp.vueApp.use(MdEditor)
})