import { acceptHMRUpdate, defineStore } from "pinia";
import ProfilesService from "~/service/ProfilesService";



export const usePostStore = defineStore({
  id: "post-store",
  state: () =>{
    return {
      postdata:{
        posts: [] as any[]
      }
    }
  },
  actions: {
    addPost(data: any) {
      let prevIndex = this.postdata.posts.findIndex( x=> x.post_id == data.post_id);
      if(prevIndex < 0) {
        this.postdata.posts.push(data)
      }
    },
    removePost(post_id: any) {
      let prevIndex = this.postdata.posts.findIndex( x=> x.post_id == post_id);
      console.log("delete. prevIndex:" + prevIndex)
      if(prevIndex > 0) {
        JSON.stringify(this.postdata.posts)
        this.postdata.posts.splice(prevIndex, 1);
        JSON.stringify(this.postdata.posts)
      }
    },
    async setDetail(data: any) {
      let prevData = this.postdata.posts.findIndex( x => x.post_id == data.$id);
      let targetData = null;

      // console.log(data.$id + "  result = " + prevData);

      if (prevData < 0){
        
        // don't add to cached data when it's not published
        if (!data.published)
          return;

        let newData = {
          "post_id":data.post_id,
          "detail":{}
        };

        newData.detail = {}
        newData.detail = data;

        this.postdata.posts.push(newData);

        targetData = newData;
      }else{
        targetData = this.postdata.posts[prevData];

        if (!targetData.detail) targetData.detail = {}
        
        if (data.title) targetData.detail.title = data.title;
        if (data.user_id) targetData.detail.user_id = data.user_Id;
        if (data.timestamp) targetData.detail.timestamp = data.timestamp;
        if (data.content) targetData.detail.content = data.content;
        if (data.tags) targetData.detail.tags = data.tags;
        if (data.published) targetData.detail.published = data.published;
        
      }

      if (data.user_id){
        // TODO: search in user's store
        let userInfo = await getUser(data.user_id);        

        targetData.userInfo = {}
        targetData.userInfo = userInfo;
 

        if (userInfo != null){
          targetData.link = getLinkFormat(userInfo.handle, data.$id);
        }
      }


    },
    getPublishedPosts() {
      let publishedPosts = [];
      for (let i = 0; i < this.postdata.posts.length; i++){
        let post = this.postdata.posts[i];

        if (post.published) {
          publishedPosts.push(post);
        }

      }
      console.log(publishedPosts);
      return publishedPosts;
    },
    getPost(post_id: any) {
      let post = this.postdata.posts.find(x => x.post_id == post_id);
      return post;
    },
    updateUsername(user_id: string, newUsername: string) {
      this.postdata.posts.forEach( x => {
        if(x.userInfo){
          console.log(x.userInfo);
          if (x.userInfo.$id == user_id) {
            x.userInfo.handle = newUsername
            x.link = getLinkFormat(x.userInfo.handle, x.$id);
          }
        }
      });
    },
    clear() {
      this.postdata.posts = [];
    }
  }
});


const getLinkFormat = (handle:string, id:string) => {
  return '/'+ "@" + handle+ "/" + id;
}

const getUser = async (userId:any)=>{
  let profileService = new ProfilesService();
  const returnData = await profileService.getProfileFromUserID(userId);
  return returnData;
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostStore, import.meta.hot));
}
