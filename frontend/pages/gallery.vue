<template>

  <div class="page">
    <UserProfileValid></UserProfileValid>
    <Header></Header>
    {{ myProfile?.handle }}
    <hr/>
    
    <h1>Your files</h1>
    <div>
      {{ fetchingInfo }}  
      <div v-for="file in files" :key="file.$id" class="d-inline-block" style="width: 100px; height: 100px;">
        <img :src="imageURLs[file.$id]" height="100"/>          
        <v-btn @click="deleteImage(file.$id)">Hapus</v-btn>
      </div>
    </div>

    <Footer></Footer>

  </div>

  
</template>
<script setup>
  
import { ref, reactive } from 'vue';
import PostsService from '~/service/PostsService';
import ProfilesService from '~/service/ProfilesService';
import AuthService from '~/service/AuthService';
import FilesService from '~/service/FilesService';
import ImageBucketService from '~/service/ImageBucketService'

definePageMeta({
  middleware: ["loggedin"]
})


const imageBucketService = new ImageBucketService();
const filesService = new FilesService();
const authService = new AuthService();


const files = ref([])
const myProfile = ref();
const fetchingInfo = ref("Fetching data")
let imageURLs = reactive({})

onMounted(async ()=>{
  myProfile.value = await authService.getUserSession();

  let data = (await filesService.getUserFiles(myProfile.value.$id));
  console.log(data.documents);
  files.value = data.documents;

  await data.documents.forEach(async element => {
      imageURLs[element.$id] = await imageBucketService.getImagePreview(element.$id);
  });

  fetchingInfo.value = "";
})

async function deleteImage(imageId) {

  var targetImageIndex = files.value.map(x => x.$id).indexOf(imageId)

  let data = await imageBucketService.deleteImage(imageId);

  // remove from array data
  files.value.splice(targetImageIndex, 1);
  imageURLs[imageId] = null;

}

</script>