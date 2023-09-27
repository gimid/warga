import { ID, Account, Permission, Role, Query } from "appwrite"
import { client, databases } from "./Backend"

const account = new Account(client);

export default class CommentService {
  async createComment(post_id, parent_comment_id, content) {
    try {

      let currentUser = await account.get();
      let unique_id = ID.unique();

      let data = {
        user_id: currentUser.$id,
        post_id: post_id,
        parent_comment_id: parent_comment_id,
        content: content
      }

      let result = await databases.createDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.POST_COMMENTS_COLLECTION_ID,
        unique_id,
        data,
        [
          Permission.read(Role.any()),
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


  async getBaseCommentsFromPost(post_id) {
    try {
      let result = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.POST_COMMENTS_COLLECTION_ID,
        [
          Query.equal("post_id", post_id),
          Query.equal("parent_comment_id", "")
        ]
      )

      console.log(result);

      return result;
    }catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async getCommentReply(parent_comment_id) {
    try {
      let result = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.POST_COMMENTS_COLLECTION_ID,
        [
          Query.equal("parent_comment_id", parent_comment_id)
        ]
      )

      return result;
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async getCommentsFromPost(post_id) {
    try {
      let result = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.POST_COMMENTS_COLLECTION_ID,
        [
          Query.equal("post_id", post_id)
        ]
      )

      console.log(result);

      return result;
    }catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async getRepliesFromComment(comment_Id){
    
  }

  async updateComment(id, content) {
    try {

      let data = {
        content: content
      }

      let result = await databases.updateDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.POST_COMMENTS_COLLECTION_ID,
        id,
        data
      );

      return result;
    }catch (e) {
      console.log(e);
      throw(e);
    }
  } 
}