<template>
  <div id="leftMenu">
    <div id="notifications">
      Notifications
      <button v-if="getNewNotifications.length > 0" id="newNotifications" @click="setRenderNotificationsModalTrue">{{getNewNotifications.length}}</button>
      <button id="noNewNotifications" v-else>0</button>
    </div>
    
    <NotificationsPopUp v-if="renderNotificationsModal===true && newNotifications.length > 0"/>

    <button id="searchButton" @click="renderEmptySearchPageInCenter()">
      <p>Search</p>
    </button>
    <button id="logOutButton" @click="logOut">
      <p>Log out</p>
    </button>
  </div>
</template>

<script>

import NotificationsPopUp from "./NotificationsPopUp"

export default {
  name: "LeftMenu",
  components: {
    NotificationsPopUp
  },
  methods: {
    renderEmptySearchPageInCenter() {
      if (this.checkWhichComponentIsRenderedInCenter !== "search") {
        this.$store.commit("setComponentToRenderInHomeCenter", "search");
      this.$store.commit("setSearchResults", []);
      this.$store.commit("setSearchHasBeenPerformed", false);
      }      
    },
    logOut() {
      this.$store.dispatch("logOut")  
    },
    setRenderNotificationsModalTrue() {
      this.$store.commit("setRenderNotificationsModal", true)
    }
  },
  computed: {
    getNewNotifications() {
      return this.$store.getters.getNewNotifications;
    },
    renderNotificationsModal() {
      return this.$store.getters.getRenderNotificationsModalStatus;
    },
    checkWhichComponentIsRenderedInCenter() {
      return this.$store.getters.getCenterComponentForHome
    },
    newNotifications() {
      return this.$store.getters.getNewNotifications;
    },
  },
};
</script>
