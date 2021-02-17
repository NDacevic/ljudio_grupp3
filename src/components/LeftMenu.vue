<template>
  <div id="leftMenu">
    <div id="navigationArrows">
      <figure id="arrowBack" class="arrows" @click="anything()">
        <i class="material-icons-round">arrow_back_ios_new</i>
      </figure>
      <figure id="arrowForward" class="arrows" @click="anything()">
        <i class="material-icons-round">arrow_forward_ios</i>
      </figure>
    </div>
    <div id="notifications">
      Notifications
      <button v-if="getNewNotifications.length > 0" id="newNotifications" @click="setRenderNotificationsModalTrue">{{ getNewNotifications.length }}</button>
      <button id="noNewNotifications" v-else>0</button>
    </div>

    <NotificationsPopUp v-if="renderNotificationsModal === true" />

    <button id="searchButton" @click="renderEmptySearchPageInCenter()">
      <p>Search</p>
    </button>
    <button id="logOutButton" @click="logOut">
      <p>Log out</p>
    </button>
  </div>
</template>

<script>
import NotificationsPopUp from "./NotificationsPopUp";

export default {
  name: "LeftMenu",
  components: {
    NotificationsPopUp,
  },
  methods: {
    renderEmptySearchPageInCenter() {
      this.$store.commit("setComponentToRenderInHomeCenter", "search");
      this.$store.commit("setSearchResults", []);
      this.$store.commit("setSearchHasBeenPerformed", false);
    },
    logOut() {
      this.$store.dispatch("logOut");
    },
    setRenderNotificationsModalTrue() {
      this.$store.commit("setRenderNotificationsModal", true);
    },
  },
  computed: {
    getNewNotifications() {
      return this.$store.getters.getNewNotifications;
    },
    renderNotificationsModal() {
      return this.$store.getters.getRenderNotificationsModalStatus;
    },
  },
};
</script>
