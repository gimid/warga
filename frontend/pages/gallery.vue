<template>

  <div class="page">
    <UserProfileValid></UserProfileValid>
    <Header></Header>
    {{ myProfile?.handle }}
    <hr/>
    
    Your files

    {{ fetchingInfo }}
    <v-container fluid>
        <v-row dense>
          <v-col
            v-for="file in files"
            :key="file.$id"
          >
            <v-card :title="file.$id" height="200">
              <img :src="imageURLs[file.$id]" height="100"/>
          
              <v-btn @click="deleteImage(file.$id)">Hapus</v-btn>
            </v-card>
          </v-col>
        </v-row>
    </v-container>

    <Footer></Footer>

  </div>

  
</template>
<script setup>
  
import { ref, reactive } from 'vue';
import PostsService from '~/service/PostsService';
import ProfilesService from '~/service/ProfilesService';
import AuthService from '~/service/AuthService';
import ImageBucketService from '~/service/ImageBucketService'

definePageMeta({
  middleware: ["loggedin"]
})


const imageBucketService = new ImageBucketService();


const files = ref([])
const myProfile = ref();
const fetchingInfo = ref("Fetching data")
let imageURLs = reactive({})

onMounted(async ()=>{
  let data = (await imageBucketService.getImageList());
  files.value = data.files;

  await data.files.forEach(async element => {
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