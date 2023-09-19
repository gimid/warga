import { createVuetify } from "vuetify";
// import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { 
  VBtn, 
  VRow, 
  VCol, 
  VProgressCircular,
  VChip,
  VCard,
  VIcon,
  VSpacer,
  VLayout,
  VFooter,
  VAppBar,
  VContainer,
  VMenu,
  VList,
  VListItem,
  VSheet,
  VListItemTitle,
  VOverlay,
  VTextField,
  VAlert,
  VTextarea,
  VCardText,
  VDialog,
  VBottomNavigation,
  VCombobox,
  VMain,
  VApp
 } from "vuetify/components";

import { VSkeletonLoader } from "vuetify/labs/components";


// import * as components from 'vuetify/components'


export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components: {
      VBtn,
      VRow,
      VCol,
      VProgressCircular,
      VChip,
      VCard,
      VIcon,
      VSpacer,
      VLayout,
      VFooter,
      VAppBar,
      VContainer,
      VMenu,
      VList,
      VSkeletonLoader,
      VListItem,
      VSheet,
      VListItemTitle,
      VOverlay,
      VTextField,
      VAlert,
      VTextarea,
      VCardText,
      VDialog,
      VBottomNavigation,
      VCombobox,
      VMain,
      VApp
    },
    directives
  })

  nuxtApp.vueApp.use(vuetify)
})