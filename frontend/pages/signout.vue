<template>

  <div class="page">
    <Header></Header>

    <v-container class="page-width text-center">
      <v-row>
        <v-col cols="3" class="d-none d-sm-block">
        </v-col>
        <v-col cols="6">
          Beneran mau cabut?<br/>
          <v-btn @click="signOut">Iya</v-btn>
        </v-col>
        <v-col cols="3" class="d-none d-sm-block">
        </v-col>
      </v-row>
    </v-container>

    

    <Footer></Footer>
  </div>

</template>
<script setup>
import AuthService from '~/service/AuthService';

let authService = new AuthService();

const signOut = async () => {
  await authService.signOut();
  navigateTo("/enter")
}

</script>