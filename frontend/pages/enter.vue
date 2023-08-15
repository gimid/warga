<template>

  <div class="page">
    <Header></Header>

    <!-- {{ news }} -->

    <v-container fill-height fluid >
      <v-row>
        <v-col
        offset="4"
        cols="4"
          class="text-center"
          >
          Selamat datang di Gimid.dev!
          <hr/>
          komunitas keilmuan teknikal dan praktis dari dan bagi Game Developer Indonesia
        </v-col>
      </v-row>
      <v-row justify="center">
          <v-col
          class="d-flex justify-center align-center"
          >
            <v-btn @click="signInWithGoogle" prepend-icon="mdi-google" color="black">Masuk dengan akun Google</v-btn>            
          </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { ref } from 'vue';
  import AuthService from '../service/AuthService'
  import PageService from '../service/PageService'

  const route = useRoute();
  const router = useRouter();
  const authService = new AuthService();
  const userState = ref("");
  const userEmail = ref("");
  const userPassword = ref("");
  const news = ref("");
  var pageService = new PageService();

  definePageMeta({
    middleware: ["ushered"]
  })

  onMounted(async ()=>{
    let state = route.query.state;
    userState.value = state;

    news.value = await pageService.getNews();

  });

  const signUp = async () => {
    var callSignUp = await authService.signUp(userEmail.value, userPassword.value)
    console.log(callSignUp);
  }

  const signIn = async () => {
    var callSignIn = await authService.signIn(userEmail.value, userPassword.value);
    console.log(callSignIn);
    router.push("/dashboard")

  }

  const signInWithGoogle = async () => {
    authService.loginGoogle();
  }

</script>

<style>
</style>