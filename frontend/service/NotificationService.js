import { ID, Account, Permission, Role, Query } from "appwrite"
import { client, databases } from "./Backend"

const account = new Account(client);

export default class NotificationService {
  async fetchUserNotification() {
    try {
      let result = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.NOTIFICATIONS_COLLECTION_ID,
        [
          Query.orderDesc('$createdAt')          
        ]
      )

      return result.documents;
    }catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async deleteNotification(notificationId) {
    try {
      let result = await databases.deleteDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.NOTIFICATIONS_COLLECTION_ID,
        notificationId
      )

      console.log(result);

      return result;
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async setSeen(notificationId, value) {
    try {
      let result = await databases.updateDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.NOTIFICATIONS_COLLECTION_ID,
        notificationId,
        {
          seen:  value
        }
      )
      return result
    }catch(e){
      console.log(e);
      throw(e);
    }
  }
}