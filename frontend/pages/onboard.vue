<template>
  <div>
    Selamat datang di gimid!
    Masukkan username kamu
  
    <v-text-field label="nama kamu" v-model="realname"></v-text-field>
    <v-text-field label="username" v-model="handlename"></v-text-field>
  
    <v-alert v-if="usernameValidMessage" :text="usernameValidMessage" color="success"></v-alert>
    <v-alert v-if="usernameErrorMessage" :text="usernameErrorMessage" color="error"></v-alert>
    <v-btn v-if="!usernameValidMessage" @click="checkUsernameExist">Check username exist</v-btn>
    <v-btn v-if="usernameValidMessage" @click="setupUsername">Set username</v-btn>
  </div>
</template>
<script setup>
import {useRouter } from 'vue-router'
import ProfilesService from '~/service/ProfilesService';

definePageMeta({
  middleware: ["userprofileushered"]
})

const router = useRouter();
const realname = ref("");
const handlename = ref("");
const usernameErrorMessage = ref("");
const usernameValidMessage = ref("");
const profileService = new ProfilesService();

async function checkUsernameExist() {


  if (!handlename.value){
    showInvalidInfo("Username tidak valid")
    return;
  }

  let profile = await profileService.getProfileFromHandle(handlename.value);

  if(profile === undefined){
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
  var profile = await profileService.createProfile(realname.value, handlename.value);
  
  router.push("/dashboard")

}

</script>