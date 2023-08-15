import { databases } from "./Backend";

export default class PageService {
  async getNews() {
    try {
      let data = await databases.getDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.PAGE_COLLECTION_ID,
        "649c0626bc4b20546400"
      )

      return data;
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async getPage(id) {
    try {
      let data = await databases.getDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.PAGE_COLLECTION_ID,
        id
      );

      return data;
    }catch(e) {
      console.log(e);
      throw(e);
    }
  }
}