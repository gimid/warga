<template>
  <div>
    
    <div v-if="commentModel" class="my-2" :id="'commentview-'+commentModel.$id">

      <div v-if="!isEditing">
        <v-container  class="rounded py-2" style="background-color: #fff;">
          <div>
            <div class="py-1 d-inline-block" align-self="start">
              <NuxtLink v-if="userData" :href="'/@'+userData.handle">
                <span class="font-weight-bold mr-3" v-if="userData">
                  {{ userData.contact_name }}
                </span>
              </NuxtLink>
              •
              <span class="ml-3" style="color:#a1a1a1">{{ formatDate(commentModel.$updatedAt) }}</span>
  
              <span v-if="commentModel.$updatedAt != commentModel.$createdAt" style="color:#a1a1a1">
                <span class="ml-1"></span>
                • 
                <span>edited</span>
              </span>
            </div>
            <div v-if="!minimalist" class="d-inline-block float-right">
              <v-menu v-if="isUserComment">
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
          </div>
          
          <div v-if="commentModel.parent_comment_id">
            <v-row >
              <v-col>
                <!-- <v-btn variant="flat" @click="navigateReply(commentModel.parent_comment_id)">>>{{ commentModel.parent_comment_id }}</v-btn> -->
              </v-col>
            </v-row>
          </div>

          <div class="rounded" style="background-color: white; font-size: 0.95em;">

            <div v-if="minimalist" class="pa-1">
              {{ commentModel.content.substring(0,200) }}...
            </div>
            <div v-else>
              <MdPreview :show-code-row-number="true" class="md-content comment-content" :modelValue="commentModel.content" codeTheme="github" language="en-US"></MdPreview>
            </div>
          </div>

          <div v-if="!minimalist">
            <v-btn prepend-icon="mdi-message-outline" variant="text" @click="startReply" style="font-size: 0.7em; padding: 0;">
              Balas
            </v-btn>

            <div v-if="isReplying">
              <CommentEditor
                :previous-comment-data="commentModel"
                is-immediate-edit-mode="true"
                ref="replyEditorRef"
                :edit-text-model="replyTextModel"
                :target-post="targetPost"
                :target-comment-parent-id="commentModel.$id"
                @on-new-comment-posted="onNewCommentPosted"
                >
              </CommentEditor>
            </div>

          </div>

          <div v-for="comment in commentReplies" style="border-left: solid 1px #e0e0e0;">
            <!-- {{ commentReplies }} -->
            <CommentView :comment-data="comment" :target-post="targetPost"></CommentView>
          </div>

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
import CommentService from "~/service/CommentService"
import AuthService from '~/service/AuthService';
import { emit } from 'process';

const props = defineProps(['commentData','minimalist', 'targetPost']);
const userData = ref();

const editMenu = ref(false);

const profilesService = new ProfilesService();
const commentService = new CommentService();
const authService = new AuthService();

const isEditing = ref(false);
const commentEditorRef = ref();
const replyEditorRef = ref();
const editTextModel = ref("")
const replyTextModel = ref("")
const commentModel = ref();
const isUserComment = ref(false);
const isReplying = ref(false);
const router = useRouter();

const commentReplies = ref();

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

  // load replies
  loadReplies();
})

const loadReplies = async () => {
  let fetchedReplies = await commentService.getCommentReply(commentModel.value.$id);

  if (fetchedReplies.total > 0) {
    commentReplies.value = fetchedReplies.documents;
  }
}


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

const onNewCommentPosted = () => {
  loadReplies();
}

const onDataUpdated = async (x) => {
  commentModel.value = x;
  isEditing.value = false;

  console.log("on data updated in comment view");

  await wait(100)
  GistEmbed.init();
}

const startReply = async () =>{
  let currentUser = await authService.getUserSession();

  if (currentUser) {
    isReplying.value = true;
    console.log("start reply to:")
    console.log(commentModel.value);

    await wait(100);
    replyEditorRef.value?.startNewComment();

    emits('startReplyCalled', commentModel.value);
  }else{
    router.push("/enter");
  }



  
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

.comment-content {
  font-size: 1.2em;
}
</style>