import { Query } from "appwrite";
import { databases } from "./Backend";
import AuthService from "./AuthService";
import { Permission, Role } from "appwrite";



export default class ProfilesService {
  async getProfileFromHandle(handle) {
    try {

      let data = await databases.listDocuments(
        process.env.FORUM_DATABASE_ID,
        process.env.PROFILES_COLLECTION_ID,
        [
          Query.equal("handle", [handle])
        ]
      )

      return data.documents[0];
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async getProfileFromUserID(userID) {
    if (userID == undefined || userID == null){
      return;
    }
    try {

      let data = await databases.getDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.PROFILES_COLLECTION_ID,
        userID
      );

      return data;
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async createProfile(contact_name, handle) {
    
    const authService = new AuthService();

    try{
      let currentUser = await authService.getUserSession();
  
      let model = {
        contact_name: contact_name,
        handle: handle
      }
  
      let data = await databases.createDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.PROFILES_COLLECTION_ID,
        currentUser.$id,
        model,
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(currentUser.$id)),
          Permission.delete(Role.user(currentUser.$id))
        ]
      );

      return data;
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

  async updateProfile(contact_name, handle, metadata) {
    
    const authService = new AuthService();
    let currentUser = await authService.getUserSession();

    let profileStore = useProfileStore();
    profileStore.profile.data.handle = handle;

    try{

  
      let model = {
        contact_name: contact_name,
        handle: handle,
        metadata: metadata
      }
  
      let data = await databases.updateDocument(
        process.env.FORUM_DATABASE_ID,
        process.env.PROFILES_COLLECTION_ID,
        currentUser.$id,
        model,
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(currentUser.$id)),
          Permission.delete(Role.user(currentUser.$id))
        ]
      );


      return data;
    }catch(e){
      console.log(e);
      throw(e);
    }
  }
}