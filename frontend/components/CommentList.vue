<template>
  <div v-for="comment in comments">
    <CommentView :comment-data="comment"></CommentView>
  </div>

</template>

<script setup>
import CommentService from '~/service/CommentService';

const props = defineProps(['targetPost', 'targetCommentParent']);
const comments = ref({});

const commentService = new CommentService();

onMounted(()=>{
  loadComments();
});

const loadComments = async() => {
  let fetchedComments = await commentService.getCommentsFromPost(props.targetPost.$id);
  comments.value = fetchedComments.documents;
}


defineExpose({loadComments})
</script>