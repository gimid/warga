<template>
  <div>
    <div v-for="comment in comments" class="w-100">
      <div :class="currentHighlightId == comment.$id?'highlighted':''" >
        <CommentView :target-post-id="targetPostId" :comment-data="comment" v-on:start-reply-called="onStartReply" @navigateReplyCalled="onNavigateReplyCalled" v-on:new-comment-posted="onNewCommentPosted"></CommentView>
      </div>
    </div>
    <div v-if="comments.length < totalComments">
      <v-btn block @click="loadMore">Muat lagi</v-btn>
    </div>
  </div>

</template>

<script setup>
import CommentService from '~/service/CommentService';

const props = defineProps(['targetPostId', 'targetCommentParent']);
const emits = defineEmits(['startReplyCalled'])
const comments = ref({});

const commentService = new CommentService();

const currentHighlightId = ref("");

const lastCursor = ref();
const totalComments = ref(0);


onMounted(()=>{
  loadComments();
});

const loadComments = async() => {
  let fetchedComments = await commentService.getBaseCommentsFromPost(props.targetPostId);
  totalComments.value = fetchedComments.total;

  if (fetchedComments.documents.length > 0) {
    lastCursor.value = fetchedComments.documents[fetchedComments.documents.length-1].$id;
  }
  
  comments.value = fetchedComments.documents;
}

const loadMore = async() => {
  let fetchedComments = await commentService.getBaseCommentsFromPost(props.targetPostId, lastCursor.value);
  totalComments.value = fetchedComments.total;
  
  if (fetchedComments.documents.length > 0) {
    lastCursor.value = fetchedComments.documents[fetchedComments.documents.length-1].$id;
  }

  for (let i = 0; i < fetchedComments.documents.length; i++) {
    comments.value.push(fetchedComments.documents[i]);
  }
}


const onStartReply = (x) => {
  emits('startReplyCalled', x);
}

const onNavigateReplyCalled = (x) => {
  currentHighlightId.value = x;
}

const onNewCommentPosted = () => {
  loadComments();
}


defineExpose({loadComments})
</script>

<style>


@keyframes pulse {
  0% {border: solid 4px rgb(43, 255, 0);}
  50% {border: solid 4px rgb(37, 206, 3);}
  100% {border: solid 4px rgba(43, 255, 0);}
}

.highlighted {
  animation-name: pulse;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  border-radius: 5px;
  padding: 5px;
}

</style>