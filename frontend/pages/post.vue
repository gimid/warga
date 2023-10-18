


<template>

  <div class="page">
    <Header></Header>

    <v-container class="page-width">
      <v-row>
    
        <v-col :cols="windowWidth > 1000?8:12" v-cloak>
          <PostContainer :data="currentPost" :writer="currentPost.user_profile" :current-route="route" show-series="true"></PostContainer>
        </v-col>

        <v-col style="overflow-wrap: break-word; word-break: keep-all;"  :cols="windowWidth > 1000?4:12">
          <ClientOnly>
            <div class="writer-card" v-if="currentPost.user_profile">
              <div class="mb-3">
                <span v-if="currentPost.user_profile.contact_name" class="text-h5 writer-card-title">{{ currentPost.user_profile.contact_name }}</span>
                <span v-if="currentPost.user_profile.handle" class="text-h5 writer-card-title">(@{{ currentPost.user_profile.handle }})</span>

              </div>
              <div v-if="currentPost.user_profile.metadata">
                <span>{{ JSON.parse(currentPost.user_profile.metadata).status }}</span>
              </div>
            </div>
          </ClientOnly>
        </v-col>

      </v-row>

      <ClientOnly>
        <!-- Comments -->
        <v-row>
          <v-col :cols="windowWidth > 1000?8:12" >
            <hr/>
          </v-col>
        </v-row>

        <v-row>
          <v-col rounded="lg" :cols="windowWidth > 1000?6:12">
            <!-- <CommentList ref="commentListRef" :target-post="currentPost" @start-reply-called="onStartReply"></CommentList> -->
            <CommentList ref="commentListRef" :target-post="currentPost" @start-reply-called=""></CommentList>
          </v-col>
        </v-row>

        <v-row v-if="currentUser">
          <v-col rounded="lg" :cols="windowWidth > 1000?6:12">
            <div v-if="currentTargetReply">
              <h1>Membalas ke :</h1>
              <CommentView class="ml-10" :comment-data="currentTargetReply" minimalist="true"></CommentView>
            </div>
            <CommentEditor ref="cmEditorRef" :target-comment-parent-id="currentTargetReply?currentTargetReply.$id:''" :target-post="currentPost" @on-data-updated="onCommentDataUpdated" @cancel-edit="onCancelComment"></CommentEditor>
          </v-col>
          <div id="BottomCommentEditor"></div>
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
import { storeToRefs } from 'pinia';

import AuthService from '~/service/AuthService';
import PostsService from '~/service/PostsService';
import ProfilesService from '~/service/ProfilesService';

const route = useRoute();
const postsService = new PostsService();
const profileService = new ProfilesService();

const cmEditorRef = ref();

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const {data: currentPost, refresh: refreshCurrentPost} = await useAsyncData('post', async ()=> await postsService.getPostById(route.params.postid, route.query.preview_key))
// const {data: currentWriter, refresh: refreshCurrentWriter} = await useAsyncData('writer', async ()=> await profileService.getProfileFromHandle(route.params.username));

const windowWidth = ref(0);
const editText = ref("")

const isEditMode = ref(true);
const commentListRef = ref();

const currentTargetReply = ref(null);

const currentUser = ref();

// const writerInfo = ref();
// const writerMetadata = ref();

useSeoMeta({
  title: currentPost.value.title,
  ogTitle: currentPost.value.title,
  description: currentPost.value.content?currentPost.value.content.substring(0, 255):"",
  ogImage: currentPost.value.cover_image,
  ogImageSecureUrl: currentPost.value.cover_image,
  ogImageType: 'image/jpeg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterSite: '@gimiddev',
  twitterTitle: currentPost.value.title,
  twitterDescription: currentPost.value.content?currentPost.value.content.substring(0, 255):"",
  twitterImage: currentPost.value.cover_image
})

onMounted(async () => {
  window.addEventListener("resize", onResize);
  resizeEditorToWindow();

  var elements = document.getElementsByTagName("pre");
  console.log(elements);

  checkLoggedIn();
  fetchWriterInfo();

  // writerInfo.value = currentPost.user_profile;
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
  currentTargetReply.value = null;
  await commentListRef.value?.loadComments();
}

const onStartReply = async (x) => {
  
  currentTargetReply.value = null;
  currentTargetReply.value = x;
  
  console.log(cmEditorRef.value);
  cmEditorRef.value?.startNewComment();
  
  await wait(200);
  document.getElementById("BottomCommentEditor").scrollIntoView();
}

const onCancelComment = () => {
  currentTargetReply.value = null;
}

const checkLoggedIn = async() => {

  try{
    const authService = new AuthService();
    currentUser.value = await authService.getUserSession();
  }catch(e){
    currentUser.value = null;
    console.log(e);
  }
  
}

const fetchWriterInfo = async() => {

  if (route.params.username != currentPost.value.user_profile.handle){
    navigateTo("/@"+currentPost.value.user_profile.handle + "/" + route.params.postid);
  }

  // let profile = await profileService.getProfileFromHandle(route.params.username);
  // writerInfo.value = profile;
  // try{
  //   writerMetadata.value = JSON.parse(profile.metadata);
  // }catch(e){
  //   console.log(e);
  // }
}

</script>

<style>

.comment-container{
  background-color: white;
  border-radius: 5px;
}




.writer-card{
  background-color: #fff;
  min-height: 150px;
  border-radius: 8px;
  border: 1px #d3d3d3 solid;
  padding: 2rem;
}

.writer-card-title{
  font-weight: bold;
  font-family: var(--ff-sans-serif) !important;
}

</style>