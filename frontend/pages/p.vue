<template>
  <div class="page">
    <Header></Header>
    <div v-if="currentPostFetched">

      <v-container class="page-width">
        <v-row>
          <v-col cols="3" class="d-none d-md-block">
          </v-col>

          <v-col cols="6" class="d-none d-md-block">
            <PostContainer :data="pageData" :writer="writer"></PostContainer>
          </v-col>

          <v-col cols="12" class="d-md-none">
            <PostContainer :data="pageData" :writer="writer"></PostContainer>
          </v-col>



          <v-col cols="3" class="d-none d-md-block">
          </v-col>
        </v-row>
      </v-container>
    </div>
    <Footer></Footer>
  </div>
</template>
<script setup>

import PageService from '~/service/PageService';

let pageData = ref({
      title: "",
      tags: [],
      content: "",
      cover_image : null
    });

let writer = ref({
  contact_name: "",
  handle: ""
})
let pageService = new PageService();

let route = useRoute();
let currentPostFetched = ref(false);

const fetchPosts = async () => {
  let postValue = await pageService.getPage(route.params.pageid);
  
  let model = {
    title: '',
    tags: [],
    content: postValue.news,
    cover_image : null
  }
  return model;
}

useAsyncData(async ()=>{
  let model = await fetchPosts();
  pageData.value = model;
  currentPostFetched.value = true;
});

</script>service/PageService