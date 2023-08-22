


<template>

  <div class="page">
    <Header></Header>

    <v-container class="page-width">
      <v-row>

        <v-col cols="3" :class="windowWidth < 600 ?'d-none':'d-md-block'">
        </v-col>

        <v-col :cols="windowWidth > 600?6:12">
          <PostContainer :data="currentPost" :writer="currentWriter" :current-route="route" show-series="true"></PostContainer>
        </v-col>

        <!-- <v-col cols="12" class="d-md-none">
          <PostContainer :data="currentPost" :writer="currentWriter" :current-route="route" show-series="true"></PostContainer>
        </v-col> -->


        <v-col cols="3" :class="windowWidth < 600 ?'d-none':'d-md-block'">
        </v-col>
      </v-row>

      <ClientOnly>

        <v-row>
          <hr/>
        </v-row>
        <v-row>
          <v-col cols="3" :class="windowWidth < 600 ?'d-none':'d-md-block'">
          </v-col>
          <v-col rounded="lg" :cols="windowWidth > 600?6:12">

            <div v-if="!commenting" id="pre-comment-editor-container" class="pa-2 comment-container">
              <div style="outline: solid 1px #e0e0e0; height: 50px;" class="pa-2 text-grey" @click="startCommenting">
                Gabung diskusi
              </div>
            </div>

            <div v-if="commenting" id="comment-editor-container" class="pa-2 comment-container">
              <WMDEditor
                ref="editorRef"
                v-model:edit-text-model-value="editText"
                :edit-text-model="editText"
                
                :resize-editor-to-window="false"
                :show-preview="false"
                height="200"
                
                v-model:is-editing-text-model-value="isEditMode"
                :is-editing-text-model="isEditMode">
              </WMDEditor>

              <v-btn class="" color="var(--gim-teal)">Post</v-btn>
              <v-btn v-if="isEditMode" class="ma-3" variant="outlined" color="grey" @click="showPreviewMode">Pratinjau</v-btn>
              <v-btn v-if="!isEditMode" class="ma-3" variant="outlined" color="grey" @click="showEditMode">Edit</v-btn>
            </div>
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
const commenting = ref(false);
const isEditMode = ref(true);

onMounted(() => {
  window.addEventListener("resize", onResize);
  resizeEditorToWindow();
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

const startCommenting = async () => {
  commenting.value = true;

  await wait(100);
  editorRef.value?.focus();
}

const showPreviewMode = () => {
  editorRef.value?.showPreviewMode();
}

const showEditMode = () => {
  editorRef.value?.showEditMode();
}


function wait(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

</script>

<style>

.comment-container{
  background-color: white;
  border-radius: 5px;
}

</style>