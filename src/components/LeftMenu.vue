<template>
  <div id="leftMenu">
    <div id="notifications">
      Notifications
      <button id="newNotifications">2</button>
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
};
</script>
