<template>

<UserProfileValid></UserProfileValid>

  <v-app>
    <v-app-bar flat color="black">
      <v-container >
        <v-row>
          <v-col id="edit-top-bar">
            <v-icon icon="mdi-post" class="ma-2" style="color: var(--gim-teal);"></v-icon>
            
            <v-btn @click="showEditMode()" :variant="isEditMode?'outlined':'plain'" class="ma-1" style="color: var(--gim-teal);">
              Edit
            </v-btn>
            <v-btn @click="showPreviewMode()" :variant="!isEditMode?'outlined':'plain'"  class="ma-1" style="color: var(--gim-teal);">
              Pratinjau
            </v-btn>

            <v-btn class="float-right" @click.stop="goBack()">
              <v-icon small >mdi-close</v-icon>
            </v-btn>         
          </v-col>
        </v-row>

      

        <v-spacer></v-spacer>


      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">

      <v-container class="fill-height">
        <v-row class="fill-height w-100">



          <v-col style="max-width: 800px;">

            <v-sheet            
              rounded="lg"
            style="word-wrap: break-word;"
              class="fill-height"
              :class="editorclass"
            >
            
                <div id="editor" class="pa-3 fill-height">

                  <v-btn  v-if="!currentCoverImageURL" @click="uploadCoverBtn()">
                    Tambah gambar cover
                    <template v-slot:prepend>
                      <v-icon icon="mdi-image-area"></v-icon>
                    </template>
                  </v-btn>
                  <v-btn @click="resetCoverBtn()" v-else>
                    Hilangkan gambar cover
                    <template v-slot:prepend>
                      <v-icon icon="mdi-delete"></v-icon>
                    </template>
                  </v-btn>

                  <input v-on:change="inputcoverimagechanged" id="inputcoverimage" type="file" style="visibility: hidden;">

                  <v-row v-if="currentCoverImageURL" class="previewcovercontainer">
                    <div class="postcoverimage" :style="'background-image:url('+currentCoverImageURL+')'">

                    </div>
                  </v-row>

                  <v-textarea :auto-grow="true" 
                    placeholder = "Judul postingan di sini"
                    class="input-post-title"
                    rows="1"
                    hide-details
                    bg-color="clear"
                    variant="plain"
                    v-model="title"
                  >              
                  </v-textarea>

                  <v-row>
                    <v-col>
                      
                      <v-chip
                        v-for="(chip, index) in tags"
                        :key="index"
                        label
                        close
                        @click:close="removeChip(index)"
                        class="chip-tag float-left"
                      >
                        #{{ chip }}
                        <v-icon small @click.stop="removeChip(index)">mdi-close</v-icon>
                      </v-chip>

                      <div v-if="tags.length > 0"  class="float-left" style="display: inline-block; width: 6px; height: 1px;">
                        
                      </div>


                      <v-text-field v-if="tags.length < MAX_CHIPS"                      
                        v-model="newTag"
                        label="Tambah maksimum 4 tag"
                        @keydown.space="addChip"
                        @keydown.enter="addChip"
                        @keydown.tab="addChip"
                        @keyup.space="upChip"
                        @keyup.enter="upChip"
                        @keyup.tab="upChip"
                        density="compact"
                        single-line
                        hide-details
                        flat
                        solo
                        bg-color="white"
                        variant="plain"
                        class="float-left"
                        id="tag-input"
                      >        
                      </v-text-field>

                                  
                    </v-col>
                  </v-row>        
                  
                  <v-row>
                    <v-col >
                      <!--  -->
                      <div id="dropzonefull" style="visibility: hidden; opacity: 0;">
                        <v-container
                          class="fill-height"
                          fluid
                        >
                          <v-row
                            justify="center"
                          >
                            <v-col
                              cols="12"
                              sm="8"
                              md="4"
                            >
                              <div class="text-center" id="upload-text">
                                <h2>Lepas buat mengunggah file!</h2>
                                <div>
                                  Lepas file yang kamu seret ke sini buat diunggah
                                </div>
                              </div>
                            </v-col>
                          </v-row>
                        </v-container>
                      </div>

                      <MdEditor 
                        ref="editorRef"
                        placeholder="Tulis konten kamu di sini..."
                        v-model="editText"
                        :preview="false"
                        :toolbars="mdeditorToolbars"
                        @on-upload-img="handleUploadImage"
                        language="en-US"
                        noIconFont

                        :style="{height: windowHeight + 'px'}"
                        >
                        <template #defToolbars>
                          <NormalToolbar title="bold" @onClick="boldButtonHandler">
                            <template #trigger>
                              <v-icon icon="mdi-format-bold"></v-icon>
                            </template>
                          </NormalToolbar>
                          <NormalToolbar title="link" @onClick="linkButtonHandler">
                            <template #trigger>
                              <v-icon icon="mdi-link"></v-icon>
                            </template>
                          </NormalToolbar>
                          <NormalToolbar title="heading" @onClick="headingButtonHandler">
                            <template #trigger>
                              <v-icon icon="mdi-format-header-pound"></v-icon>
                            </template>
                          </NormalToolbar>
                          <NormalToolbar title="quote" @onClick="quoteButtonHandler">
                            <template #trigger>
                              <v-icon icon="mdi-format-quote-close"></v-icon>
                            </template>
                          </NormalToolbar>
                          <NormalToolbar title="image" @onClick="imageButtonHandler">
                            <template #trigger>
                              <v-icon icon="mdi-image"></v-icon>
                            </template>
                          </NormalToolbar>
                          <NormalToolbar title="code" @onClick="codeButtonHandler">
                            <template #trigger>
                              <v-icon icon="mdi-code-braces"></v-icon>
                            </template>
                          </NormalToolbar>
                          <NormalToolbar title="strikethrough" @onClick="strikethroughButtonHandler">
                            <template #trigger>
                              <v-icon icon="mdi-format-strikethrough"></v-icon>
                            </template>
                          </NormalToolbar>
                          <NormalToolbar title="mark" @onClick="embedButtonHandler">
                            <template #trigger>
                              <v-icon icon="mdi-sack-percent"></v-icon>
                            </template>
                          </NormalToolbar>
                        </template>

                      </MdEditor>

                    </v-col>
                  </v-row>
                </div>

            </v-sheet>

            <div v-if="!isEditMode" class="renderedcontainer">
              <div v-if="!published && previewURL">
                <v-card class="py-2 px-2 my-2 text-caption">
                  Postingan ini sudah tersimpan, tetapi belum dipublikasikan. Kamu bisa membagikannya ke teman kamu dengan link rahasia ini: <Nuxt-Link :to="previewURL"> Link Rahasia </Nuxt-Link>
                </v-card>
              </div>
              <PostContainer :data="previewPost" :writer="writer" showSeries="false"></PostContainer>
            </div>
            <!-- <v-col >
            </v-col> -->
            <!-- <v-row>
            </v-row> -->

          </v-col>

        </v-row>


      </v-container>

      <v-bottom-navigation>
        <v-btn @click="publishPost" v-if="currentId && !published">
          PUBLIKASIKAN
          <template v-slot:prepend>
            <v-icon icon="mdi-publish"></v-icon>
          </template>
        </v-btn>
  
        <v-btn @click="savePost" v-if="!published">          
          SIMPAN
          <template v-slot:prepend>
            <v-icon icon="mdi-content-save"></v-icon>
          </template>
        </v-btn>

        <v-btn @click="savePost" v-if="published">          
          PERBAHARUI
          <template v-slot:prepend>
            <v-icon icon="mdi-update"></v-icon>
          </template>
        </v-btn>

        <v-btn @click="seriesoverlay = !seriesoverlay">
          PENGATURAN
          <template v-slot:prepend>
            <v-icon icon="mdi-nut"></v-icon>
          </template>
        </v-btn>
      </v-bottom-navigation>

      <v-overlay
        :model-value="loadingoverlay"
        class="align-center justify-center"
        persistent
      >
        <v-card  v-if="uploadErrorMessage" title="Terjadi kesalahan" width="300">
          <v-container>
            <v-row justify="center">
              <div>                
                <v-alert type="error">{{uploadErrorMessage}}</v-alert>
                <v-btn @click="dismissError">OK</v-btn>
              </div>
            </v-row>
          </v-container>
        </v-card>

        <v-card v-if="!uploadErrorMessage"  title="Mengunggah gambar" width="300" style="height: 100px;">
          <v-container>
            <v-row justify="center" style="height: 30px;">
              <v-progress-circular
                :model-value="uploadPercentage"
                color="green"
                style="margin: auto;"
              ></v-progress-circular>
            </v-row>
          </v-container>
        </v-card>
      </v-overlay>

      
      <v-overlay
        :model-value="seriesoverlay"
        @click:outside="seriesoverlay = false"
        class="align-center justify-center"
      >
      <v-card title="Pengaturan" subtitle="Opsi tambahan untuk postingan ini" width="400">
        <v-container>

          <v-row v-if="seriesLoading" class="text-center">
            <v-col>
              <v-progress-circular
                :model-value="uploadPercentage"
                color="var(--gim-teal)"
                style="margin: auto;"
                indeterminate
              ></v-progress-circular>
            </v-col>
          </v-row>

          <v-row v-if="!seriesLoading">
            <v-col>
              <h3>Serangkai</h3>
              
              <div v-if="currentSeriesId">
                Postingan ini rangkaian dari:
              </div>

              <div v-if="currentSeriesId" >
                  <v-row v-if="!editingSeries" no-gutters>
                    <v-col class="d-flex">
                      <h2>{{ seriesStore.getSeriesWithId(currentSeriesId).title }}</h2>
                    </v-col>
                  </v-row>
                  <v-row v-if="!editingSeries">
                    <v-col>
                      <v-btn @click="renameSeries" prepend-icon="mdi-pencil" variant="outlined" rounded="1" class="mr-1" block>Edit</v-btn>
                    </v-col>
                    <v-col>
                      <v-btn @click="deleteSeries" prepend-icon="mdi-delete" variant="outlined" rounded="1" block>Hapus</v-btn>
                    </v-col>
                    <v-col>
                      <v-btn @click="removeSeries" prepend-icon="mdi-cards-outline" variant="outlined" rounded="1" block>Ganti</v-btn>
                    </v-col>
                  </v-row>
                  
                  <v-row v-if="editingSeries" no-gutters>
                    <v-col class="d-flex">
                      <v-text-field v-model="currentEditingSeriesInput"></v-text-field>
                    </v-col>                    
                  </v-row>
                  <v-row v-if="editingSeries" no-gutters>
                    <v-col class="mr-2">
                      <v-btn @click="confirmRenameSeries" prepend-icon="mdi-check" variant="outlined" rounded="1" class="ma-1 float-right" block></v-btn>
                    </v-col>
                    <v-col>
                      <v-btn @click="editingSeries = false" prepend-icon="mdi-close" variant="outlined" rounded="1" class="ma-1 float-right" block></v-btn>
                    </v-col>
                  </v-row>
              </div>
              <div v-else>
                <v-row>
                  <v-col>
                    <div>
                      Apakah postingan ini bagian dari sebuah rangkaian? Berikan nama unik untuk rangkaian ini
                    </div>
                    <v-combobox
                      
                      density="compact"
                      label="Pilih rangkaian"
                      :items="seriesStore.series"
                      :hide-no-data="false"
                      v-model="seriesInputName"
                      >
                        <template v-slot:no-data>
                          <div style="overflow: hidden;">
                            <v-row v-if="seriesInputName">
                              <v-container>
                                <v-row justify="center">
                                  <v-col class="d-flex justify-center">
                                      Tidak ditemukan rangkaian&nbsp<strong>{{ seriesInputName }}</strong>
                                  </v-col>
                                </v-row>
                                <v-row justify="center">
                                  <v-col class="d-flex justify-center">
                                      <v-btn prepend-icon="mdi-plus" @click="addSeries">Buat baru</v-btn>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-row>
                            <v-row v-else>
                              <v-container >
                                <v-row justify="center">
                                  <v-col class="d-flex justify-center" style="color:#838383;">
                                    <v-icon icon="mdi-magnify"></v-icon>  
                                    <i class="text-caption">Ketikkan nama rangkaian yang ingin kamu cari</i>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-row>
                          </div>
                        </template>
    
                        <template v-slot:item="{ item, index, props }">
                          <div block variant="text" class="text-left pa-3 series-dropdown-item" @click="applySeries(item.value)">
                            {{item.title}}
    
                          </div>
                        </template>
    
                        <!-- <template v-slot:append>
                          <v-btn @click="applySeries" icon="mdi-check" variant="outlined"></v-btn>
                        </template> -->
                      </v-combobox>
                    </v-col>
                </v-row>

                


              </div>

              <v-row>
                <v-col>
                  <hr/>
                </v-col>
              </v-row>
              <!-- <v-btn width="100%" @click="console.log(seriesInputName)"></v-btn> -->
              <!-- <v-btn width="100%" @click="seriesoverlay = !seriesoverlay">Selesai</v-btn> -->
              

              
              <div class="mb-5"></div>
              
              <v-btn  v-if="published || currentId" width="100%" @click="dangerAreaVisible = !dangerAreaVisible" color="red" variant="outlined" class="mb-2" :prepend-icon="dangerAreaVisible?'mdi-unfold-more-horizontal':'mdi-unfold-less-horizontal'">Danger Area</v-btn>
              <div v-if="dangerAreaVisible">
                <v-btn v-if="published" width="100%" @click="unpublishPost()" color="red" outlined class="mb-2">Tarik Publikasi</v-btn>              
                <v-btn v-if="currentId" width="100%" @click="deletePost()" color="red" outlined >Hapus Post</v-btn>
              </div>
              <div class="text-caption text-grey">
                post id: {{ currentId }}
              </div>
            </v-col>
          </v-row>          
        </v-container>
      </v-card>
      </v-overlay>
    </v-main>
  </v-app>

