<template>
  <div class="homeContainer">
    <div class="leftBar">
      <p>Left Sidebar</p>
      <!-- Komponent 1 -->
    </div>
    <div class="centerContent">
      <Search />
      <!-- Komponent 2 -->
    </div>
    <div class="rightBarTop">
      <Queue />
    </div>
    <div class="rightBarBottom">
      <Playlists />
      <!-- Komponent 4 -->
    </div>
    <div class="bottomBar">
      <Player />
      <!-- Komponent 5 -->
    </div>
  </div>
</template>

<script>

import Search from "../components/Search";
import Playlists from "../components/Playlists";
import Player from "../components/Player";
import Queue from "../components/Queue";

export default {
  name: "Home",
  components: {
    Search,
    Playlists,
    Player,
    Queue
  },
  computed: {
    getComponentToRenderInCenter() {
      return this.$store.getters.getCenterComponentForHome;
    }
  }
}
</script>

<style scoped>
.homeContainer {
  display: grid;
  grid-template-columns: 200px auto 400px;
  grid-template-rows: 40vh 40vh auto;
  height: 100%;
}

.leftBar {
  /* @TODO: Remove all colors */
  background-color: rgb(4, 97, 179);
  grid-row: 1 / span 2;
}

.centerContent {
  display: flex;
  background-color: rgb(0, 0, 0);
  grid-row: 1 / span 2;
}

.rightBarTop {
  display: flex;
  background-color: rgb(0, 0, 0);
  grid-row: 1;
}

.rightBarBottom {
  grid-row: 2;
}
</style>
