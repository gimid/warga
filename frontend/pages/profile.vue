<template>

  <div class="page">
    <Header></Header>
  
    <v-container class="page-width">
      <v-row>
    
        <v-col>
          <div v-if="userFetched">
            <div v-if="!profileExist">
              This page does not exist
            </div>
          
            <div v-else>
              <div>
                <h1>
                  {{ profileData.contact_name }}
                </h1>
                <h4>
                  @{{ profileData.handle }}
                </h4>

                <div v-if="profileData.metadata"  class="pa-3 my-2" style="max-width: 500px; background-color: white; border-radius: 5px; box-shadow: 0px 0px 3px rgba(0,0,0,0.5);">
                 {{ JSON.parse(profileData.metadata).status }}
                </div>

              </div>
            </div>
          </div>
  
          <div v-else>
          </div>
  
        </v-col>
  
      </v-row>
      <v-row>
        <v-col>
          <!-- {{ userPosts }} -->
          <ul v-for="post in userPosts">
            <li>
              <NuxtLink :href="'@'+profileData.handle + '/'+ post.$id ">
                {{ post.title }}
              </NuxtLink>
            </li>
          </ul>
        </v-col>
  
      </v-row>
    </v-container>
  </div>
  
  
  
  
</template>


<script setup>

import { useRoute } from 'vue-router'
import { ref } from 'vue';
import AuthService from '~/service/AuthService';
import ProfilesService from '~/service/ProfilesService'
import PostsService from '~/service/PostsService';

definePageMeta({
  middleware: ["loggedin"]
})

const route = useRoute();
const userFetched = ref(false);
const profileExist = ref(true);
const profileData = ref();
const authService = new AuthService();
const profilesService = new ProfilesService();
const postService = new PostsService();

const userPosts = ref();

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

  
  userPosts.value = await postService.getPostFromUserHandle(handle);


});



</script>

