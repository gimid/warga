<template>
  <div class="page">
    <Header></Header>

    <v-container class="page-width">
        <v-row >
          <v-col cols="3" class="d-none d-sm-block">
          </v-col>
          <v-col :cols="windowWidth > 1000?6:12">
            <div v-for="userPost in posts">
              <PostPreview :data="userPost"></PostPreview>
            </div>
            <div>
              <v-btn color="var(--gim-teal)"  @click="loadMore" block>Muat lagi</v-btn>
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
const windowWidth = ref(0);
const lastPost = ref();

onMounted(async () => {
  window.addEventListener("resize", onResize);
  resizeEditorToWindow();
  let homepagePosts = await postsService.getHomepagePosts();
  
  if (homepagePosts) {
    posts.value = homepagePosts;
    lastPost.value = homepagePosts[homepagePosts.length-1];
  }

});

const loadMore = async () => {
  console.log("----more ----");
  console.log(lastPost.value)
  let morePosts = await postsService.getHomepagePosts(lastPost.value.$id)


  posts.value = posts.value.concat(morePosts);

  lastPost.value = morePosts[morePosts.length-1];
}

onUnmounted(()=>{
  window.removeEventListener("resize", onResize);
});

const onResize = (e) => {
  resizeEditorToWindow();
}

const resizeEditorToWindow = () => {
  windowWidth.value = window.innerWidth;
}

</script>