<template>
  <v-layout>
    <v-app-bar :elevation="2" color="black">
      <v-container class="page-width">
        <v-row>
          <v-col>
            <img src="../assets/gimid2.png" width="150" @click="goHome">
          </v-col>

          <v-spacer></v-spacer>
          <v-col cols="3" class="text-right">

            <v-btn v-if="userSession" to="/new"
              prepend-icon="mdi-plus" variant="outlined" style="color: var(--gim-teal);"
              class="d-none d-md-inline-flex" width="100">
              <template v-slot:prepend>
                <v-icon></v-icon>
              </template>
              NULIS
            </v-btn>

            
            

            <div class="d-none d-md-inline-block">
              <v-btn v-if="!userSession && fetched" to="/enter" prepend-icon="mdi-account" variant="outlined" v-cloak>
                Log in
              </v-btn>
            </div>

            <v-menu transition="slide-x-reverse-transition">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-menu"
                  style="color: var(--gim-teal);"
                >
                </v-btn>
              </template>
              <v-list class="menu-container pa-0 settings-menu">

            
                <div v-if="userSession" class="menu-profile pa-2">
                  <div v-if="profile.data.contact_name" class="text-button font-weight-bold">
                    {{ profile.data.contact_name }}
                  </div>
                  <div v-if="profile.data.handle" class="text-subtitle-1 font-weight-medium">
                    @{{ profile.data.handle }}
                  </div>
                </div>

                <div v-if="userSession" style="background-color: black; padding: 5px;" class="hidden-md-and-up">
                  <v-btn to="/new"
                    prepend-icon="mdi-plus" variant="outlined" style="color: var(--gim-teal);"
                    >
                    <template v-slot:prepend>
                      <v-icon></v-icon>
                    </template>
                    NULIS
                  </v-btn>
                </div>
                            

                
                <v-btn v-if="!userSession && fetched" to="/enter" prepend-icon="mdi-account" v-cloak block>
                  Log in
                </v-btn>

                <NuxtLink v-if="userSession" class="menu-link" to="/dashboard">
                  <div>
                    Dashboard
                  </div>
                </NuxtLink>
                <NuxtLink v-if="userSession" to="/gallery">
                  <div>
                    Galeri
                  </div>
                </NuxtLink>

                

                <NuxtLink to="/admin" v-if="profileStore.profile.isAdmin">
                  <div>
                    Admin
                  </div>
                </NuxtLink>

                <NuxtLink to="/settings" v-if="userSession">
                  <div>
                    Settings
                  </div>
                </NuxtLink>

                <NuxtLink to="/signout" v-if="userSession">
                  <div>
                    Log out                    
                  </div>
                </NuxtLink>

              </v-list>
            </v-menu>

          </v-col>
        </v-row>

        

        

              

        
        
        
      </v-container>
    </v-app-bar>
  </v-layout>


</template>
<script setup>
import AuthService from '~/service/AuthService';
import ProfileService from '~/service/ProfilesService';
import {teams} from "~/service/Backend"
import { storeToRefs } from 'pinia';

const authService = new AuthService();
const profilesService = new ProfileService();

const userSession = ref();

const router = useRouter();

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const drawer = ref(true);
const rail = ref(true);

const fetched = ref(false);

onMounted(async () => {
  userSession.value = await authService.getUserSession();
  fetched.value = true;
})

const goHome = () => {
  console.log("home");
  router.push("/");
}

</script>

<style scoped>
[v-cloak] {
  display: none;
}

.menu-profile{
  background-color: var(--gim-teal);
  font-family: var(--ff-sans-serif);
}

.settings-menu{
  width: 150px;
  text-align: right;
  font-family: var(--ff-sans-serif);
}

.settings-menu a div{
  padding: 5px 10px;
}

.settings-menu a{
  text-decoration: none;
  color: black;
}

.settings-menu a div:hover{
  text-decoration: none;
  color: black;
  background-color: var(--gim-teal);
}
</style>