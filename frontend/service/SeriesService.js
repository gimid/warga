import {client, databases, functions} from "./Backend"
import {ID, Permission, Role, Account, Query, AppwriteException} from "appwrite"

const account = new Account(client);

export default class SeriesService {
  async createSeries(title) {
    try{

      let currentUser = await account.get();

      let data = {
        title: title,
        user_id: currentUser.$id
      };
      console.log(data);

      let result = await databases.createDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.SERIES_COLLECTION_ID,
        ID.unique(),
        data,
        [
          Permission.read(Role.user(currentUser.$id)),
          Permission.update(Role.user(currentUser.$id)),
          Permission.delete(Role.user(currentUser.$id))
        ]
      );

      let seriesStore = useSeriesStore();
      seriesStore.addSeries(result);
      
      return result;      
    }catch (e) {
      console.log(e);
      throw(e);
    }
  }

  async updateSeries(series_id, title) {
    try{
      let data = {
        title: title
      };
      let result = await databases.updateDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.SERIES_COLLECTION_ID,
        series_id,
        data
      )

      let seriesStore = useSeriesStore();
      seriesStore.updateSeries(series_id, title);

      return result;
    }catch (e) {
      console.log(e);
      throw(e)
    }
  }

  async deleteSeries(series_id, title) {
    try{
      let data = {
        title: title
      };
      let result = await databases.deleteDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.SERIES_COLLECTION_ID,
        series_id
      )

      let seriesStore = useSeriesStore();
      seriesStore.removeSeries(series_id);

      return result;
    }catch (e) {
      console.log(e);
      throw(e)
    }
  }

  async getSeriesPostList(series_id) {
    try{
      let requestData = {
        series_id: series_id
      };

      // fetch all post with this series
      let response = this.loopCallFunction(functions.createExecution(process.env.GET_SERIES_FUNCTION_ID, JSON.stringify(requestData)));
      return response;

    }catch (e) {
      console.log(e);
      throw(e);
    }
  }

  async getSeries(series_id) {
    try{
      let result = await databases.getDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.SERIES_COLLECTION_ID,
        series_id
      );

      return result;
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async getSeriesWithPostId(post_id) {
    try {
      let result = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.SERIES_COLLECTION_ID,
        [
          Query.search("post_ids", post_id)
        ]
      )
      return result;
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async getUserSeries() {

    try{

      let currentUser = await account.get();
      let result = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.SERIES_COLLECTION_ID,
        [
          Query.equal("user_id", currentUser.$id)
        ]
      );

      let seriesStore = useSeriesStore();
      for(let i = 0; i < result.documents.length; i++) {
        seriesStore.addSeries(result.documents[i]);        
      }


      return result;

    }catch(e){

    }

  }


  async seriesRemovePostMember(series_id, post_id) {
    try{

      let dataChanged = false;
      let currentUser = await account.get();
      let previousData = await this.getSeries(series_id);

      let returnData = {};

      if(previousData != null){
        
        
        let newArray = []


        // merge post_ids array
        let post_id_arr = previousData.post_ids;

        // remove null
        let prevCount = post_id_arr.length;

        post_id_arr = post_id_arr.filter(n => n);

        for (let i = 0; i < post_id_arr.length; i++) {
          if (post_id_arr[i] !== null && post_id_arr[i] !== post_id){
            newArray.push(post_id_arr[i]);
          }
        }

        newArray = [...new Set(newArray)];

        if (newArray.length != prevCount) {
          dataChanged = true;
        }

        let data = {
          post_ids: newArray
        }

        console.log(data)

    
        let result = await databases.updateDocument(
          process.env.FORUM_DATABASE_ID,
          process.env.SERIES_COLLECTION_ID,
          series_id,
          data,
          [
            Permission.read(Role.user(currentUser.$id)),
            Permission.update(Role.user(currentUser.$id)),
            Permission.delete(Role.user(currentUser.$id))
          ]
        )

        returnData = result;

        // fill current post data
        let post_update_series_data = {
          series_id: null
        };
        let updatePostResult = await databases.updateDocument(
          process.env.FORUM_DATABASE_ID,
          process.env.POSTS_COLLECTION_ID,
          post_id,
          post_update_series_data,
          [
            Permission.read(Role.user(currentUser.$id)),
            Permission.update(Role.user(currentUser.$id)),
            Permission.delete(Role.user(currentUser.$id))
          ]
        )
          
        return returnData;
      }else{
        throw("previous data is null")
      }

    }catch(e){
      console.log(e);
      throw(e);
    }
  }


  async seriesAddPostMember(series_id, post_id) {
    try{

      let dataChanged = false;
      let currentUser = await account.get();
      let previousData = await this.getSeries(series_id);

      let returnData = {};

      if(previousData != null){
        
        
        let newArray = []


        // merge post_ids array
        let post_id_arr = previousData.post_ids;

        // remove null
        let prevCount = post_id_arr.length;

        post_id_arr = post_id_arr.filter(n => n);

        for (let i = 0; i < post_id_arr.length; i++) {
          if (post_id_arr[i] !== null){
            newArray.push(post_id_arr[i]);
          }
        }

        newArray = [...new Set(newArray)];

        if (newArray.length != prevCount) {
          dataChanged = true;
        }


        console.log(newArray);
        let previousDataIndex = -1;
        
        if (newArray.length > 0)
          previousDataIndex = newArray.indexOf(post_id);
        
        if(previousDataIndex < 0) {
          newArray.push(post_id)
        }
        
        let data = {
          post_ids: newArray
        }

    
        let result = await databases.updateDocument(
          process.env.FORUM_DATABASE_ID,
          process.env.SERIES_COLLECTION_ID,
          series_id,
          data,
          [
            Permission.read(Role.user(currentUser.$id)),
            Permission.update(Role.user(currentUser.$id)),
            Permission.delete(Role.user(currentUser.$id))
          ]
        )

        returnData = result;

        // fill current post data
        let post_update_series_data = {
          series_id: returnData.$id
        };
        let updatePostResult = await databases.updateDocument(
          process.env.FORUM_DATABASE_ID,
          process.env.POSTS_COLLECTION_ID,
          post_id,
          post_update_series_data,
          [
            Permission.read(Role.user(currentUser.$id)),
            Permission.update(Role.user(currentUser.$id)),
            Permission.delete(Role.user(currentUser.$id))
          ]
        )
          
        return returnData;
      }else{
        throw("previous data is null")
      }

    }catch(e){
      console.log(e);
      throw(e);
    }
  }


  async loopCallFunction(functionCall){
    let tryCount = 0;
    let maxTryCount = 10;
    let succeed = false;
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let result = {};

    do {
      result = await functionCall;

      if (result.status == "failed") {
        // retry
        console.log(result);
        console.log("retry-"+tryCount);
        await delay(1000);
        tryCount++;
      }else{
        succeed = true;
      }

    }while(tryCount < maxTryCount && !succeed);
    
    let response = JSON.parse(result.response);


    return response;
  }

  
}