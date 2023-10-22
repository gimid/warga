<template>
  <div class="page">
    <Header></Header>

    <v-container class="page-width">
      <v-row v-if="originPostData != null">
        <v-col :cols="windowWidth > 900?6:12" v-cloak>
          <!-- <CommentList ref="commentListRef" :target-post-id="chatData.post_id" @start-reply-called=""></CommentList> -->
          <!-- {{ originPostData }} -->

          <v-container>
            <div class="text-h6 mb-3">
              Diskusi dari: <b>{{ originPostData.title }}</b>
            </div>

            <NuxtLink :href=" '/@'+originPostData.user_profile.handle + '/' + originPostData.$id">
              <v-btn prepend-icon="mdi-arrow-left" class="mr-2">
                Post
              </v-btn>
            </NuxtLink>
  
            <NuxtLink :href=" '/comment/' + commentData.parent_comment_id" v-if="commentData.parent_comment_id !== ''">
              <v-btn prepend-icon="mdi-arrow-expand-up">
                Naik
              </v-btn>
            </NuxtLink>
            <div v-if="commentData != null">
              <CommentView ref="baseCommentView" :comment-data="commentData" :target-post-id="targetPostId"></CommentView>
            </div>
          </v-container>

        </v-col>
      </v-row>

    </v-container>
  </div>


</template>

<script setup>

const route = useRoute();

useHead({
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/gist-embed@1.0.4/dist/gist-embed.min.js"
    }
  ]
})

import CommentService from '~/service/CommentService';
import PostsService from '~/service/PostsService';

const commentService = new CommentService();
const postsService = new PostsService();

const commentData = ref();
const targetPostId = ref();
const commentListRef = ref();
const originPostData = ref();

const baseCommentView = ref();

onMounted(async ()=>{
  
  if (route.params.commentid) {
    let commentid = route.params.commentid;

    
    commentData.value = await commentService.getComment(commentid);
    targetPostId.value = commentData.value.post_id;

    console.log(commentData.value);
    
    originPostData.value = await postsService.getPostById(targetPostId.value, null);

  }


  if (route.query.id !== undefined) {
    let targetel = document.getElementById("commentview-" + route.query.id);
    while(targetel === null) {
      console.log("MANA");
      await wait(100);
      targetel = document.getElementById("commentview-" + route.query.id)
  
      
      if (!baseCommentView?.value?.checkIsLoadingReplies()) {
        baseCommentView?.value?.loadMore();
      }
    }
    targetel.style.setProperty("border","2px solid var(--gim-teal)");
  
  
    await wait(500);
    scrollIntoViewWithOffset(targetel, 20);
  }

  // targetel.scrollIntoView({behavior:'smooth'});

})

function wait(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

const scrollIntoViewWithOffset = (target, offset) => {
  window.scrollTo({
    behavior: 'smooth',
    top:
      target.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      offset,
  })
}



</script>