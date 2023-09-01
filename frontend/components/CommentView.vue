<template>
  <div>
    
    <div v-if="commentModel" class="my-2" :id="'commentview-'+commentModel.$id">

      <div v-if="!isEditing">
        <v-container  class="rounded py-5" style="background-color: #fff;">
          <v-row>
            <v-col class="py-6 px-6" align-self="start">
              <span class="font-weight-bold mr-3" v-if="userData">{{ userData.contact_name }}</span>
              •
              <span class="ml-3" style="color:#a1a1a1">{{ formatDate(commentModel.$updatedAt) }}</span>
  
              <span v-if="commentModel.$updatedAt != commentModel.$createdAt" style="color:#a1a1a1">
                <span class="ml-1"></span>
                • 
                <span>edited</span>
              </span>
            </v-col>
            <v-col align-self="end" cols="1"  v-if="!minimalist">
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
            </v-col>
          </v-row>
          
          <div v-if="commentModel.parent_comment_id">
            <v-row >
              <v-col class="ml-10 mb-6" style="border-left: 4px solid var(--gim-teal); font-size: small;">
                <v-btn @click="navigateReply(commentModel.parent_comment_id)">Balasan untuk {{ commentModel.parent_comment_id }}</v-btn>
              </v-col>
            </v-row>
          </div>

          <v-row class="mx-2 py-2 rounded" style="border: 1px solid #e0e0e0; background-color: white; font-size: 0.95em;">
            <v-col>
              <div v-if="minimalist" class="pa-3">
                {{ commentModel.content.substring(0,200) }}...
              </div>
              <div v-else>
                <MdPreview :show-code-row-number="true" class="md-content" :modelValue="commentModel.content" codeTheme="github" language="en-US"></MdPreview>
              </div>
            </v-col>
          </v-row>
          <v-row v-if="!minimalist">
            <v-btn class="ma-2" prepend-icon="mdi-message-outline" variant="text" @click="startReply">
              Balas
            </v-btn>
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
import { emit } from 'process';

const props = defineProps(['commentData','minimalist']);
const userData = ref();

const editMenu = ref(false);

const profilesService = new ProfilesService();
const authService = new AuthService();

const isEditing = ref(false);
const commentEditorRef = ref();
const editTextModel = ref("")
const commentModel = ref();
const isUserComment = ref(false);

const emits = defineEmits(['startReplyCalled','navigateReplyCalled'])

config({
  markdownItConfig: (mdit) => {
    mdit.use(videoplugin);
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
  commentEditorRef.value?.startEditComment();
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

const startReply = () =>{
  console.log("start reply to:")
  console.log(commentModel.value);
  emits('startReplyCalled', commentModel.value);
}

const navigateReply = (replyId) => {
  let targetItemId = 'commentview-' + replyId;
  document.getElementById(targetItemId).scrollIntoView({behavior:'smooth'});
  emits('navigateReplyCalled', replyId);
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

.md-content{
  width: 100% !important;
}
</style>