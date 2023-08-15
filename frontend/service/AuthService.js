import {client, teams} from "./Backend"
import {Account, ID} from "appwrite"
import { useProfileStore } from "~/stores/profileStore";
import { storeToRefs } from "pinia";
import ProfilesService from "./ProfilesService";



export default class AuthService {    
    async signIn(email, password) {
        const account = new Account(client);
        let result = await account.createEmailSession(email, password);
        
        await this.fetchUserProfile();

        return result;
    }

    async signUp(email, password) {
        const account = new Account(client);

        let id = ID.unique();
        let result = await account.create(id, email, password);

        return result;
    }

    async signOut() {

        const profileStore = useProfileStore();
        
        profileStore.clear();
                
        const account = new Account(client);
        await account.deleteSessions();
    }

    async getUserSession() {
        const account = new Account(client);
        try{
            let response = await account.get();

            await this.fillProfileData(response)

            return response;
        }catch(exception){
            console.log(exception);
        }
        return null;
    }

    async fetchUserProfile() {
        try{
            const profileStore = useProfileStore();
            let userSession = await this.getUserSession();
            
            if(!profileStore.profile.fetched) {
    
                this.fillProfileData(userSession);
    
            }
        }catch(e){
            console.log(e);
        }
    }

    async fillProfileData(userSession) {
        const profileStore = useProfileStore();
        const { profile } = storeToRefs(profileStore);
        const profilesService = new ProfilesService();


        if (userSession) {
            try{
                let profileValue = await profilesService.getProfileFromUserID(userSession.$id);
            
                profileStore.profile.data = profileValue;
                profileStore.profile.fetched = true;
            }catch(e){
                console.log(e);
            }
        
            //check admin
            let userTeams = await teams.list();
            if(userTeams.teams.find(x => x.name == "Admin")){
                profileStore.profile.isAdmin = true;
            }      
        }
    }

    async loginGoogle() {

        const account = new Account(client);

        // Go to OAuth provider login page
        account.createOAuth2Session("google", process.env.WEBSITE_URL+"/dashboard", process.env.WEBSITE_URL+"/enter");
    }

  }