<template>
  <div>
    <div v-if="showSeries">
      <div class="series-container" v-if="seriesModel.posts && dataFetched && seriesModel.posts.length > 1">
      <h3>{{ seriesModel.title }} <span class="text-grey">({{ seriesModel.posts.length }} Bagian)</span> </h3>
      <div class="series-item-container">
        <div class="series-item" v-for="post in seriesModel.posts">
          <div v-if="hide">
            <NuxtLink :href="post.relative_url" v-if="post.i == 1 || post.i == seriesModel.posts.length">
              <div class="series-link">              
                <div class="number-container">
                  <div class="number-display" :class="currentRoute.path== post.url?'selected':'normal'"><span>{{ post.i }}</span></div> 
                </div>
                {{ post.title }}
              </div>
            </NuxtLink>
            <div v-else>
              <div @click="hide = !hide" v-if="post.i == 2">
                <div class="series-link">              
                  <div class="number-container">
                    <div class="number-display" :class="currentRoute.path== post.url?'selected':'normal'"><span></span></div> 
                  </div>
                  ...
                </div>
              </div>
            </div>     
          </div>
          <div v-else>
            <NuxtLink :href="post.relative_url">
              <div class="series-link">
                
                <div class="number-container">
                  <div class="number-display" :class="currentRoute.path== post.url?'selected':'normal'"><span>{{ post.i }}</span></div> 
                </div>
                {{ post.title }}
              </div>
            </NuxtLink>
          </div>

        </div>
      </div>
      
    </div>
    <div class="series-container" v-if="!dataFetched">
      <div class="series-item-container">
        <div class="series-item">
            <div>
              <div class="series-link">              
                <div class="number-container">
                  <div class="number-display normal"><span></span></div> 
                </div>
                ...
              </div>
            </div>
        </div>
      </div>
    </div>

    </div>
  </div>

</template>

<script setup>
  const props = defineProps(['seriesId', "currentRoute", "showSeries"])

  import SeriesService from '~/service/SeriesService';

  const seriesService = new SeriesService();

  let seriesModel = ref({});
  let dataFetched = ref(false);
  let hide = ref(true);

  onMounted(async ()=>{

    dataFetched.value = false;
    let seriesInfo = await seriesService.getSeriesPostList(props.seriesId);

    let i = 1;
    if (seriesInfo.posts){
      seriesInfo.posts = seriesInfo.posts.map ( x =>{
        x.full_url = process.env.WEBSITE_URL + x.url;
        x.relative_url = x.url;
        x.i = i++;
        return x;
      } );
    }
    seriesModel.value = seriesInfo;
    
    dataFetched.value = true;
  })

</script>

<style>

.series-container{
  border-radius: 5px;
  border: solid var(--gim-teal) 1px;
  padding: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
  font-size: 20px;
}

.series-link{
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  
  list-style-type: none;
  text-decoration: none;
  color: black;
  text-overflow: ellipsis;
}

.number-display{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  margin: 3px;
  border-radius: 100%;
}

.normal{
  background-color: #e0e0e0;
}

.selected{
  background-color: var(--gim-teal);
}

.number-container{
  display: inline-block;
  margin-right: 10px;
}

.series-container a{
  text-decoration: none;
}

.series-item{
  margin: 5px 0px;
}

.series-item:hover{
  font-weight: 500;
  background-color: var(--gim-teal);;
  border-radius: 5px;
}

</style>