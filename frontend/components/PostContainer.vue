<template>
  
  <v-sheet            
      rounded="lg"
      class="fill-height postmaincontainer"
      v-if="data"
    >
      <div class="postimage">
        <v-row v-if="data.cover_image" class="previewcovercontainer">
          <div class="postcoverimage" :style="'background-image:url('+data.cover_image+')'">
          </div>
        </v-row>
      </div>
      <div class="postcontainer" id="post-content">
        <h1 class="post-title">{{data.title}}</h1>
        <div class="writer-info">
          <div v-if="writer.contact_name || writer.handle">
            <div class="writer-avatar">
  
            </div>
            <div>
                <NuxtLink class="writer-link" :href="'/@'+writer.handle"> <b>{{ writer.contact_name }}</b> @{{ writer.handle }}</NuxtLink>
            </div>
          </div>
        </div>

        <div class="tagscontainer">
          <v-chip
                v-for="(chip, index) in data.tags"
                :key="index"
                label
                class="chip-tag float-left"
              >
                #{{ chip }}
            </v-chip>
        </div>
        <div class="clearfix"></div>
        
        <div class="my-4"></div>
        
        <ClientOnly>
          <SeriesContainer :seriesId="data.series_id" :currentRoute="currentRoute" :showSeries="showSeries"></SeriesContainer>
        </ClientOnly>
        
        <!-- {{ parsedText }}
        <hr/> -->
        <div>
          <MdPreview :show-code-row-number="true" id="md-content" :modelValue="rawText" codeTheme="github" language="en-US"></MdPreview>
        </div>

        <ClientOnly>
          <SeriesContainer v-if="contentHeight > 1000" :seriesId="data.series_id" :currentRoute="currentRoute" :showSeries="showSeries"></SeriesContainer>
        </ClientOnly>
      </div>
      

  </v-sheet>
</template>



<script setup>

useHead({
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/gist-embed@1.0.4/dist/gist-embed.min.js"
    }
  ]
})


import {MdPreview, MdCatalog, config} from 'md-editor-v3';
import { lineNumbers } from '@codemirror/view';
import {videoplugin} from '~/libraries/markdownitvideo'
import lazy_loading from "markdown-it-image-lazy-loading"
import 'md-editor-v3/lib/style.css';


import { useRoute } from 'vue-router'
const props = defineProps(['data', 'writer', 'currentRoute', 'showSeries'])


import { ref } from 'vue';
import {marked} from '../libraries/marked.js'
import {markedEmojiBoldPatch} from '../libraries/markedEmojiBoldPatch.js'
import { useAsyncData } from 'nuxt/app';
import DOMPurify from 'isomorphic-dompurify';
import { compileScript } from 'vue/compiler-sfc';

const rawText = ref("");
const parsedText = ref("");

const contentHeight = ref(0);

config({
  markdownItConfig: (mdit) => {
    mdit.use(videoplugin);
    mdit.use(lazy_loading);
  },
  markdownItPlugins(plugins) {
      return plugins.map((p) => {
        if (p.type === 'image') {
          return {
            ...p,
            options:{
              ...p.options,
              classes: 'my-class'
            }
          };
        }

        return p;
      })
  }
})

useAsyncData(async ()=>{
  rawText.value = props.data.content;
  // let parsedMD = await marked.parse(markedEmojiBoldPatch(props.data.content));
  // parsedText.value = parsedMD;
});

// const computedContent = computed(()=>props.data.content);
// let parsedText = await useAsyncData('parsedText', async() => await marked.parse(markedEmojiBoldPatch(computedContent.value)), {initialCache: false}).data;


onMounted(()=>{
  // iFrameResize({ log: true }, '.w-iframe');


  // embed regex

  // let EMBED_REGEX = /{% embed[\s]*(.*?)[\s]*%}/im;

  // const match = EMBED_REGEX.exec(rawText.value);

  // console.log("Match value:")
  // console.log(match);

  // for (let i = 0; i < match.length; i++) {
  //   document.body.
  // }

  // if (rawText.value.)
  // nodeScriptReplace(document.getElementById("md-content"));

  window.addEventListener("resize", onResize);
  updateWindowHeight();

  

})

onUnmounted(()=>{
  window.removeEventListener("resize", onResize);
});

const onResize = (e) => {
  updateWindowHeight();
}

const updateWindowHeight = () => {
  let postContent = document.getElementById('post-content');
  if(postContent != null){
    contentHeight.value = postContent.offsetHeight;
  }
}

function nodeScriptReplace(node) {
  
        if ( nodeScriptIs(node) === true ) {
          console.log("THIS IS SCRIPT");  
          console.log(node)
                node.parentNode.replaceChild( nodeScriptClone(node) , node );
        }
        else {
                var i = -1, children = node.childNodes;
                while ( ++i < children.length ) {
                      nodeScriptReplace( children[i] );
                }
        }

        return node;
}
function nodeScriptClone(node){
        var script  = document.createElement("script");
        console.log("create script")

        script.text = node.innerHTML;
        console.log(script)
        var i = -1, attrs = node.attributes, attr;
        while ( ++i < attrs.length ) {                                    
              script.setAttribute( (attr = attrs[i]).name, attr.value );
        }
        return script;
}

function nodeScriptIs(node) {
  if (node) {
    return node.tagName === 'SCRIPT';
  }
  return false;

}
</script>

<style>

code[class*="language-"], pre[class*="language-"]{  
  text-shadow: none !important;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

li {
  margin-left: 1em;
}

p {
  margin: 1em 0 1em 0;
}

img{
  /* width: 100%; */
  border-radius: 5px;
  
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.defaultimg{
  width: 100%;
}

.postcontainer{
  /* margin-left: 1em;
  margin-right: 1em; */

  font-family: var(--ff-sans-serif);
  font-size: 1.3rem;

  padding: 0.75em;
}

.postmaincontainer{
  padding-left: 0.75em;
  padding-right: 0.75em;
  padding-bottom: 1em;
  overflow: hidden;
  margin-bottom: 1.5em;
  border: 1px #d3d3d3 solid;
}

.postimage{
  width: 100%;
  overflow: hidden;
}


blockquote{
  border-left: 0.25rem solid #e0e0e0;
  padding: 1em 1em 1em 1rem;
  border-radius: 5px;
}

.loading-text{
  background-color: #e0e0e0;
}

iframe {
  width: 1px;
  min-width: 100%;
}

.md-editor-preview{
  font-size: 0.85em;
  overflow-wrap: break-word !important;
  word-break: keep-all !important;
}

h1, h2, h3, h4, h5{
  overflow-wrap: break-word !important;
  word-break: keep-all !important;
}

.md-editor-preview-wrapper {
  padding: 0 0;
}

.md-content{
  width: 100%;
}

.post-title{
  font-size: 2rem;
  font-weight: 800;
  font-family: var(--ff-sans-serif);
}

.writer-info{
  margin: 1rem 0;
  font-size: 1rem;
}

.writer-link{
  text-decoration: none;
  color: #000;
}

</style>