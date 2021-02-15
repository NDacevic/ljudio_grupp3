<template>
  <div id="leftMenu">
    <div id="notifications">
      Notifications
      <button v-if="getNewNotifications.length > 0" id="newNotifications">{{getNewNotifications.length}}</button>
      <button id="noNewNotifications" v-else>0</button>
    </div>

    <button id="searchButton" @click="renderEmptySearchPageInCenter()">
      <p>Search</p>
    </button>
    <button id="logOutButton">
      <p>Log out</p>
    </button>
  </div>
</template>

<script>
export default {
  name: "LeftMenu",
  methods: {
    renderEmptySearchPageInCenter() {
      this.$store.commit("setComponentToRenderInHomeCenter", "search");
      this.$store.commit("setSearchResults", []);
      this.$store.commit("setSearchHasBeenPerformed", false);
    },
  },
  computed: {
    getNewNotifications() {
      return this.$store.getters.getNewNotifications;
    },
  },
};
</script>
