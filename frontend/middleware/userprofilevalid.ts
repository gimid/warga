import AuthService from "~/service/AuthService";
import ProfilesService from "~/service/ProfilesService";
import {client, teams} from "~/service/Backend"

let authService = new AuthService();


export default defineNuxtRouteMiddleware(async (to, from) => {

  if (!process.server) {
    try {
      var userSession = await authService.getUserSession();
      if(userSession){

        let userProfile = null;
        try{
          let profilesService = new ProfilesService();
          userProfile = await profilesService.getProfileFromUserID(userSession.$id);
        }catch(e) {
          console.log("user doesn't have profile yet")
        }

        if(userProfile == null){
          return navigateTo('/onboard');
        }
      }
    }catch(e){
      console.log(e);
    }
  }


})