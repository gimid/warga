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
        <MdPreview :modelValue="rawText" codeTheme="github" language="en-US"></MdPreview>
      </div>
      

  </v-sheet>
</template>

<script setup>
import {MdPreview, MdCatalog, config} from 'md-editor-v3';
import {videoplugin} from '~/libraries/markdownitvideo'
import 'md-editor-v3/lib/style.css';

import { useRoute } from 'vue-router'
const props = defineProps(['data', 'writer', 'currentRoute', 'showSeries'])


import { ref } from 'vue';
import {marked} from '../libraries/marked.js'
import {markedEmojiBoldPatch} from '../libraries/markedEmojiBoldPatch.js'
import { useAsyncData } from 'nuxt/app';
import DOMPurify from 'isomorphic-dompurify';

const rawText = ref("");
const parsedText = ref("");

config({
  markdownItConfig: (mdit) => {
    mdit.use(videoplugin);
  }
})

useAsyncData(async ()=>{
  rawText.value = props.data.content;
  let parsedMD = await marked.parse(markedEmojiBoldPatch(props.data.content));
  parsedText.value = parsedMD;
});

// const computedContent = computed(()=>props.data.content);
// let parsedText = await useAsyncData('parsedText', async() => await marked.parse(markedEmojiBoldPatch(computedContent.value)), {initialCache: false}).data;
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



</style>