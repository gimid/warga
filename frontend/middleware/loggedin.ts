import AuthService from "~/service/AuthService";
import {client, teams} from "~/service/Backend"
let authService = new AuthService();

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.server) {
    try {
      var userSession = await authService.getUserSession();
      if(!userSession){
        return navigateTo('/enter');
      }
    }catch(e){
      console.log(e);
    }
  }


})