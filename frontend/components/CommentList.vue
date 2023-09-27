<template>
  <div>
    <div v-for="comment in comments" class="w-100">
      <div :class="currentHighlightId == comment.$id?'highlighted':''" >
        <CommentView :target-post="targetPost" :comment-data="comment" v-on:start-reply-called="onStartReply" @navigateReplyCalled="onNavigateReplyCalled" v-on:new-comment-posted="onNewCommentPosted"></CommentView>
      </div>
    </div>
  </div>

</template>

<script setup>
import CommentService from '~/service/CommentService';

const props = defineProps(['targetPost', 'targetCommentParent']);
const emits = defineEmits(['startReplyCalled'])
const comments = ref({});

const commentService = new CommentService();

const currentHighlightId = ref("");


onMounted(()=>{
  loadComments();
});

const loadComments = async() => {
  let fetchedComments = await commentService.getBaseCommentsFromPost(props.targetPost.$id);
  
  comments.value = fetchedComments.documents;
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