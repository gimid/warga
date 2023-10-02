<template>
  <div class="page">
    <Header></Header>

    <v-container class="page-width">
      <v-row >
        <ClientOnly>
          <v-col :cols="windowWidth > 1000?3:0" :class="windowWidth < 1000? 'd-none':''" v-cloak>
            <v-card class="link-card my-2 px-3 py-2 post-preview-container">

              <div>
                <ul class="sidebar-menu">
                  <li>
                    <NuxtLink to="p/about" class="text-h7">
                      <v-icon icon="mdi-information-outline" class="mr-2"/>
                      Tentang
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="p/privacy" class="text-h7">
                      <v-icon icon="mdi-glasses" class="mr-2"/>
                      Kebijakan Privasi
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="p/terms" class="text-h7">
                      <v-icon icon="mdi-tie" class="mr-2"/>
                      Ketentuan
                    </NuxtLink>
                  </li>
                </ul>
              </div>

              <div>
                <hr/>
              </div>

              <div>
                <NuxtLink href="https://github.com/gimid" style="text-decoration: none; color: #000;">
                  <div class="d-inline-block mr-2" style="vertical-align: top;">
                    <v-icon icon="mdi-github" size="30"></v-icon>
                  </div>  
                </NuxtLink>

                <NuxtLink href="https://tiktok.com/@gimiddev">
                  <div class="d-inline-block mr-2" style="vertical-align: top;">
                    <svg role="img" viewBox="0 0 24 24" width="28px" xmlns="http://www.w3.org/2000/svg"><title>TikTok</title><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </div>  
                </NuxtLink>

                <NuxtLink href="/@gimid">
                  <div class="d-inline-block mr-2" style="vertical-align: top;">
                    <gimidico style="width: 30px; height: 30px; filter: brightness(0%);"></gimidico>
                  </div>  
                </NuxtLink>


              </div>


            </v-card>
          </v-col>

      

        </ClientOnly>
      
        <v-col :cols="windowWidth > 1000?6:12">

          <v-container>
            <v-row >
              <v-col>
                <div>
                  <ul id="post-type-menu">
                    <li :class="route.query.list == 'all'||!route.query.list? 'post-type-selected':''">
                      <NuxtLink href="?list=all">
                        Semua
                      </NuxtLink>
                    </li>
                    <li :class="route.query.list == 'curated' ? 'post-type-selected':''">
                      <NuxtLink href="?list=curated">
                        Terkurasi
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>

            <div v-if="dataAvailable">
              <div v-if="posts.length <= 0" v-for="i in 10">
                <v-skeleton-loader type="article" class="mt-3 mb-3"></v-skeleton-loader>
              </div>
              <div v-else v-for="userPost in posts">
                <PostPreview :data="userPost"></PostPreview>
              </div>
              <div v-if="posts.length > 0 && moreAvailable">
                <v-btn @click="loadMore" block>Muat lagi</v-btn>
              </div>
            </div>
            <div v-else>
              <div class="">
                <v-card class="my-2 px-10 py-2">
                  <h2>Segera hadir!</h2>
                  Di sini akan muncul postingan-postingan terkurasi yang dimasukkan secara manual sama GIMin
                </v-card>
              </div>
            </div>

          </v-container>

          
        </v-col>
        <v-col cols="3" class="d-none d-sm-block">
        </v-col>
        <!-- <v-col cols="6">
          <div v-for="userPost in postdata.posts">
            <PostPreview :data="userPost"></PostPreview>
          </div>
        </v-col>
        <v-col  cols="3" class="d-none d-sm-block">
        </v-col> -->
        
      </v-row>
    </v-container>

    <Footer></Footer>
  </div>
</template>

<script setup>
import PostsService from '../service/PostsService';
import { storeToRefs } from 'pinia';

import gimidico from "~/assets/gimid.svg";
// let gimidico = requ("~/assets/gimid.svg")

const postsService = new PostsService();

let posts = ref([]);
const windowWidth = ref(0);
const lastPost = ref();
const postListType = ref("all");
const route = useRoute();

const dataAvailable = ref(true);

const moreAvailable = ref(true);

useSeoMeta(
  {
    title: "GIMid"
  }
)

onMounted(async () => {
  window.addEventListener("resize", onResize);
  resizeEditorToWindow();
  
  updateFetchedList(); 
});



onUpdated(()=>{
  updateFetchedList();
})

const updateFetchedList = async () =>{
  if (route.query.list) {
    if (route.query.list == 'all') {
      dataAvailable.value = true;
      let homepagePosts = await postsService.getHomepagePosts();
  
      if (homepagePosts) {
        posts.value = homepagePosts;
        lastPost.value = homepagePosts[homepagePosts.length-1];
      }
    }else if (route.query.list == 'curated') {
      dataAvailable.value = false;
      posts.value = [];
      lastPost.value = [];
    }
  }else{
    // fallback
    dataAvailable.value = true;
    let homepagePosts = await postsService.getHomepagePosts();

    if (homepagePosts) {
      posts.value = homepagePosts;
      lastPost.value = homepagePosts[homepagePosts.length-1];
    }
  }
}

const loadMore = async () => {
  console.log("----more ----");

  console.log(lastPost.value)

  let morePosts = null;
  if(lastPost.value){
    morePosts = await postsService.getHomepagePosts(lastPost.value.$id)
  }else{
    morePosts = await postsService.getHomepagePosts()
  }

  if (morePosts.length <= 0) {
    moreAvailable.value = false;
  }else{
    posts.value = posts.value.concat(morePosts);
    lastPost.value = morePosts[morePosts.length-1];
  }
}

onUnmounted(()=>{
  window.removeEventListener("resize", onResize);
});

const onResize = (e) => {
  resizeEditorToWindow();
}

const resizeEditorToWindow = () => {
  windowWidth.value = window.innerWidth;
}

</script>

<style>

  #post-type-menu a{
    text-decoration: none;
    color: black;
  }
 
  #post-type-menu li{
    list-style-type: none;
    display: inline-block;
    font-weight: bold;
  }

  #post-type-menu a:hover{
    color: var(--gim-teal-dark);
    cursor: pointer;
  }

  .post-type-selected{
    color: var(--gim-teal-dark);
    border-bottom: 1px solid var(--gim-teal-dark);
  }


  .sidebar-menu {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .sidebar-menu li{
    list-style: none;
    margin-left: 0;    
  }

  .sidebar-menu a{
    text-decoration: none;
    color: black;
  }

  .sidebar-menu a:hover{
    color: var(--gim-teal-dark)
  }
</style>