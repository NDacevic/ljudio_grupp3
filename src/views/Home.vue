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
      <p>Right Sidebar Top</p>
      <!-- Komponent 3 -->
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

export default {
  name: "Home",
  components: {
    Search,
    Playlists,
    Player
  },
};
</script>

<style scoped>
.homeContainer {
  display: grid;
  grid-template-columns: 200px auto 200px;
  grid-template-rows: 40vh 40vh 20vh;
  height: 100%;
}

.leftBar {
  /* @TODO: Remove all colors */
  background-color: rgb(4, 97, 179);
  grid-row: 1 / span 2;
}

.centerContent {
  background-color: rgb(0, 0, 0);
  grid-row: 1 / span 2;
}

.rightBarTop {
  background-color: rgb(179, 4, 4);
  grid-row: 1;
}

.rightBarBottom {
  grid-row: 2;
}

.bottomBar {
  background-color: rgb(4, 179, 19);
  grid-row: 3;
  grid-column: 1 / span 3;
  height: 20vh;
  /*   width: 100%;
  height: 150px;
  position: absolute;
  z-index: 1;
  bottom: 0; */
}
</style>
