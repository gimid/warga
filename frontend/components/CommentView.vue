<template>
  <div>
    
    <div v-if="commentModel" class="my-2">

      <div v-if="!isEditing">
        <div class="float-right" v-if="isUserComment">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" v-bind="props" variant="text"></v-btn>
            </template>
    
            <v-list style="cursor: pointer;">
              <v-list-item class="comment-menu">
                <v-list-item-title @click="editComment">Edit</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        
        <v-container class="px-10 py-8 rounded" style="border: 1px solid #e0e0e0; background-color: white; font-size: 0.95em;">
          <v-row>
            
            <span class="font-weight-bold mr-3" v-if="userData">{{ userData.contact_name }}</span>
            •
            <span class="ml-3" style="color:#a1a1a1">{{ formatDate(commentModel.$updatedAt) }}</span>

            <span v-if="commentModel.$updatedAt != commentModel.$createdAt" style="color:#a1a1a1">
              <span class="ml-1"></span>
              • 
              <span>edited</span>
            </span>
            
          </v-row>
          <v-row>
            <MdPreview id="md-content" :modelValue="commentModel.content" codeTheme="github" language="en-US"></MdPreview>
          </v-row>
        </v-container>
  
      </div>
  
      <div :class="!isEditing?'editor-hidden':'editor-visible'">
        <CommentEditor
          :previous-comment-data="commentModel"
          is-edit-previous-comment-mode="true"
          ref="commentEditorRef"
          :edit-text-model="editTextModel"
          @cancel-edit="onCancelEdit"
          @on-data-updated="onDataUpdated"
          @update:edit-text-model-value="onUpdate">
        </CommentEditor>
      </div>

    </div>
  </div>
  
</template>
<script setup>

import {MdPreview, MdCatalog, config} from 'md-editor-v3';
import { lineNumbers } from '@codemirror/view';
import {videoplugin} from '~/libraries/markdownitvideo'

import ProfilesService from '~/service/ProfilesService';
import AuthService from '~/service/AuthService';

const props = defineProps(['commentData']);
const userData = ref();

const editMenu = ref(false);

const profilesService = new ProfilesService();
const authService = new AuthService();

const isEditing = ref(false);
const commentEditorRef = ref();
const editTextModel = ref("")
const commentModel = ref();
const isUserComment = ref(false);

config({
  markdownItConfig: (mdit) => {
    mdit.use(videoplugin);
  },
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, lineNumbers()];
  }
})


onMounted(async()=>{
  commentModel.value = props.commentData;

  userData.value = await profilesService.getProfileFromUserID(commentModel.value.user_id);

  await checkIsUserComment();


  await wait(100)
  GistEmbed.init();
})

const checkIsUserComment = async () => {
  console.log("is user comment?")
  try{
    let currentUser = await authService.getUserSession();
  
    if (commentModel.value.user_id == currentUser.$id ) {
      isUserComment.value = true;
    }else{
      isUserComment.value = false;
    }
  }catch(e){
    console.log(e);
    isUserComment.value = false;
  }

}

const formatDate = (date) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var formattedDate = new Date(date);

  var monthName = monthNames[formattedDate.getMonth()];

  const year = formattedDate.getFullYear();
  // const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formattedDate.getDate()).padStart(2, "0");
  return `${day} ${monthName} ${year}`;
}

const editComment = async() => {
  editTextModel.value = commentModel.value.content;
  isEditing.value = true;
  await(200);
  commentEditorRef.value?.startCommenting();
}

function wait(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

const onCancelEdit = () => {
  isEditing.value = false;

  console.log(editTextModel.value)
}

const onUpdate = (x) => {
  editTextModel.value = x;
}

const onDataUpdated = async (x) => {
  commentModel.value = x;
  isEditing.value = false;

  console.log("on data updated in comment view");

  await wait(100)
  GistEmbed.init();
}

</script>

<style>
.comment-menu:hover{
  background-color: var(--gim-teal);
}

.editor-hidden{
  display: none;
}

.editor-visible{
  display: block;
}
</style>