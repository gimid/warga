<template>
  <div class="page">
    <Header></Header>

      <v-container class="page-width">
        <v-row>
          <v-col cols="1" class="d-none d-md-block">
          </v-col>

          
          <v-col cols="10" class="d-none d-md-block">
            <PostContainer :data="pageData" :writer="writer"></PostContainer>
          </v-col>
          
          <v-col cols="12" class="d-md-none">
            <PostContainer :data="pageData" :writer="writer"></PostContainer>
          </v-col>
          
          
          
          <v-col cols="3" class="d-none d-md-block">
          </v-col>
        </v-row>
      </v-container>
    <v-col>
      <!-- {{ pageData }}
      {{ writer }} -->
    </v-col>
    <Footer></Footer>
  </div>
</template>
<script setup>

import PageService from '~/service/PageService';
let pageService = new PageService();

let route = useRoute();


const fetchPosts = async () => {
  console.log("FETCH DONG");
  let postValue = await pageService.getPage(route.params.pageid);
  
  console.log(postValue)

  let model = {
    key: postValue.key,
    tags: [],
    content: postValue.news,
    cover_image : null
  }
  return model;
}

let writer = ref({
  contact_name: "",
  handle: ""
})

const {data: pageData, refresh: refreshCurrentPage} = await useAsyncData('page', async () => await fetchPosts());

useSeoMeta({
  title: pageData.value.key
})



</script>