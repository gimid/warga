<template>
  <div class="page">
    <Header></Header>

    <v-container class="page-width">
        <v-row >
          <v-col cols="3" class="d-none d-sm-block">
          </v-col>
          <v-col>
            
            <div v-for="userPost in posts">
              <PostPreview :data="userPost"></PostPreview>
            </div>
          </v-col>
          <v-col cols="3" class="d-none d-sm-block">
          </v-col>
          <!-- <v-col cols="6">
            <div v-for="userPost in postdata.posts">
              <PostPreview :data="userPost"></PostPreview>
            </div>
          </v-col>
          <v-col  cols="3" class="d-none d-sm-block">
          </v-col> -->
          
        </v-row>
    </v-container>

    <Footer></Footer>
  </div>
</template>

<script setup>
import PostsService from '../service/PostsService';
import { storeToRefs } from 'pinia';

const postsService = new PostsService();

let posts = ref([]);

onMounted(async () => {
  
  let homepagePosts = await postsService.getHomepagePosts();
  
  if (homepagePosts) {
    posts.value = homepagePosts.posts;
  }

});

</script>