import AuthService from "~/service/AuthService";
import {client, teams} from "~/service/Backend"
let authService = new AuthService();

export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    var userSession = await authService.getUserSession();
    if(!userSession){
      return navigateTo('/enter');
    }else{
      let userTeams = await teams.list();
      if(!userTeams.teams.find(x => x.name == "Admin")){
        return navigateTo('/enter');
      }
    }
  }catch(e){
    console.log(e);
  }

})