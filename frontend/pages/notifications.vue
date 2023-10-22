<template>

  <div class="page">
    <Header></Header>


    <v-container class="page-width">
      <v-row >

        <v-col :v-if="windowWidth > 900" cols="3" >
          
        </v-col>

        <v-col :cols="windowWidth > 900?6:12" v-cloak>

          <v-container>
            <v-row>
              <v-col>
                <h1>Notifikasi</h1>
              </v-col>
              <v-col>
                <v-btn class="float-right" icon="mdi-refresh" @click="doLoadNotifications"></v-btn>
              </v-col>
            </v-row>
            
          </v-container>

          <div v-if="notifications.length <= 0">
            <v-card class="pa-5 text-center">
              <div>
                Kamu tidak mempunyai notifikasi 
              </div>
            </v-card>
          </div>

          <div v-for="notification in notifications">
            <NotificationItem :notification-data="notification" v-on:deleted="onDeleted"></NotificationItem>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>

import NotificationService from '~/service/NotificationService';

const notificationService = new NotificationService();
const notifications = ref([]);

const windowWidth = ref(0);

useSeoMeta({
  title: "Notifikasi"
})


onMounted(async ()=>{
  window.addEventListener("resize", onResize);
  await loadNotifications();
  resizeEditorToWindow();
})

const doLoadNotifications = async() => {
  await loadNotifications();
}

onUnmounted(()=>{
  window.removeEventListener("resize", onResize);
});

const onResize = (e) => {
  resizeEditorToWindow();
}

const loadNotifications = async()=>{
  notifications.value = await notificationService.fetchUserNotification();
}

const onDeleted = async () => {
  await loadNotifications();
}

const resizeEditorToWindow = () => {
  windowWidth.value = window.innerWidth;
}
</script>