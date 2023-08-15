<template>
  <v-layout>
    <v-footer class="bg-gim-grey">
      <v-row justify="center" no-gutters>
        <v-btn variant="text" to="/p/privacy" class="mx-2">Privacy</v-btn>
        <v-btn variant="text" to="/p/terms" class="mx-2">Terms</v-btn>
        <v-col class="text-center mt-4" cols="12">
          {{ new Date().getFullYear() }} — <strong>Gimid.dev v0.0.1</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-layout>
</template>