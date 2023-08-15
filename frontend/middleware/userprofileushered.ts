import AuthService from "~/service/AuthService";
import ProfilesService from "~/service/ProfilesService";
import {client, teams} from "~/service/Backend"

let authService = new AuthService();
let profilesService = new ProfilesService();

export default defineNuxtRouteMiddleware(async (to, from) => {

  if (!process.server) {
    try {
      var userSession = await authService.getUserSession();
      if(userSession){

        let userProfile = null;
        try{
          userProfile = await profilesService.getProfileFromUserID(userSession.$id);
        }catch(e) {
          console.log("user doesn't have profile yet")
        }

        if(userProfile != null){
          return navigateTo('/dashboard');
        }
      }
    }catch(e){
      console.log(e);
    }
  }


})