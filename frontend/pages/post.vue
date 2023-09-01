


<template>

  <div class="page">
    <Header></Header>

    <v-container class="page-width">
      <v-row>

        <!-- <v-col cols="3" :class="windowWidth < 600 ?'d-none':'d-md-block'">
        </v-col> -->

        <v-col cols="3">
        </v-col>

        <v-col :cols="windowWidth > 1000?6:12" v-cloak>
        <!-- <v-col cols="6" v-cloak> -->
          <PostContainer :data="currentPost" :writer="currentWriter" :current-route="route" show-series="true"></PostContainer>
        </v-col>

        <!-- <v-col cols="12" class="d-md-none">
          <PostContainer :data="currentPost" :writer="currentWriter" :current-route="route" show-series="true"></PostContainer>
        </v-col> -->


        <v-col cols="3" :class="windowWidth < 600 ?'d-none':'d-md-block'">
        </v-col>
      </v-row>

      <ClientOnly>
        <!-- Comments -->
        <v-row>
          <hr/>
        </v-row>
        <v-row>
          <v-col cols="3" :class="windowWidth < 600 ?'d-none':'d-md-block'">
          </v-col>
          <v-col rounded="lg" :cols="windowWidth > 1000?6:12">
            <CommentList ref="commentListRef" :target-post="currentPost"></CommentList>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3" :class="windowWidth < 600 ?'d-none':'d-md-block'">
          </v-col>
          <v-col rounded="lg" :cols="windowWidth > 1000?6:12">
            <CommentEditor :target-post="currentPost" @on-data-updated="onCommentDataUpdated"></CommentEditor>
          </v-col>
        </v-row>
      </ClientOnly>
    </v-container>


    
    <Footer></Footer>

    <ClientOnly>
      <PostActionButton :currentRoute="route" :data="currentPost"></PostActionButton>
    </ClientOnly>
  </div>
</template>


<script setup>


import {useRoute} from 'vue-router'
import { ref } from 'vue';
import { storeToRefs } from 'pinia';


import PostsService from '~/service/PostsService';
import ProfilesService from '~/service/ProfilesService';

const route = useRoute();
const postsService = new PostsService();
const profileService = new ProfilesService();

const editorRef = ref();

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const {data: currentPost, refresh: refreshCurrentPost} = await useAsyncData('post', async ()=> await postsService.getPostById(route.params.postid, route.query.preview_key))
const {data: currentWriter, refresh: refreshCurrentWriter} = await useAsyncData('writer', async ()=> await profileService.getProfileFromHandle(route.params.username));

const windowWidth = ref(0);
const editText = ref("")

const isEditMode = ref(true);
const commentListRef = ref();

onMounted(() => {
  window.addEventListener("resize", onResize);
  resizeEditorToWindow();

  var elements = document.getElementsByTagName("pre");
  console.log(elements);
});

onUnmounted(()=>{
  window.removeEventListener("resize", onResize);
});

const onResize = (e) => {
  resizeEditorToWindow();
}

const resizeEditorToWindow = () => {
  windowWidth.value = window.innerWidth;
}


function wait(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

const onCommentDataUpdated = async () => {
  console.log("on data updated in post view")
  await commentListRef.value?.loadComments();
}

</script>

<style>

.comment-container{
  background-color: white;
  border-radius: 5px;
}

[v-cloak] { display: none; }

</style>