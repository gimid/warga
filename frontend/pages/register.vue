<template>

  <div class="page">
    <Header></Header>

    {{ news }}

    <h1>Sign up</h1>

    <h1>Social</h1>

    <v-btn @click="signInWithGoogle">Google</v-btn>

    <Footer></Footer>
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
  }

  const signIn = async () => {
    var callSignIn = await authService.signIn(userEmail.value, userPassword.value);
    router.push("/dashboard")

  }

  const signInWithGoogle = async () => {
    authService.loginGoogle();
  }

</script>../service/PageService