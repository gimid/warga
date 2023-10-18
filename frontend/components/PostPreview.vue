<template>
  <div>

    <NuxtLink class="post-link" :href="link">
      <v-card class="link-card my-2 post-preview-container">
        <div v-if="isFetching">
            <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <div v-else-if="!isFetching && !dataFetchError">

          <div v-if="data.cover_image" :style="'background-image: url('+data.cover_image+')'" style="height: 110px; background-size: cover; background-position-y: center;">

          </div>

          <div class="px-4 py-4">
            <div v-if="data.user_profile && data.user_profile.handle">
              <b>@{{ data.user_profile.handle }}</b>
            </div>
            
            <h1 :class="link !== ''?'post-title-link':'post-title-disabled'">{{ title }}</h1>
            
            <div class="tagscontainer">
              <v-chip
                  v-for="(chip, index) in data.tags"
                  :key="index"
                  label
                  class="chip-tag float-left"
                >
                  #{{ chip }}
              </v-chip>
            </div>
            <div class="clearfix"></div>
          </div>

    
        </div>
        <div v-else>        
          Post fetch error {{ data.$id }}
        </div>
        
      </v-card>
    </NuxtLink>

  </div>
</template>


<script setup>
import ProfilesService from '../service/ProfilesService';
import PostsService from '../service/PostsService';
import { storeToRefs } from 'pinia';
import { ID } from 'appwrite';


const props = defineProps(['data'])
const profileService = new ProfilesService();
const postsService = new PostsService();
const userInfo = ref({});
const title = ref("");
const link = ref("");
const dataFetchError = ref(false);

const isFetching = ref(true)


onMounted(async ()=> {

    isFetching.value = true;

    title.value = props.data.title;

    // getUser(props.data.user_id);
    
    link.value = '/@' + props.data.user_profile.handle + "/" + props.data.$id;

    isFetching.value = false;

});


// const getUser = async (userId)=>{
//   const returnData = await profileService.getProfileFromUserID(userId);  
//   userInfo.value = returnData;
//   link.value = '/@' + returnData.handle + "/" + props.data.$id;
// }



</script>

<style>

.post-preview-container {
  /* height: 130px; */
}

.post-link {
  text-decoration: none;
  font-family: var(--ff-sans-serif);
}

.link-card{
  color: #292929;
}

.link-card:hover{
  text-decoration: none;
  font-family: var(--ff-sans-serif);
  color: var(--gim-teal-dark);
}

.post-title-disabled {
  color: #e0e0e0;
}

.post-title-link{
  font-size: 1.75rem;
  font-weight: 800;
  font-family: var(--ff-sans-serif);
}

.post-title-link:hover {
  /* text-decoration: none;
  font-family: var(--ff-sans-serif);
  color: var(--gim-teal-dark); */

}

</style>