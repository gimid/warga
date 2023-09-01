<template>
  <div v-if="canEdit" class="edit-container">
    <v-btn  prepend-icon="mdi-pencil" :to="currentRoute.path+'/edit'" variant="outlined" class="mx-2 my-2 edit-btn">
      Edit
    </v-btn>    
  </div>
</template>

<script setup>
import PostsService from '~/service/PostsService';
import AuthService from '~/service/AuthService';

const props = defineProps(['currentRoute','data'])

let postService = new PostsService();

let canEdit = ref(false);

onMounted(async ()=>{
  // check can edit

  const authService = new AuthService();
  let currentUser = await authService.getUserSession();

  if(props.data.$id){
    let ownedpost = await postService.getOwnedPostByIdDirect(props.data.$id)
  
    if (ownedpost != null) {
      if (currentUser.$id == ownedpost.user_id){
        canEdit.value = true;
      }else{
        canEdit.value = false;
      }

    }else{
      canEdit.value = false;
    }
  }


});

</script>

<style>

.edit-container{
  background-color: var(--gim-teal);
  width: 110px;
  height: 55px;
  position: fixed;
  bottom: 0;
  margin-left: 30px;
  margin-bottom: -1px;
  z-index: 999;
  border-radius: 5px 5px 0 0;
}

</style>