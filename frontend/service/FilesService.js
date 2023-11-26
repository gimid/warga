import { Query } from "appwrite";
import { databases } from "./Backend";

export default class FilesService {
  async getUserFiles(user_ID, cursor) {

    let queries =  [
      Query.equal("user_id", user_ID)
    ]

    if (cursor !== undefined && cursor !== null) {
      queries.push(Query.cursorAfter(cursor))
    }

    try {
      console.log(process.env.FILES_COLLECTION_ID);
      let userFiles = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.FILES_COLLECTION_ID,
        queries
      )

      return userFiles;
    }catch (e) {
      throw(e);
    }
  }
}