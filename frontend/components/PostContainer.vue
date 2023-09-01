<template>
  <v-sheet            
      rounded="lg"
      style="word-wrap: break-word;"
      class="fill-height postmaincontainer"
      v-if="data"
    >
      <div class="postimage">
        <v-row v-if="data.cover_image" class="previewcovercontainer">
          <div class="postcoverimage" :style="'background-image:url('+data.cover_image+')'">
          </div>
        </v-row>
      </div>
      <div class="postcontainer">
        <h1>{{data.title}}</h1>
        <div>
          <div v-if="writer.contact_name || writer.handle">
            <b>{{ writer.contact_name }}</b> - @{{ writer.handle }}
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
        
        <SeriesContainer :seriesId="data.series_id" :currentRoute="currentRoute" :showSeries="showSeries"></SeriesContainer>
        
        <!-- {{ parsedText }}
        <hr/> -->
        <MdPreview id="md-content" :modelValue="rawText" codeTheme="github" language="en-US"></MdPreview>
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

config({
  markdownItConfig: (mdit) => {
    mdit.use(videoplugin);
  },
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, lineNumbers()];
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
})

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

:root{

}


code{
  color: aliceblue;
}

code[class*="language-"], pre[class*="language-"]{  
  text-shadow: none;
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
  /* margin-left: 2.5em;
  margin-right: 2.5em; */

  font-family: var(--ff-sans-serif);
  font-size: 1.25rem;
}

.postmaincontainer{
  padding-bottom: 1em;
  padding-left: 1em;
  padding-right: 1em;
  overflow: hidden;
  margin-bottom: 1.5em;
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

code {
  width: 100% !important;
  /* background-color: transparent !important; */
}

</style>