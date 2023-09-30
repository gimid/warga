<template>

  <div class="page">
    
    <UserProfileValid></UserProfileValid>

    <Header></Header>

    <v-container class="page-width">
      <v-row>
        <v-col cols="12">

          <div>
            <h1>
              Postingan dari kamu
            </h1>
            {{ fetchingInfo }}
          </div>

          <div v-for="post in posts">
            <DashboardPostPreview :post="post"></DashboardPostPreview>
          </div>

          <div class="ma-1" v-if="!noMore">
            <v-btn block @click="loadMore">Muat lagi</v-btn>
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

useSeoMeta(
  {
    title: "Dashboard"
  }
)

const postsService = new PostsService();
const profilesService = new ProfilesService();
const authService = new AuthService();

const fetchedProfiles = ref({})

const posts = ref([])

const fetchingInfo = ref("Fetching data")

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
const lastCursor = ref();
const noMore = ref(false);

onMounted(async ()=>{

  await loadMore();

  
  
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


const loadMore = async () => {
  let currentSession = await authService.getUserSession();

  if (currentSession) {
    try{

      let myPosts = (await postsService.getPostsFromUserID(currentSession.$id, lastCursor.value)).documents;
      
      
      if  (myPosts.length <= 0) {
        noMore.value = true;
      }else{
        let lastId =  myPosts[myPosts.length - 1].$id;
        lastCursor.value = lastId;
      
      
        await Promise.all(myPosts.map(async (x) => {
      
      
          if (x !== null) {
            let profile = await getProfile(x.user_id);      
            x.user_handle = profile.handle;          
          }
      
        }));
      
        fetchingInfo.value = "";
        
        for (let i = 0; i < myPosts.length; i++){
          let post = myPosts[i];
          posts.value.push(post);
        }

      }


    }catch(e){
      console.log(e);
    }
  }

}



</script>