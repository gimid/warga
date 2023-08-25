<template>

  <div class="page">
    
    <UserProfileValid></UserProfileValid>

    <Header></Header>

    <v-container class="page-width">
      <v-row>
        <v-col cols="3" class="d-none d-sm-block">
        </v-col>
        <v-col cols="6">
          Postingan dari kamu
          {{ fetchingInfo }}


          <div v-for="post in posts">
            <DashboardPostPreview :post="post"></DashboardPostPreview>
          </div>


        </v-col>
        <v-col cols="3" class="d-none d-sm-block">
        </v-col>
      </v-row>
    </v-container>
    
    

    <Footer></Footer>
  </div>

</template>
<script setup>

import { ref } from 'vue';
import PostsService from '~/service/PostsService';
import ProfilesService from '~/service/ProfilesService';
import AuthService from '~/service/AuthService';
import { storeToRefs } from 'pinia';

definePageMeta({
  middleware: ["loggedin"]
})

const postsService = new PostsService();
const profilesService = new ProfilesService();
const authService = new AuthService();

const fetchedProfiles = ref({})

const posts = ref([])

const fetchingInfo = ref("Fetching data")

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);


onMounted(async ()=>{



  let currentSession = await authService.getUserSession();

  if (currentSession) {


    try{
      let myPosts = (await postsService.getPostsFromUserID(currentSession.$id)).documents;
  

      await Promise.all(myPosts.map(async (x) => {
  
  
        if (x !== null) {
          let profile = await getProfile(x.user_id);      
          x.user_handle = profile.handle;          
        }
  
      }));
  
  
      fetchingInfo.value = "";
  
      posts.value = myPosts;

    }catch(e){
      console.log("current session failed")
      console.log(e);
    }
  }



})

const getProfile = async (user_id) => {
  let targetProfile = null;
  if (!fetchedProfiles.value.hasOwnProperty(user_id)) {
    targetProfile = await profilesService.getProfileFromUserID(user_id);
    fetchedProfiles.value[user_id] = targetProfile;
  }else{
    targetProfile = fetchedProfiles.value[user_id];
  }

  return targetProfile;

}






</script>