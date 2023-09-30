import { client, databases, functions } from "./Backend"
import {ID, Permission, Role, Account, Query, AppwriteException} from "appwrite"
import {v4 as uuidv4} from 'uuid'
import ProfilesService from "./ProfilesService"
import axios from "axios"


const account = new Account(client);
const profilesService = new ProfilesService();


export default class PostsService { 
  async createPost(data) {
    try{

      let currentUser = await account.get();

      
      data.preview_key = uuidv4();
      
      let title = data.title;
      let unique_id = ID.unique();
      
      data.user_id = currentUser.$id;
      data.timestamp = new Date(Date.now());
      console.log(data.timestamp);

   
      let result = await databases.createDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.POSTS_COLLECTION_ID,
        unique_id,
        data,
        [
          Permission.read(Role.user(currentUser.$id)),
          Permission.update(Role.user(currentUser.$id)),
          Permission.delete(Role.user(currentUser.$id))
        ]
      );


      return result;
    }catch (e) {
      console.log(e);
      throw(e);
    }
  }

  async updatePost(data) {
    try{

      console.log("Start update post");

      let result = await databases.updateDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.POSTS_COLLECTION_ID,
        data.$id,
        data
      )

      data.post_id = data.$id;
      data.published = data.published;

      console.log("Update post:");
      console.log(data);


      return result;
        
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  // async publishPost(id) {
    
  //   // let currentUser = await account.get();

  //   // let data = {}
  //   // data.post_id = id;

  //   // let updateToRead = await databases.updateDocument(
  //   //   process.env.FORUM_DATABASE_ID,
  //   //   process.env.POSTS_COLLECTION_ID,
  //   //   id,
  //   //   {},
  //   //   [
  //   //     Permission.read(Role.user(currentUser.$id)),
  //   //     Permission.update(Role.user(currentUser.$id)),
  //   //     Permission.delete(Role.user(currentUser.$id))
  //   //   ]
  //   // );

  //   // console.log(updateToRead);



  //   // // Try updating
  //   // try {
  //   //     let result = await databases.updateDocument(
  //   //       process.env.FORUM_DATABASE_ID,
  //   //       process.env.POST_HOMEPAGE_COLLECTION_ID,
  //   //       id,
  //   //       data,
  //   //       [
  //   //         Permission.read(Role.user(currentUser.$id)),
  //   //         Permission.update(Role.user(currentUser.$id)),
  //   //         Permission.delete(Role.user(currentUser.$id))
  //   //       ]
  //   //     );

  //   //     return result;
      
  //   // }catch(e){
  //   //   console.log(e);
  //   //   if (e.type == "document_not_found") {

  //   //     try{

  //   //       console.log("Create publish document")

  //   //       let result = await databases.createDocument(
  //   //         process.env.FORUM_DATABASE_ID,
  //   //         process.env.POST_HOMEPAGE_COLLECTION_ID,
  //   //         id,
  //   //         data,
  //   //         [
  //   //           Permission.read(Role.user(currentUser.$id)),
  //   //           Permission.update(Role.user(currentUser.$id)),
  //   //           Permission.delete(Role.user(currentUser.$id))
  //   //         ]
  //   //       );
  
  //   //       console.log("Create publish document succeed")

  //   //       return result;


  //   //     }catch(e) {
  //   //       console.log(e);
  //   //       throw(e);
  //   //       return;
  //   //     }

  //   //   }
      
  //   //   throw(e);
  //   // }
    




  // }


  // async unpublishPost(id) {
  //   try {
  //     let currentUser = await account.get();

  //     let data = {}
  //     data.published = false;
  //     data.preview_key = uuidv4();
      

  //     let result = await databases.updateDocument(
  //       process.env.FORUM_DATABASE_ID,
  //       process.env.POSTS_COLLECTION_ID,
  //       id,
  //       data,
  //       [
  //         Permission.read(Role.user(currentUser.$id)),
  //         Permission.update(Role.user(currentUser.$id)),
  //         Permission.delete(Role.user(currentUser.$id))
  //       ]
  //     )

  //     return result;
      
  //   }catch(e){
  //     console.log(e);
  //     throw(e);
  //   }
  // }

  async deletePost(id) {
    try {

      let result = await databases.deleteDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.POSTS_COLLECTION_ID,
        id
      )
      // //TODO: Also delete in homepage
      // //TODO: This should be happened in server!
      // await databases.deleteDocument(
      //   process.env.FORUM_DATABASE_ID,
      //   process.env.POST_HOMEPAGE_COLLECTION_ID,
      //   id
      // )

      return result;
      
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async getAllUserPosts() {
    try{
      let userPosts = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.POSTS_COLLECTION_ID
      );

      return userPosts;
    }catch (e) {
      console.log(e);
      throw(e);
    }
  }

  async getPostFromPostUsers(document_ID) {
    // try{
    //   let data = await databases.getDocument(
    //     process.env.FORUM_DATABASE_ID,
    //     process.env.POST_USERS_COLLECTION_ID,
    //     document_ID
    //   )
    //   return data;
    // }catch(e) {
    //   throw(e);
    // }
    throw("BELUM DIBIKIN");
  }

  async getPostsFromUserID(user_ID, cursor_after){
    try {


      let queries = [
        Query.equal("user_id", user_ID),
        Query.orderDesc("$updatedAt")
      ]

      if (cursor_after != null) {
        queries.push(Query.cursorAfter(cursor_after));
      }

      let userPosts = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.POSTS_COLLECTION_ID,
        queries
      )

      return userPosts;


      // return result;
    }catch(e){
      throw(e);
    }
  }

  async getPostFromUserHandle(userHandle) {
    try {
    
      // let profiles = await profilesService.getProfileFromHandle(userHandle);


      // let user_ID = profiles.$id

      // let result = await databases.listDocuments(
      //   process.env.FORUM_DATABASE_ID,
      //   process.env.POSTS_COLLECTION_ID,
      //   [
      //     Query.equal("user_id", [user_ID])
      //   ]
      // )

      // result.documents.map(x => x.user_handle = userHandle);

      // console.log(result);


      let axiosConfig = {
        headers: {
          'Content-Type' : 'application/json;charset=UTF-8'
        }
      }
      
      let result = await axios.post(
        process.env.WARGA_ENDPOINT+'/postfrom',
        {
          'handle': userHandle
        },
        axiosConfig);
      return result.data;
      
    }catch(e){
      console.log(e);
      throw(e);
    }
  }


  async getPostByIdPreview(id) {
    
    try {

      let requestData = {
        post_id: id,
        columns: ['$id','title', 'post_id', 'user_id', 'tags', 'timestamp']
      };

      let response = this.loopCallFunction(functions.createExecution(process.env.GET_POST_FUNCTION_ID, JSON.stringify(requestData)));
      return response;

    } catch (e) {
      console.log(e);
      throw(e);
    }

  }


  async getOwnedPostByIdDirect(id) {
    try {
      let result = await databases.getDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.POSTS_COLLECTION_ID,
        id
      )

      return result;

    } catch (e) {
      console.log(e.type);
      console.log(e);
      throw(e);
    }
  }

  async getPostById(id, preview_key) {

    try {
      // let result = await databases.getDocument(
      //   process.env.FORUM_DATABASE_ID,
      //   process.env.POSTS_COLLECTION_ID,
      //   id
      // )

      // return result;

      let requestData = {
        post_id: id,
        preview_key: preview_key
      };
      
      let axiosConfig = {
        headers: {
          'Content-Type' : 'application/json;charset=UTF-8'
        }
      }

      // let result = await this.loopCallFunction(functions.createExecution(process.env.GET_POST_FUNCTION_ID, JSON.stringify(requestData)));

      let result = await axios.post(process.env.WARGA_ENDPOINT + '/post', requestData, axiosConfig)
      return result.data;


    } catch (e) {
      console.log(e.type);
      console.log(e);
      throw(e);
    }

  }


  async getHomepagePosts(cursorAfter) {
    try {
      console.log("AFTER" + cursorAfter);

      let axiosConfig = {
        headers: {
          'Content-Type' : 'application/json;charset=UTF-8'
        }
      }
      
      if (!cursorAfter) {
        let result = await axios.post(process.env.WARGA_ENDPOINT+'/home',{},axiosConfig);
        return result.data;
      }else{
        let result = await axios.post(
          process.env.WARGA_ENDPOINT+'/home',
          {
            'cursor_after': cursorAfter
          },
          axiosConfig);
        return result.data;
      }
    }catch (e){ 
      console.log(e);
      throw(e);
    }
  }

  async deleteHomepagePost(document_ID) {
    try {

      let result = await databases.deleteDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.POST_HOMEPAGE_COLLECTION_ID,
        document_ID
      )

      return result;
    }catch (e){ 
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