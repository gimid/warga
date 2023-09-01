<template>
  <div v-if="isUploading && !isCommenting" id="pre-comment-editor-container" class="pa-2 comment-container" style="height: 100px;">
    <v-container>
      <v-row justify="center" style="margin: auto;">
        <v-progress-circular
          :model-value="uploadPercentage"
          color="var(--gim-teal)"
          style="margin: auto;"
          indeterminate
        ></v-progress-circular>
      </v-row>
    </v-container>
  </div>

  <div v-if="!isCommenting" id="pre-comment-editor-container" class="pa-2 comment-container">
    <div style="outline: solid 1px #e0e0e0; height: 80px;" class="pa-3 text-black rounded" @click="startEditComment">
      Gabung diskusi...
    </div>
  </div>

  <div v-if="isCommenting" id="comment-editor-container" class="pa-2 comment-container">
    <WMDEditor
      ref="editorRef"
      v-model:edit-text-model-value="editText"
      :edit-text-model="editText"
      @on-change="onChange"
      
      :resize-editor-to-window="false"
      :show-preview="false"
      height="230"
      
      v-model:is-editing-text-model-value="isEditMode"
      :is-editing-text-model="isEditMode">
    </WMDEditor>

    <v-btn v-if="!isEditPreviousCommentMode" class="" color="var(--gim-teal)" @click="postComment">Post</v-btn>
    <v-btn v-if="isEditPreviousCommentMode" class="" color="var(--gim-teal)" @click="updateComment">Perbaharui</v-btn>

    <v-btn v-if="isEditMode" class="ma-3" variant="outlined" color="grey" @click="showPreviewMode">Pratinjau</v-btn>
    <v-btn v-if="!isEditMode" class="ma-3" variant="outlined" color="grey" @click="showEditMode">Edit</v-btn>


    <v-btn v-if="isEditPreviousCommentMode && isEditMode" class="" variant="elevated" color="red" @click="deleteComment">Hapus</v-btn>

    <v-btn class="my-3 float-right" variant="outlined" color="grey" @click="cancelCommenting">Batal</v-btn>

  </div>



  <v-overlay
        :model-value="confirmDelete"
        @click:outside="confirmDelete = false"
        class="align-center justify-center"
      >
      <v-card title="Yakin ingin menghapus komentar ini?" subtitle="Komentar ini akan dihapus isinya" width="400">
        <v-container>
          <v-row>
            <v-col>
              <v-btn color="var(--gim-teal)" @click="confirmDeleteComment">Ya, yakin hapus</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="red" @click="confirmDelete = false">Tidak, jangan dihapus</v-btn>
            </v-col>
          </v-row>
          
        </v-container>
      </v-card>
  </v-overlay>

</template>
<script setup>



import CommentService from '~/service/CommentService';

const commentService = new CommentService();

const confirmDelete = ref(false);
const isCommenting = ref(false);
const windowWidth = ref(0);
const editText = ref("")

const isEditMode = ref(true);
const isUploading = ref(false);
const editorRef = ref();

const props = defineProps(['previousCommentData', 'editTextModel','targetPost', 'targetCommentParentId','isEditPreviousCommentMode']);
const emits = defineEmits(['update:editTextModelValue', 'cancelEdit', 'onDataUpdated' ])

onMounted(() => {
  window.addEventListener("resize", onResize);
  resizeEditorToWindow();

  editText.value = props.editTextModel;
});

onUnmounted(()=>{
  window.removeEventListener("resize", onResize);
});

const onChange = () => {
  emits('update:editTextModelValue', editText.value);
}

const cancelCommenting = () => {
  isCommenting.value = false;
  emits('cancelEdit')
}

const onResize = (e) => {
  resizeEditorToWindow();
}

const resizeEditorToWindow = () => {
  windowWidth.value = window.innerWidth;
}

const showPreviewMode = () => {
  editorRef.value?.showPreviewMode();
}

const showEditMode = async () => {
  await wait(100);
  editorRef.value?.showEditMode();
}

const startEditComment = async () => {
  editText.value = props.editTextModel;
  isCommenting.value = true;
  await wait(100);
  editorRef.value?.focus();
}

const startNewComment = async () => {
  editText.value = "";
  isCommenting.value = true;
  await wait(100);
  editorRef.value?.focus();
}

function wait(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}


const postComment = async () => {

  isUploading.value = true;

  if(props.targetCommentParentId != null) {
    let result = await commentService.createComment(props.targetPost.$id, props.targetCommentParentId, editText.value);
    isUploading.value = false;
    onDataUpdated(result);
  }else{
    let result = await commentService.createComment(props.targetPost.$id, null, editText.value);
    isUploading.value = false;
    onDataUpdated(result);
  }

  editText.value = "";
  isCommenting.value = false;

}

const updateComment = async () => {
  isUploading.value = true;

  let result = await commentService.updateComment(props.previousCommentData.$id, editText.value);

  isUploading.value = false;

  onDataUpdated(result);
}

const onDataUpdated = async (result) => {
  emits('onDataUpdated', result);
  await wait(100)
  GistEmbed.init();
}

const deleteComment = async () => {
  confirmDelete.value = true;
}

const confirmDeleteComment = async () => {
  confirmDelete.value = false;
  isUploading.value = true;

  let result = await commentService.updateComment(props.previousCommentData.$id, "_dihapus_");

  isUploading.value = false;

  onDataUpdated(result);
}

defineExpose({showEditMode, showPreviewMode, focus, startEditComment, startNewComment})

</script>