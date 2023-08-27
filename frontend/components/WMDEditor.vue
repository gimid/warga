<template>
  <!--  -->

  <div style="position: relative;">

    <div id="dropzonefull" style="visibility: hidden; opacity: 0;pointer-events: none;">
    <!-- <div id="dropzonefull" > -->

      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          justify="center"
        >
          <v-col
            cols="12"
          >
            <div class="text-center upload-text">
              <h2>Lepas buat mengunggah file!</h2>
              <div>
                Lepas file yang kamu seret ke sini buat diunggah
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

     <!-- style="visibility: hidden; opacity: 0;pointer-events: none;" -->
    <div id="uploadingoverlay" v-if="loadingoverlay">

      <v-container
        class="fill-height"
        fluid
      >
        <v-row v-if="uploadErrorMessage" justify="center">
          <v-col cols="12">
            <div class="text-center bg-red-lighten-1 upload-text">
              <div>                
                <v-alert type="error">{{uploadErrorMessage}}</v-alert>
                <br/>
                <v-btn @click="dismissError">OK</v-btn>
              </div>
            </div>
          </v-col>
        </v-row>


        <v-row v-if="!uploadErrorMessage" justify="center">
          <v-col cols="12">
            <div class="text-center upload-text-white">
              <h2 class="mb-5">Mengunggah gambar</h2>
              <div>
                <v-progress-circular color="white" style="margin: auto;" indeterminate></v-progress-circular>
              </div>
            </div>
          </v-col>
        </v-row>

      </v-container>
    </div>

    <v-container  v-if="!isEditMode && showPreview" class="fill-height pa-0" no-gutters>
      <v-row style="background-color: var(--gim-teal);" class="rounded" no-gutters>
        <v-col cols="12" no-gutters>
          <div class="float-left pl-2 text-subtitle-1" style="height: 30px;"></div>
          <v-btn  @click="showEditMode" icon="mdi-close" variant="text" class="float-right"></v-btn>
        </v-col>
      </v-row>
    </v-container>

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
      :model-value="editTextModel"
      id="w-md-editor"
      editor-id="wmd-editor"
      @on-change="onChange"
      :class="editorclass"
      :scroll-auto="false"
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

        

        <NormalToolbar v-if="showPreview" title="preview" @onClick="showPreviewMode">
          <template #trigger>
            <v-icon icon="mdi-eye"></v-icon>
          </template>
        </NormalToolbar>
      </template>
  
    </MdEditor>
  


    <div id="preview" v-if="!isEditMode" style="background-color: #f1f1f1; border-radius: 5px;" class="px-2 py-1 mt-1">
      <!-- <div id="parsedtext" v-html="parsedText"></div> -->

      <MdPreview id="md-content" :modelValue="editText" codeTheme="github" language="en-US"></MdPreview>
    </div>

  </div>

</template>

<script setup>

useHead({
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/gist-embed@1.0.4/dist/gist-embed.min.js"
    }
  ]
})

import {NormalToolbar, MdEditor, config} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import ImageBucketService from '~/service/ImageBucketService';

import {videoplugin} from '~/libraries/markdownitvideo'
import {marked} from '../libraries/marked.js'
import {markedEmojiBoldPatch} from '../libraries/markedEmojiBoldPatch.js'

const props = defineProps(['editTextModel', 'showPreview', 'resizeEditorToWindow', 'height', 'isEditingTextModel'])
const emits = defineEmits(['update:editTextModelValue', 'uploadError', 'update:isEditingTextModelValue'])


const windowHeight = ref(700);
const editText = ref("");
const editorRef = ref();
const mdeditorToolbars = ref([0,
                              1,
                              2,
                              3,
                              4,
                              5,
                              6,
                              7,
                              "=",
                              "preview",
                              8])

const isMdAndUp = computed(() => $vuetify.breakpoint.mdAndUp);
var lastTarget = null;

const loadingoverlay = ref(false)
const uploadErrorMessage = ref("")

const imageBucketService = new ImageBucketService();
let isDroppingOnDropzoneFull = false;

const parsedText = ref("");
const isEditMode = ref(true);
const editorclass = ref("");

const iframeoptions = {
    allowfullscreen: true,
    width: '100%',
    height: 500,
    frameborder: 1, // default: 0
    renderIframe: true // default: true
}

config({
  markdownItConfig: (mdit) => {
    mdit.use(videoplugin);
  }
})

