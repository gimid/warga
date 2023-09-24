<template>
  <div class="page">
    <Header></Header>

    <v-container class="page-width">
      <v-row >
        <ClientOnly>
          <v-col :cols="windowWidth > 1000?3:0" :class="windowWidth < 1000? 'd-none':''" v-cloak>
            <v-card class="link-card my-2 px-3 py-2 post-preview-container">

              <div>
                <ul class="sidebar-menu">
                  <li>
                    <NuxtLink to="p/privacy" class="text-h6">
                      <v-icon icon="mdi-glasses" class="mr-2"/>
                      Kebijakan Privasi
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="p/terms" class="text-h6">
                      <v-icon icon="mdi-tie" class="mr-2"/>
                      Ketentuan
                    </NuxtLink>
                  </li>
                </ul>
              </div>

              <div>
                <hr/>
              </div>

              <div>
                <NuxtLink href="https://github.com/gimid" style="text-decoration: none; color: #000;">
                  <div class="d-inline-block mr-2" style="vertical-align: top;">
                    <v-icon icon="mdi-github" size="30"></v-icon>
                  </div>  
                </NuxtLink>

                <NuxtLink href="https://tiktok.com/@gimiddev">
                  <div class="d-inline-block mr-2" style="vertical-align: top;">
                    <svg role="img" viewBox="0 0 24 24" width="28px" xmlns="http://www.w3.org/2000/svg"><title>TikTok</title><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </div>  
                </NuxtLink>

                <NuxtLink href="/@gimid">
                  <div class="d-inline-block mr-2" style="vertical-align: top;">
                    <svg   width="30"   height="30"   viewBox="0 0 7.9374998 7.9375"   version="1.1"   id="svg1"   inkscape:version="1.3 (0e150ed6c4, 2023-07-21)"   sodipodi:docname="gimid.svg"   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"   xmlns="http://www.w3.org/2000/svg"   xmlns:svg="http://www.w3.org/2000/svg">  <sodipodi:namedview     id="namedview1"     pagecolor="#ffffff"     bordercolor="#000000"     borderopacity="0.25"     inkscape:showpageshadow="2"     inkscape:pageopacity="0.0"     inkscape:pagecheckerboard="0"     inkscape:deskcolor="#d1d1d1"     inkscape:document-units="mm"     inkscape:zoom="8.3597645"     inkscape:cx="56.700162"     inkscape:cy="10.347181"     inkscape:window-width="2560"     inkscape:window-height="1369"     inkscape:window-x="-8"     inkscape:window-y="-8"     inkscape:window-maximized="1"     inkscape:current-layer="layer1" />  <defs     id="defs1">    <inkscape:path-effect       effect="fillet_chamfer"       id="path-effect15"       is_visible="true"       lpeversion="1"       nodesatellites_param="F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1"       radius="5"       unit="px"       method="auto"       mode="F"       chamfer_steps="1"       flexible="false"       use_knot_distance="true"       apply_no_radius="true"       apply_with_radius="true"       only_selected="false"       hide_knots="false" />    <inkscape:path-effect       effect="fillet_chamfer"       id="path-effect19"       is_visible="true"       lpeversion="1"       nodesatellites_param="F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1"       radius="5"       unit="px"       method="auto"       mode="F"       chamfer_steps="1"       flexible="false"       use_knot_distance="true"       apply_no_radius="true"       apply_with_radius="true"       only_selected="false"       hide_knots="false" />    <inkscape:path-effect       effect="fillet_chamfer"       id="path-effect21"       is_visible="true"       lpeversion="1"       nodesatellites_param="F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1"       radius="5"       unit="px"       method="auto"       mode="F"       chamfer_steps="1"       flexible="false"       use_knot_distance="true"       apply_no_radius="true"       apply_with_radius="true"       only_selected="false"       hide_knots="false" />    <inkscape:path-effect       effect="fillet_chamfer"       id="path-effect23"       is_visible="true"       lpeversion="1"       nodesatellites_param="F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1 @ F,0,0,1,0,1.3229167,0,1"       radius="5"       unit="px"       method="auto"       mode="F"       chamfer_steps="1"       flexible="false"       use_knot_distance="true"       apply_no_radius="true"       apply_with_radius="true"       only_selected="false"       hide_knots="false" />    <inkscape:path-effect       effect="fillet_chamfer"       id="path-effect27"       is_visible="true"       lpeversion="1"       nodesatellites_param="F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1 @ F,0,0,1,0,0,0,1"       radius="0"       unit="px"       method="auto"       mode="F"       chamfer_steps="1"       flexible="false"       use_knot_distance="true"       apply_no_radius="true"       apply_with_radius="true"       only_selected="false"       hide_knots="false" />    <inkscape:path-effect       effect="fillet_chamfer"       id="path-effect31"       is_visible="true"       lpeversion="1"       nodesatellites_param="F,0,0,1,0,0,0,1 @ F,0,0,1,0,8.0204256,0,1 @ F,0,0,1,0,9.3676464,0,1 @ F,0,0,1,0,0,0,1"       radius="0"       unit="px"       method="auto"       mode="F"       chamfer_steps="1"       flexible="false"       use_knot_distance="true"       apply_no_radius="true"       apply_with_radius="true"       only_selected="false"       hide_knots="false" />  </defs>  <g     inkscape:label="Layer 1"     inkscape:groupmode="layer"     id="layer1">    <path       id="path16"       style="color:#000000;fill:#1a1a1a;stroke-width:0.0874012;stroke-linecap:square;-inkscape-stroke:none"       d="m 4.4435148,0.28263209 c -1.304144,0 -2.4837876,0.76546501 -2.9828688,1.93605171 -0.059694,0.140012 -0.1073176,0.2831267 -0.1450379,0.427231 h -0.00132 L 0.35200418,6.1281065 C 0.13320501,6.9197083 0.69176807,7.6504381 1.5156144,7.650439 H 3.1116876 C 3.7972568,7.6504381 4.4481699,7.1830357 4.6799459,6.5450432 5.0177821,6.5211078 5.3550106,6.447511 5.6786505,6.3172716 6.8835326,5.8324012 7.6720863,4.6863385 7.6720863,3.4193063 v -0.562993 h -1.159637 v 0.562993 c 0,0.8147521 -0.5020661,1.5457637 -1.276858,1.8575549 C 4.4607984,5.5886533 3.5728928,5.4167401 2.9798954,4.8406223 2.3868989,4.2645062 2.2106115,3.4025073 2.5315378,2.6497752 2.8524651,1.897042 3.6048907,1.4086172 4.4435148,1.4086172 H 7.0839893 7.6641391 V 0.28263209 H 7.0839893 Z M 4.1143662,1.5527434 c -0.1228413,0 -0.2251724,0.1020815 -0.2251724,0.2251971 v 0.231632 0.4864254 c 0,0.1031212 0.041153,0.2024702 0.1139101,0.2753839 l 0.2986839,0.2991905 c 0.086865,0.087051 0.2310304,0.087055 0.3178908,0 L 4.9183631,2.7713818 C 4.9911169,2.6984665 5.031611,2.5991169 5.031611,2.4959979 V 2.2412033 1.7779405 c 0,-0.1231149 -0.1016685,-0.2251971 -0.2245097,-0.2251971 z m -0.0033,0.2194064 c 7.971e-4,-2.056e-4 0.00213,0 0.0033,0 h 0.6927351 c 0.00472,0 0.00596,0.00105 0.00596,0.00579 v 0.4632628 0.2547946 c 0,0.045112 -0.017842,0.08842 -0.049671,0.1203196 l -0.2980196,0.299189 c -0.00336,0.00335 -0.00592,0.00335 -0.00926,0 L 4.1574139,2.6163175 c -0.031828,-0.031896 -0.04967,-0.075209 -0.04967,-0.1203196 V 2.0095725 1.7779405 c 0,-0.00356 9.193e-4,-0.00517 0.0033,-0.00579 z M 2.7878375,2.8479493 c -0.1267219,0 -0.2317952,0.099418 -0.2317952,0.2187625 v 0.6730183 c 0,0.1193436 0.1050723,0.2187625 0.2317952,0.2187625 H 3.264672 3.5269318 c 0.1061399,0 0.2077377,-0.039985 0.2827894,-0.110669 L 4.1183394,3.5576418 c 0.089607,-0.084387 0.089601,-0.2244499 0,-0.3088416 L 3.8097212,2.9586176 C 3.7346713,2.8879301 3.6330732,2.8479493 3.5269318,2.8479493 H 3.0262546 Z m 2.6066983,0 c -0.1061399,0 -0.2084031,0.039972 -0.2834521,0.1106689 l -0.3079556,0.290182 c -0.089601,0.084393 -0.089605,0.2244543 0,0.3088416 l 0.3079556,0.2901825 c 0.075049,0.070684 0.1773116,0.1106689 0.2834521,0.1106689 h 0.2622598 0.4768353 c 0.1267219,0 0.2317944,-0.099418 0.2317944,-0.2187624 v -0.673019 c 0,-0.1193422 -0.1050698,-0.2187625 -0.2317944,-0.2187625 H 5.8952129 Z M 2.7878375,3.0609212 h 0.2384171 0.5006772 c 0.046433,0 0.091015,0.01669 0.1238448,0.047613 l 0.3079557,0.2901825 c 0.00344,0.00325 0.00344,0.00575 0,0.009 L 3.6507766,3.6979074 c -0.032834,0.030922 -0.077411,0.047614 -0.1238448,0.047614 H 3.264672 2.7878375 c -0.00488,0 -0.00663,-0.0012 -0.00663,-0.00579 V 3.0667118 c 0,-0.00459 0.00174,-0.00579 0.00663,-0.00579 z m 1.6728962,0.6099623 c -0.057745,9e-7 -0.1155119,0.021461 -0.1589453,0.064985 l -0.298684,0.2991914 c -0.072759,0.072913 -0.11391,0.1722632 -0.11391,0.2753839 v 0.4864255 0.231631 c 0,0.1231149 0.1023309,0.2251972 0.2251723,0.2251972 h 0.6927352 c 0.1228413,0 0.2245096,-0.1020827 0.2245096,-0.2251972 V 4.5652385 4.310444 c 0,-0.1031187 -0.040494,-0.2024694 -0.1132474,-0.2753839 L 4.6196792,3.7358687 c -0.04343,-0.043527 -0.101201,-0.064985 -0.1589455,-0.064985 z m 0,0.2174763 c 0.00138,0 0.00296,8.977e-4 0.00464,0.00258 l 0.2980222,0.2991904 c 0.031828,0.031899 0.049671,0.075208 0.049671,0.1203197 v 0.2547945 0.463262 c 0,0.00474 -0.00123,0.00579 -0.00596,0.00579 h -0.692743 c -0.00472,0 -0.00663,-0.00105 -0.00663,-0.00579 V 4.7968695 4.310444 c 0,-0.045111 0.017842,-0.088424 0.049671,-0.1203197 l 0.298688,-0.2991911 c 0.00168,-0.00168 0.00326,-0.00258 0.00464,-0.00258 z M 1.7825092,5.1919297 C 1.8935036,5.3493504 2.0185237,5.4990808 2.1606667,5.6371765 2.5429659,6.0085947 3.0062411,6.2701555 3.5030899,6.4170019 3.4382012,6.483607 3.3476655,6.5244523 3.24944,6.5244523 H 1.6540294 c -0.1367424,0 -0.2124802,-0.098953 -0.1761644,-0.2303438 z" />  </g></svg>
                  </div>  
                </NuxtLink>


              </div>


            </v-card>
          </v-col>

        </ClientOnly>
      
        <v-col :cols="windowWidth > 1000?6:12">

          <v-container>
            <v-row >
              <v-col>
                <div>
                  <ul id="post-type-menu">
                    <li class="post-type-selected">
                      Semua
                    </li>
                    <li>
                      Terkurasi
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>
            <div v-if="posts.length <= 0" v-for="i in 10">
              <v-skeleton-loader type="article" class="mb-3"></v-skeleton-loader>
            </div>
            <div v-else v-for="userPost in posts">
              <PostPreview :data="userPost"></PostPreview>
            </div>
            <div v-if="posts.length > 0">
              <v-btn color="var(--gim-teal)"  @click="loadMore" block>Muat lagi</v-btn>
            </div>
          </v-container>

          
        </v-col>
        <v-col cols="3" class="d-none d-sm-block">
        </v-col>
        <!-- <v-col cols="6">
          <div v-for="userPost in postdata.posts">
            <PostPreview :data="userPost"></PostPreview>
          </div>
        </v-col>
        <v-col  cols="3" class="d-none d-sm-block">
        </v-col> -->
        
      </v-row>
    </v-container>

    <Footer></Footer>
  </div>
