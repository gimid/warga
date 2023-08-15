
<script setup>

import {useRoute} from 'vue-router'
import { ref } from 'vue';
import { storeToRefs } from 'pinia';


import PostsService from '~/service/PostsService';
import ProfilesService from '~/service/ProfilesService';

const route = useRoute();
const postsService = new PostsService();
const profileService = new ProfilesService();

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const {data: currentPost, refresh: refreshCurrentPost} = await useAsyncData('post', async ()=> await postsService.getPostById(route.params.postid, route.query.preview_key))
const {data: currentWriter, refresh: refreshCurrentWriter} = await useAsyncData('writer', async ()=> await profileService.getProfileFromHandle(route.params.username));


</script>


<template>

  <div class="page">
    <Header></Header>

    <v-container class="page-width">
      <v-row>
        <v-col cols="3" class="d-none d-md-block">          
        </v-col>

        <v-col cols="6" class="d-none d-md-block">
          <PostContainer :data="currentPost" :writer="currentWriter" :current-route="route" show-series="true"></PostContainer>
        </v-col>

        <v-col cols="12" class="d-md-none">
          <PostContainer :data="currentPost" :writer="currentWriter" :current-route="route" show-series="true"></PostContainer>
        </v-col>


        <v-col cols="3" class="d-none d-md-block">
          
        </v-col>
      </v-row>
    </v-container>


    
    <Footer></Footer>

    <ClientOnly>
      <PostActionButton :currentRoute="route" :data="currentPost"></PostActionButton>
    </ClientOnly>
  </div>
</template>
