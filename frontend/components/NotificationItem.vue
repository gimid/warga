<template>
  <div v-if="notificationData != null && senderProfile != null">
    <div class="notification-item">
      <div class="d-inline-block float-right">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props" variant="text"></v-btn>
          </template>
  
          <v-list style="cursor: pointer;">
            <v-list-item class="comment-menu" prepend-icon="mdi-trash-can">
              <v-list-item-title @click="deleteNotification">Hapus notifikasi ini</v-list-item-title>
            </v-list-item>
            <v-list-item class="comment-menu" prepend-icon="mdi-eye-refresh" v-if="notificationData.seen">
              <v-list-item-title @click="setSeenFalse">Tandai belum dibaca</v-list-item-title>              
            </v-list-item>

            <v-list-item class="comment-menu" prepend-icon="mdi-eye" v-if="!notificationData.seen">
              <v-list-item-title @click="setSeenTrue"> Tandai sudah dibaca</v-list-item-title>              
            </v-list-item>

          </v-list>
        </v-menu>
      </div>


      <v-container @click="navigateNotification">

        <div v-if="notificationData.source_type == 'comment'">
          <v-row :v-if="currentCommentData !== null && currentCommentData !== undefined">
            <v-col cols="1">
  
              <v-badge dot color="red" :model-value="!notificationData.seen">
                <div v-if="keyExists('parent_comment_id', currentCommentData)">
                  <div v-if="currentCommentData.parent_comment_id === ''">
                    <v-icon icon="mdi-post"></v-icon>
                  </div>
                  <div v-if="currentCommentData.parent_comment_id !== ''">
                    <v-icon icon="mdi-comment"></v-icon>
                  </div>
                </div>
              </v-badge>
  
            </v-col>
            <v-col>
              <div v-if="keyExists('parent_comment_id', currentCommentData)">
                <div v-if="currentCommentData.parent_comment_id === ''">
                  <span class="font-weight-bold">{{ senderProfile.contact_name }}</span> mengomentari postingan anda
                </div>
                <div v-if="currentCommentData.parent_comment_id !== ''">
                  <span class="font-weight-bold">{{ senderProfile.contact_name }}</span> membalas komentar anda
                </div>
              </div>
              
              <div class="text-caption">
                {{ getTimeAgo(notificationData.$createdAt) }}
              </div>
            </v-col>
  
  
          </v-row>
        </div>

      </v-container>


    </div>
  </div>
</template>
<script setup>

const props = defineProps(['notificationData']);
const emits = defineEmits(['deleted'])

import ProfilesService from '~/service/ProfilesService';
import PostsService from '~/service/PostsService';
import CommentService from '~/service/CommentService';
import NotificationService from '~/service/NotificationService';
import { getTimeAgo } from '~/libraries/timeutil';

const profileService = new ProfilesService();
const commentService = new CommentService();
const notificationService = new NotificationService();

const currentCommentData = ref();

const senderProfile = ref();
const router = useRouter();

onMounted(async ()=>{
  senderProfile.value = await profileService.getProfileFromUserID(props.notificationData.sender_user_id);

  if (props.notificationData.source_type === "comment") {
    currentCommentData.value = await commentService.getComment(props.notificationData.sender_item_url);
  }
})

const deleteNotification = async () => {
  await notificationService.deleteNotification(props.notificationData.$id);

  emits('deleted')
}

const setSeenFalse = async () => {
  await notificationService.setSeen(props.notificationData.$id, false);
  props.notificationData.seen = false;
}

const setSeenTrue = async () => {
  await notificationService.setSeen(props.notificationData.$id, true);
  props.notificationData.seen = true;
}

const keyExists = (checkKey, obj)=>{
  if(obj == undefined) {
    return false;
  }
  return checkKey in obj;
}

const navigateNotification = async () => {

  await setSeenTrue();

  let targetPath = 'comment/'+props.notificationData.target_url+'?id='+props.notificationData.sender_item_url;
  router.push(targetPath);
}



</script>

<style>
.notification-item{
  background-color: #fff;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px; 
  cursor: pointer;
}

.notification-item:hover{
  background-color: var(--gim-teal);
}

.notification-item a{
  text-decoration: none;
  color: #303030;
}

.visited{
  text-decoration: none;
  color: #9b9b9b;
}


</style>