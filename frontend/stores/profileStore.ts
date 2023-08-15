import { acceptHMRUpdate, defineStore } from "pinia";

export const useProfileStore = defineStore({
  id: "profile-store",
  state: () =>{
    return {
      profile: {
        fetched: false,
        isAdmin: false,
        data: {
          contact_name:"",
          handle:"",
          $id:""
        },
      }
    }
  },
  actions: {
    clear() {
      this.profile.fetched = false;
      this.profile.isAdmin = false;
      this.profile.data.contact_name = "";
      this.profile.data.handle = ""; 
    }
  }
});


if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot));
}