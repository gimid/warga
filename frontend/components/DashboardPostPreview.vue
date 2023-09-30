<template>
  <NuxtLink class="dashboard-post-link" :href="linkUrl">    
    <v-container>            
      <v-row class="elevation-1 rounded text-top dashboard-post-container" style="vertical-align: top">
        <v-col>
          <h2 class="post-title">
            {{ post.title }}
          </h2>
          <div class="text-grey text-button">
            <b>Edited</b> {{ formatDate(post.$updatedAt) }}
          </div>
        </v-col>
        <v-col cols="2">
          <v-btn prepend-icon="mdi-pencil" :to="'@'+post.user_handle+'/'+post.$id+'/edit'" variant="tonal" class="mx-1 float-right">
            Edit
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </NuxtLink>
</template>

<script setup>
import ProfilesService from '~/service/ProfilesService';
const profilesService = new ProfilesService();
const props = defineProps(['post']);
const linkUrl = ref("");

onMounted(async ()=>{
  await getLink(props.post);
})

const formatDate = (date) => {
  var formattedDate = new Date(date);

  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formattedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const getLink = async (post)=>{
  const returnData = await profilesService.getProfileFromUserID(post.user_id);  
  const link = '/@' + returnData.handle + "/" + post.$id;
  linkUrl.value = link;
}
</script>

<style>
.dashboard-post-link{
  text-decoration: none;
  color: black;

  font-family: var(--ff-sans-serif);
}

.dashboard-post-container{
  background-color: white;
}

.dashboard-post-container:hover{
  background-color: aquamarine;
}


.dashboard-post-link .post-title:hover{
  text-decoration: underline;
}

</style>