</template>

<script setup>

import { ref, reactive, computed, onMounted } from 'vue';
import {markedEmojiBoldPatch} from '../libraries/markedEmojiBoldPatch.js'

import { useRouter } from 'vue-router';
import {marked} from '../libraries/marked.js'

import {NormalToolbar, MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

import PostsService from '~/service/PostsService';
import ImageBucketService from '~/service/ImageBucketService';
import ProfilesService from '~/service/ProfilesService';
import SeriesService from '~/service/SeriesService';
import { storeToRefs } from 'pinia';

definePageMeta({
  middleware: ["loggedin"]
})

const router = useRouter();
const MAX_CHIPS = 4;

const title = ref('');
const tags = ref([]);
const newTag = ref('');
const published = ref(false)
const currentId = ref('');
const currentCoverImageURL = ref("");

const editText = ref("post");
const isEditMode = ref(true);
const editorclass = ref("");

const seriesoverlay = ref(false);
const loadingoverlay = ref(false)
const editorRef = ref();
const previewPost = ref({});
const writer = ref({});

const uploadPercentage = ref(0);
const uploadErrorMessage = ref("asd");

const postsService = new PostsService();
const imageBucketService = new ImageBucketService();
const profilesService = new ProfilesService();
const seriesService = new SeriesService();

const windowHeight = ref(700);

const isMdAndUp = computed(() => $vuetify.breakpoint.mdAndUp);

const mdeditorToolbars = ref([
                              // 'bold',
                              // 'link',
                              // 'orderedList',
                              // 'unorderedList',
                              // 'title',
                              // 'quote',
                              // 'image',
                              // 'code',
                              // 'strikeThrough',
                              0,
                              1,
                              2,
                              3,
                              4,
                              5,
                              6,
                              7,
                              8])

var lastTarget = null;

const profileStore = useProfileStore();
const seriesStore = useSeriesStore();
const seriesStoreRef = storeToRefs(seriesStore);

const websiteURL = ref("");
const previewURL = ref("");
const currentUsername = ref("");
const currentPreviewKey = ref("");
const dangerAreaVisible = ref(false);

// series
const currentSeriesId = ref("");
const seriesInputName = ref("");
const editingSeries = ref(false);
const currentEditingSeriesInput = ref("");
const seriesLoading = ref(false);

onMounted(async ()=>{
  
  window.addEventListener("dragenter", onDragEnter);
  window.addEventListener("dragleave", onDragLeave)
  window.addEventListener("dragover", onDragOver);
  window.addEventListener("drop", onDrop, false)
  window.addEventListener("resize", onResize);

  // editText.value = "";
  let currentRoute = router.currentRoute.value;
  if(currentRoute.name == "editpost") {

    currentUsername.value = currentRoute.params.username;

    const postId = currentRoute.params.postid;

    await fetchPost(postId);

    await fetchUserSeries();

  }else{
    // new post
    editText.value = "";
  }

  resizeEditorToWindow();

});

onUnmounted(()=>{
  window.removeEventListener("dragenter", onDragEnter);
  window.removeEventListener("dragleave", onDragLeave)
  window.removeEventListener("dragover", onDragOver);
  window.removeEventListener("drop", onDrop, false)
  window.removeEventListener("resize", onResize);
})

function hideDrop() {
  document.querySelector("#dropzonefull").style.visibility = "hidden";
  document.querySelector("#dropzonefull").style.opacity = 0;
}

function showDrop() {
  document.querySelector("#dropzonefull").style.visibility = "";
  document.querySelector("#dropzonefull").style.opacity = 1;
}

const fetchPost = async (postId) => {

  let fetchPost = (await postsService.getOwnedPostByIdDirect(postId));

  let postData = fetchPost;

  title.value = postData.title;
  tags.value = postData.tags;
  editText.value = postData.content;
  currentId.value = postData.$id;
  published.value = postData.published;
  currentPreviewKey.value = postData.preview_key
  currentCoverImageURL.value = postData.cover_image;

  updatePreviewURL();
  await fetchUserSeries();
  await fetchCurrentPostSeries();
}

const fetchCurrentPostSeries = async () => {
  let seriesId = await seriesService.getSeriesWithPostId(currentId.value);

  if (seriesId.total > 0) {
    currentSeriesId.value = seriesId.documents[0].$id;

    seriesInputName.value = seriesStore.getSeriesWithId(currentSeriesId.value);
  }else{
    currentSeriesId.value = null;
    seriesInputName.value = null;
  }

}

const fetchUserSeries = async () => {
  await seriesService.getUserSeries();
}


const addChip = () => {
  if (newTag.value.trim() !== '') {
    if (tags.value.length < MAX_CHIPS) {
      tags.value.push(newTag.value.trim());
      newTag.value = '';
    }
  }
};

const upChip = () => {
  newTag.value = '';
}

const removeChip = (index) => {
  tags.value.splice(index, 1);
};


const handleMouseUp = () => {
  selectedText.value = getSelectionText();
}

const showPreviewMode = async () => {
  isEditMode.value = false;

  let previewData = null;

  previewData = {
    title: title.value,
    tags: tags.value,
    content: editText.value,
  }
  if (currentCoverImageURL.value){
    previewData['cover_image'] = currentCoverImageURL.value
  }

  previewPost.value = previewData;

  writer.value = {
    contact_name: profileStore.profile.data.contact_name,
    handle: profileStore.profile.data.handle,
  }

  editorclass.value = "hideeditor";
}

const showEditMode = () => {
  isEditMode.value = true;
  editorclass.value = "showeditor";
}


function wait(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

const handleUploadImage = async (files, callback) => {
  // Get the files and upload them to the file server, then insert the corresponding content into the editor
  await wait(2000)


  callback(['https://lh3.googleusercontent.com/ogw/AOLn63F0qEEEWc3OXY1d01BqM8Z7nJYz0WaJQaDPp4LM=s32-c-mo']);
}

const embedButtonHandler = () => {
  editorRef.value?.insert((selectedText) => {
    return {
      targetValue: `{% embed ${selectedText} %}`,
      select: true,
      deviationStart: 0,
      deviationEnd: 0
    }
  })
}

const boldButtonHandler = () => {
  editorRef.value?.insert((selectedText) => {
    return {
      targetValue: `**${selectedText}**`,
      select: true,
      deviationStart: 0,
      deviationEnd: 0
    }
  })
}

const linkButtonHandler = () => {
  editorRef.value?.insert((selectedText) => {
    return {
      targetValue: `[${selectedText}](${selectedText})`,
      select: true,
      deviationStart: 0,
      deviationEnd: 0
    }
  })
}

const headingButtonHandler = () => {
  editorRef.value?.insert((selectedText) => {

    let returnText = '';
    if (selectedText[0] == '#')  {
      returnText = `#${selectedText}`;
    }else{
      returnText = `# ${selectedText}`;
    }

    return {
      targetValue: returnText,
      select: true,
      deviationStart: 0,
      deviationEnd: 0
    }
  })
}

const quoteButtonHandler = () => {
  editorRef.value?.insert((selectedText) => {

    let returnText = '';
    if (selectedText[0] == '>')  {
      returnText = `>${selectedText}`;
    }else{
      returnText = `> ${selectedText}`;
    }

    return {
      targetValue: returnText,
      select: true,
      deviationStart: 0,
      deviationEnd: 0
    }
  })
}

const imageButtonHandler = () => {
  editorRef.value?.insert((selectedText) => {

    return {
      targetValue: `![${selectedText}](${selectedText})`,
      select: true,
      deviationStart: 0,
      deviationEnd: 0
    }
  })



}

const codeButtonHandler = () => {
  editorRef.value?.insert((selectedText) => {

    return {
      targetValue: `\`\`\`\n${selectedText}\n\`\`\``,
      select: false,
      deviationStart: 0,
      deviationEnd: 0
    }
  })
}

const strikethroughButtonHandler = () => {
  editorRef.value?.insert((selectedText) => {

    return {
      targetValue: `~~${selectedText}~~`,
      select: false,
      deviationStart: 0,
      deviationEnd: 0
    }
  })  
}


const oninputchange = (text, html) => {

}

const goBack = () => {
  router.back();
}


const publishPost = async () => {

  
  if (currentId.value !== '') {
    // var post = await postsService.publishPost(currentId.value);
    
    published.value = true;
    await savePost();

    updatePreviewURL();
  }

}

const unpublishPost = async () => {
  if (currentId.value !== '') {
    // var post = await postsService.publishPost(currentId.value);
    
    published.value = false;
    await savePost();

    updatePreviewURL();
  }
}

const deletePost = async () =>{
  try{
    var deletePost = await postsService.deletePost(currentId.value);

    // wait until user's post deleted
    let userData = null;
    let error = false;

    console.log("DELETING POST");
    do {
      try{
        userData = await postsService.getPostFromPostUsers(currentId.value);
        console.log("userData:");
        console.log(userData);
      }catch(e){
        error = true;
        console.log(e);
      }
    }while(userData !== null || !error)

    router.push("/dashboard");
  }catch(e){
    console.log(e);
  }
}

const savePost = async () => {


  
  if (currentId.value == '') {
    // create post
    let data = {
      content: editText.value,
      title: title.value,
      tags: tags.value,
      published: published.value,
      user_id: profileStore.profile.data.$id,
      cover_image: currentCoverImageURL.value
    }
  
    var post = await postsService.createPost(data);
    currentId.value = post.$id;
    currentPreviewKey.value = post.preview_key;

    let userdata = await profilesService.getProfileFromUserID(post.user_id);
    currentUsername.value = userdata.handle;

  }else{
    let data = {
      content: editText.value,
      title: title.value,
      tags: tags.value,
      $id: currentId.value,
      published: published.value,      
      // user_id: profileStore.profile.data.$id,
      cover_image: currentCoverImageURL.value
    }
    
    
    var post = await postsService.updatePost(data);   
    currentPreviewKey.value = post.preview_key;

    let userdata = await profilesService.getProfileFromUserID(post.user_id);
    currentUsername.value = userdata.handle;

  }


  updatePreviewURL();
}

const uploadCoverBtn = async () => {
   let fileInput = document.getElementById("inputcoverimage");
  fileInput.click();
}

const resetCoverBtn = async () => {

  let fileIdPattern = /\/files\/([a-f0-9]+)\/view/;
  let bucketPattern = /\/buckets\/([a-f0-9]+)\/files/;

  try {
    let fileIdMatch = currentCoverImageURL.value.match(fileIdPattern);
    if(fileIdMatch) {
      let fileId = fileIdMatch[1];
      await imageBucketService.deleteImage(fileId);
    }
  }catch(e){
    console.log(e);
  }
  
  currentCoverImageURL.value = "";
  await savePost();

}

const inputcoverimagechanged = async (event) => {
  let fileInput = document.getElementById("inputcoverimage");  
  let preview = document.getElementById("previewcoverimage");
  
  let imageFile = event.target.files[0];
  
  let coverImage = await uploadImage(imageFile)
  let coverImageView = await imageBucketService.getImageView(coverImage.$id);
  currentCoverImageURL.value = coverImageView.href;

  await savePost();
  
  // preview.onload = function () {
  //   URL.revokeObjectURL(preview.src);
  // }
}

const uploadError = async (file, message, xhr) => {
  if (message instanceof Object){   // サーバ側でエラーの場合はObjectが来る
    file.previewElement.querySelectorAll('.dz-error-message span')[0].textContent = message.message
  }
}

const uploadFlow = async (file) => {
  loadingoverlay.value = true;

  try {
    let uploadedFile = await uploadImage(file);  
    let imageView = await imageBucketService.getImageView(uploadedFile.$id);
    // add to editor
    editorRef.value?.insert((selectedText) => {
      return {
        targetValue: `![${selectedText}](${imageView.href})`,
        select: true,
        deviationStart: 0,
        deviationEnd: 0
      }
    })
  }catch(e) {
    uploadErrorMessage.value = e;
    console.log(e);
    // loadingoverlay.value = false;
  }


}

const onDragEnter = (e) => {
  e.preventDefault();
  lastTarget = e.target;  
  showDrop();
}

const onDragLeave = (e) => {
  e.preventDefault();
    if(e.target === lastTarget || e.target === document) {
      hideDrop();
    };
}

const onDragOver = (e) => {
  e.preventDefault();
}

const onDrop = (e) => {
  e.preventDefault();

  if  (e.dataTransfer.files.length == 1) {
    let dt = e.dataTransfer;
    let file = dt.files[0];
    uploadFlow(file);
  }
  hideDrop();
}

const onResize = (e) => {
  resizeEditorToWindow();
}

const resizeEditorToWindow = () => {
  windowHeight.value = window.innerHeight - 340;
}

const uploadImage = async (imageData) => {
  loadingoverlay.value = true;
  let item = await imageBucketService.uploadItem(imageData, onProgress => {
    uploadPercentage.value = onProgress;
  });
  console.log(item);
  loadingoverlay.value = false;

  return item;
}

const dismissError = () => {
  uploadErrorMessage.value = "";
  loadingoverlay.value = false;
}


const updatePreviewURL = () => {
  previewURL.value = "/@"+currentUsername.value +"/" + currentId.value +"?preview_key=" + currentPreviewKey.value;
}

const addSeries = async () => {
  seriesLoading.value = true;
  let newSeries = await seriesService.createSeries(seriesInputName.value);
  seriesLoading.value = false;

  applySeries(newSeries);
}

const applySeries = async (value) => {
  seriesLoading.value = true;
  seriesInputName.value = value;

  await savePost();

  console.log(seriesInputName);
  if (seriesInputName.value.$id){
    if (currentId.value){
      let applyPost = await seriesService.seriesAddPostMember(seriesInputName.value.$id, currentId.value);
      console.log(applyPost)

      await fetchCurrentPostSeries();
    }else{
      console.log("This post doesn't have id");
    }
  }
  seriesLoading.value = false;
}

const removeSeries = async () => {
  seriesLoading.value = true;
  if (seriesInputName.value.$id){
    if (currentId.value){
      let applyPost = await seriesService.seriesRemovePostMember(seriesInputName.value.$id, currentId.value);
      console.log(applyPost)

      await fetchCurrentPostSeries();
    }else{
      console.log("This post doesn't have id");
    }
  }
  seriesLoading.value = false;
}

const deleteSeries = async (series_id) => {
  seriesLoading.value = true;

  if (seriesInputName.value.$id){
    if (currentId.value){
      let applyPost = await seriesService.deleteSeries(seriesInputName.value.$id);
      console.log(applyPost)

      await fetchCurrentPostSeries();
    }else{
      console.log("This post doesn't have id");
    }
  }
  seriesLoading.value = false;
}

const renameSeries = async () => {
  seriesLoading.value = true;
  currentEditingSeriesInput.value = seriesStore.getSeriesWithId(currentSeriesId.value).title;
  editingSeries.value = true;
  seriesLoading.value = false;
}

const confirmRenameSeries = async () => {
  seriesLoading.value = true;
  await seriesService.updateSeries(currentSeriesId.value, currentEditingSeriesInput.value);
  editingSeries.value = false;
  seriesLoading.value = false;
}

</script>

<style >


.input-post-title .v-field__input{
  font-size: 1.5em;
  font-weight: bold;
}

.chip-tag:first-child{
  margin-left: 0px;
  margin-right: 0px;
}

.chip-tag:not(:first-child):not(:last-child){
  margin-left: 5px;
}

.chip-tag:last-child:not(:first-child){
  margin-left: 5px;
  margin-right: 5px;
}

.v-md-editor {
  box-shadow: none;
}
/* 
.v-md-textarea-editor textarea {
  scale: 1,2;
} */

.v-md-editor__toolbar-item {
  font-size: 22px;
  color: #000;
}

#tag-input {
  width: 200px;
}

.v-input--density-compact .v-field--variant-plain, .v-input--density-compact .v-field--variant-underlined{
  --v-input-chips-margin-bottom: 4px;
  --v-input-padding-top: 4px;
}

.v-text-field--plain-underlined {
    --v-field-padding-top--plain-underlined: 2px;
}

/* .renderedcontainer{
  padding: 15px;
} */

.rendered-text{
  margin-top: 5px;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

.tagscontainer {
  margin-top: 5px;
}

.md-editor-footer{
  display: none;
}

.cm-line{
  font-size: 17px;
}

.md-editor-icon{
  height: 30px;
  width: 30px;
}

.md-editor-toolbar-wrapper{
  height: 40px;
}

.md-editor-toolbar-item{
  height: 40px;
}

.emoji {
  font-style: normal;
  font-weight: normal;
}

#parsed-text ul{
  padding-left: 1.3em;
}

#parsed-text {
  padding: 50px;
  font-size: 1.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

#parsed-text hr{
  width: 50%;
  opacity: 0.1;
  border-radius: 5px;
  border: 1px solid #000;
  margin: 30px auto;
}

#parsed-text p{
  margin: 10px 0 10px 0;
}

#dropzonefull {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999999999;
  width: 100%;
  height: 100%;
  background-color: rgba(48, 213, 200, 0.7);
  transition: visibility 175ms,  opacity 175ms;
  color: white;
}

#upload-text{
  border: dashed 1px #fff;
  padding: 30px;
  border-radius: 15px;
}

.showeditor{

}

.hideeditor{
  display: none;
}

.series-dropdown-item{
  cursor: default;
}

.series-dropdown-item:hover{
  background-color: var(--gim-teal);
}



</style>