onMounted(() => {
  window.addEventListener("resize", onResize);

  let wmdEditor = document.getElementById("w-md-editor");

  wmdEditor.addEventListener("dragenter", onDragEnter);
  wmdEditor.addEventListener("dragleave", onDragLeave)
  wmdEditor.addEventListener("dragover", onDragOver);
  wmdEditor.addEventListener("drop", onDrop, false)


  editText.value = props.editTextModel;

  resizeEditorToWindow();
})


onUnmounted(()=>{
  window.removeEventListener("resize", onResize);

  let wmdEditor = document.getElementById("w-md-editor");
  if(wmdEditor != null) {
    wmdEditor.removeEventListener("dragenter", onDragEnter);
    wmdEditor.removeEventListener("dragleave", onDragLeave)
    wmdEditor.removeEventListener("dragover", onDragOver);
    wmdEditor.removeEventListener("drop", onDrop, false)
  }

})


const onChange = () => {
  emits('update:editTextModelValue', editText.value);
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


const handleUploadImage = async (files, callback) => {
  // Get the files and upload them to the file server, then insert the corresponding content into the editor
  
  // console.log(files);
  await uploadFlow(files[0]);
}


const onDragEnter = (e) => {
  e.preventDefault();
  
  lastTarget = e.target;  
  showDrop();
}

const onDragLeave = (e) => {
  e.preventDefault();
  console.log("main leave")



  if(e.target === lastTarget && !isDroppingOnDropzoneFull) {
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

  if(props.resizeEditorToWindow) {
    console.log(props.resizeEditorToWindow);
    windowHeight.value = window.innerHeight - 340;
  }else{
    windowHeight.value = props.height;
  }
}


function hideDrop() {
  document.querySelector("#dropzonefull").style.visibility = "hidden";
  document.querySelector("#dropzonefull").style.opacity = 0;
}

function showDrop() {
  document.querySelector("#dropzonefull").style.visibility = "";
  document.querySelector("#dropzonefull").style.opacity = 1;
}



// Upload


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
    console.log(e);
    uploadErrorMessage.value = e;
    // loadingoverlay.value = false;
  }


}


const uploadImage = async (imageData) => {
  loadingoverlay.value = true;
  let item = await imageBucketService.uploadItem(imageData, onProgress => {
    // uploadPercentage.value = onProgress;
  });
  console.log(item);

  loadingoverlay.value = false;

  return item;
}

const dismissError = () => {
  uploadErrorMessage.value = "";
  loadingoverlay.value = false;
}

const showPreviewMode = async () => {  
  if (editText.value) {
    let parsedMD = await marked.parse(markedEmojiBoldPatch(editText.value));
    parsedText.value = parsedMD;
  
    editorclass.value = "hideeditor"
    isEditMode.value = false;
  }
  emits('update:isEditingTextModelValue', isEditMode.value);
  
  
  await wait(100)
  GistEmbed.init();
}

function wait(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

const showEditMode = () => {
  if (editText.value) {
    editorclass.value = "showeditor"
    isEditMode.value = true;
  }
  emits('update:isEditingTextModelValue', isEditMode.value);
}

const focus = () => {
  editorRef.value?.focus('start');
}

defineExpose({showEditMode, showPreviewMode, focus})

</script>

<style>
#dropzonefull {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999999999;
  width: 100%;
  height: 100%;
  background-color: rgba(142, 253, 244, 0.7);
  transition: visibility 175ms,  opacity 175ms;
  color: black;
}


#uploadingoverlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999999999;
  width: 100%;
  height: 100%;
  background-color: rgba(48, 213, 200, 0.7);
  transition: visibility 175ms,  opacity 175ms;
  color: white;
}

.upload-text{
  border: dashed 1px rgba(48, 213, 200, 0.7);
  padding: 30px;
  border-radius: 15px;
}

.upload-text-white{
  border: dashed 1px rgba(248, 255, 254, 0.7);
  padding: 30px;
  border-radius: 15px;
}

.showeditor{

}

.hideeditor{
  display: none;
}

.md-editor-footer{
  display: none;
}

.cm-editor {
  padding-bottom: 10px;
}

.md-editor-content{
  border-radius: 0 0 5px;
}

.v-md-editor {
  box-shadow: none;
}

.v-md-editor__toolbar-item {
  font-size: 22px;
  color: #000;
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

.cm-line{
  font-size: 17px;
}

</style>