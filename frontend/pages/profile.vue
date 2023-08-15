<script setup>

import { useRoute } from 'vue-router'
import { ref } from 'vue';
import AuthService from '~/service/AuthService';
import ProfilesService from '~/service/ProfilesService'

definePageMeta({
  middleware: ["loggedin"]
})

const route = useRoute();
const userFetched = ref(false);
const profileExist = ref(true);
const profileData = ref();
const authService = new AuthService();
const profilesService = new ProfilesService();

onMounted(async ()=>{
  const handle = route.params.username;

  try{
    let userProfile = await profilesService.getProfileFromHandle(handle)
    if(userProfile !== null) {
      profileData.value = userProfile;
      profileExist.value = true;
      userFetched.value = true;
    }else{
      userFetched.value = false;
      profileExist.value = false;
    }
  }catch(e){
    userFetched.value = true;
    profileExist.value = false;
  }
  


});



</script>

<template>

<div>

  <UserProfileValid></UserProfileValid>
  <Header></Header>

  <h1>Profile</h1>

  <div v-if="userFetched">
    <div v-if="!profileExist">
      This page does not exist
    </div>
  
    <div v-else>
      Hello this is profile for {{ profileData.contact_name }}
    </div>
  </div>

  <div v-else>
    Loading...
  </div>

  <Footer></Footer>

</div>




</template>