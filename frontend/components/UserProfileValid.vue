<template>


  <div>
    <v-dialog
      model-value="true"
      width="auto"
      persistent
      v-if="isUserNotValid"
    >
      <v-card>
        <v-card-text>
          <v-container style="width:400px" class="text-center">
            <v-row>
              <v-col class="text-bold">
                Selamat datang di Gimid.dev!<br/>
                Masukkan username yang kamu inginkan
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field label="nama kamu" prepend-inner-icon="mdi-account" v-model="realname"></v-text-field>
                <v-text-field label="username" prepend-inner-icon="mdi-at" v-model="handlename" @update:model-value="checkUsernameExist"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-alert v-if="usernameValidMessage" :text="usernameValidMessage" color="success" variant="outlined" prominent></v-alert>
                <v-alert v-if="usernameErrorMessage" :text="usernameErrorMessage" color="error"  variant="outlined" prominent></v-alert>
                <!-- <v-btn v-if="!usernameValidMessage" @click="checkUsernameExist">Check username exist</v-btn> -->

                <hr/>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn v-if="usernameValidMessage && !isCheckingUsername" @click="setupUsername" color="black" block>✌️ Let's Go!</v-btn>

                <v-progress-circular
                  v-if="isCheckingUsername"
                  :width="3"
                  color="var(--gim-teal)"
                  indeterminate
                ></v-progress-circular>
              </v-col>
            </v-row>
            
          </v-container>
          
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>


  <div>
    
  </div>
</template>
<script setup>
import {useRouter } from 'vue-router'
import ProfilesService from '~/service/ProfilesService';
import AuthService from '~/service/AuthService';

// definePageMeta({
//   middleware: ["userprofileushered"]
// })

const router = useRouter();
const realname = ref("");
const handlename = ref("");
const usernameErrorMessage = ref("");
const usernameValidMessage = ref("");
const profileService = new ProfilesService();
const isUserNotValid = ref(false);

const isCheckingUsername = ref(false);

const authService = new AuthService();

onMounted(async ()=>{

  try {
    var userSession = await authService.getUserSession();
    if(userSession){

      let userProfile = null;
      try{
        let profilesService = new ProfilesService();
        userProfile = await profilesService.getProfileFromUserID(userSession.$id);
      }catch(e) {
        console.log("user doesn't have profile yet")
      }

      if(userProfile == null){
        isUserNotValid.value = true;
      }
    }
  }catch(e){
    console.log(e);
  }

})

async function checkUsernameExist() {

  isCheckingUsername.value = true;

  const delay = ms => new Promise(res => setTimeout(res, ms));

  await delay(500);
  
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

  isCheckingUsername.value = false;
  
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
  
  console.log(profile);
  router.go();
  window.location = "/dashboard";
  // router.push("/dashboard")

}

</script>