</template>

<script setup>
import PostsService from '../service/PostsService';
import { storeToRefs } from 'pinia';

const postsService = new PostsService();

let posts = ref([]);
const windowWidth = ref(0);
const lastPost = ref();

useSeoMeta(
  {
    title: "GIMid"
  }
)

onMounted(async () => {
  window.addEventListener("resize", onResize);
  resizeEditorToWindow();
  let homepagePosts = await postsService.getHomepagePosts();
  
  if (homepagePosts) {
    posts.value = homepagePosts;
    lastPost.value = homepagePosts[homepagePosts.length-1];
  }

});

const loadMore = async () => {
  console.log("----more ----");

  console.log(lastPost.value)
  if(lastPost.value){
    let morePosts = await postsService.getHomepagePosts(lastPost.value.$id)
    posts.value = posts.value.concat(morePosts);
    lastPost.value = morePosts[morePosts.length-1];
  }else{
    let morePosts = await postsService.getHomepagePosts()
    posts.value = posts.value.concat(morePosts);
    lastPost.value = morePosts[morePosts.length-1];
  }
}

onUnmounted(()=>{
  window.removeEventListener("resize", onResize);
});

const onResize = (e) => {
  resizeEditorToWindow();
}

const resizeEditorToWindow = () => {
  windowWidth.value = window.innerWidth;
}

</script>

<style>
  #post-type-menu li{
    list-style-type: none;
    display: inline-block;
    font-weight: bold;
  }

  #post-type-menu li:hover{
    color: var(--gim-teal-dark);
    cursor: pointer;
  }

  .post-type-selected{
    color: var(--gim-teal-dark);
    border-bottom: 1px solid var(--gim-teal-dark);
  }


  .sidebar-menu {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .sidebar-menu li{
    list-style: none;
    margin-left: 0;    
  }

  .sidebar-menu a{
    text-decoration: none;
    color: black;
  }

  .sidebar-menu a:hover{
    color: var(--gim-teal-dark)
  }
</style>