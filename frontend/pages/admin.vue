<template>

  <div class="page">
  
    <Header></Header>
    This is admin page

    <hr/>
    All user posts

    <ul v-for="post in userPosts">
      <li>
        <a class="text-amber-lighten-3">{{ post.$id }}</a> | {{ post.title }}
        <v-btn @click="deletePost(post.$id)">Hapus</v-btn>
      </li>
    </ul>

    <Footer></Footer>

  </div>

</template>
<script setup>
import { ref } from 'vue';
import PostsService from '~/service/PostsService';

const postsService = new PostsService();
let userPosts = ref();

definePageMeta({
  middleware: ["admin"]
})

onMounted(async () => {

  if (!process.server) {
    let data = await postsService.getAllUserPosts();
    userPosts.value = data.documents;
  }
  
});

const deletePost = async (id) => {
  await postsService.deletePost(id);

  let data = await postsService.getAllUserPosts();
    userPosts.value = data.documents;
}
</script>