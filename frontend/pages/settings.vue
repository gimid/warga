<template>

  <div class="page">
    <Header></Header>

    

    <v-container class="page-width">
      <v-row>
        <v-col cols="3" class="d-none d-sm-block">
        </v-col>
        <v-col cols="6">
          <h1>Settings</h1>

          <v-text-field label="nama kamu" v-model="realname"></v-text-field>
          <v-text-field label="username" v-model="handlename" @input="checkUsernameExist" ></v-text-field>

          <v-alert v-if="usernameValidMessage" :text="usernameValidMessage" color="success"></v-alert>
          <v-alert v-if="usernameErrorMessage" :text="usernameErrorMessage" color="error"></v-alert>
          
          <!-- <v-btn v-if="!usernameValidMessage" @click="checkUsernameExist">Check username exist</v-btn> -->

          <v-btn @click="setupUsername">Update profile</v-btn>
        </v-col>
        <v-col cols="3" class="d-none d-sm-block">
        </v-col>
      </v-row>
    </v-container>

    

    <Footer></Footer>
  </div>
</template>
<script setup>
import {useRouter } from 'vue-router'
import AuthService from '~/service/AuthService';
import ProfilesService from '~/service/ProfilesService';

definePageMeta({
  middleware: ["loggedin"]
})

const router = useRouter();
const realname = ref("");
const handlename = ref("");
const usernameErrorMessage = ref("");
const usernameValidMessage = ref("");
const profilesService = new ProfilesService();
const authService = new AuthService();

onMounted(async () => {

  let userSession = await authService.getUserSession();
  
  if (userSession) {
    var profile = await profilesService.getProfileFromUserID(userSession.$id);
    
    realname.value = profile.contact_name;
    handlename.value = profile.handle; 
  }

});

async function checkUsernameExist() {

  let userSession = await authService.getUserSession();

  if (!handlename.value){
    showInvalidInfo("Username tidak valid")
    return;
  }

  let profile = await profilesService.getProfileFromHandle(handlename.value);

  if(profile === undefined || profile.$id == userSession.$id){
    showValidInfo("Username valid!");
  }else{
    showInvalidInfo("Username tidak valid")
  }
  
}

const showValidInfo = (msg) => {
    usernameErrorMessage.value = ""
    usernameValidMessage.value = msg;
}

const showInvalidInfo = (msg) => {
  usernameValidMessage.value = ""
  usernameErrorMessage.value = "Nama tidak valid"
}

const setupUsername = async (msg) => {

  await checkUsernameExist();

  if(usernameErrorMessage.value === "") {
    usernameValidMessage.value = ""
    var profile = await profilesService.updateProfile(realname.value, handlename.value);

  }
}

</script>