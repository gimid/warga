


<template>

  <div class="page">
    <Header></Header>

    <v-container class="page-width">
      <v-row>
    
        <v-col :cols="windowWidth > 1000?8:12" v-cloak>
          <PostContainer :data="currentPost" :writer="currentWriter" :current-route="route" show-series="true"></PostContainer>
        </v-col>

        <v-col>
          Info penulis
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
            <CommentList ref="commentListRef" :target-post="currentPost" @start-reply-called="onStartReply"></CommentList>
          </v-col>
        </v-row>

        <v-row>
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


import PostsService from '~/service/PostsService';
import ProfilesService from '~/service/ProfilesService';

const route = useRoute();
const postsService = new PostsService();
const profileService = new ProfilesService();

const cmEditorRef = ref();

const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const {data: currentPost, refresh: refreshCurrentPost} = await useAsyncData('post', async ()=> await postsService.getPostById(route.params.postid, route.query.preview_key))
const {data: currentWriter, refresh: refreshCurrentWriter} = await useAsyncData('writer', async ()=> await profileService.getProfileFromHandle(route.params.username));

const windowWidth = ref(0);
const editText = ref("")

const isEditMode = ref(true);
const commentListRef = ref();

const currentTargetReply = ref(null);

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

</script>

<style>

.comment-container{
  background-color: white;
  border-radius: 5px;
}

[v-cloak] { display: none; }

</style>