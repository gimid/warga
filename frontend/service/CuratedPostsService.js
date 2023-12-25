import { ID } from "appwrite";
import { databases } from "./Backend";

export default class CuratedPostsService{
  async addPost(post_id, data) {
    try{
      let result = await databases.createDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.CURATED_POSTS_COLLECTION_ID,
        post_id,
        data
      )
    }catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async deletePost(id) {
    try {
      let result = await databases.deleteDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.CURATED_POSTS_COLLECTION_ID,
        id
      )

      return result;
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async isCurated(post_id) {
    try{
      let result = await databases.getDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.CURATED_POSTS_COLLECTION_ID,
        post_id
      );

      console.log("Curated?")
      console.log(result);

      return true;
    }catch(e){
      console.log(e);
      return false;
    }
  }
}