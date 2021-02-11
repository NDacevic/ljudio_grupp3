<template>
  <div class="homeContainer">
    <div class="leftBar">
      <p>Left Sidebar</p>
      <!-- Komponent 1 -->
    </div>
    <div class="centerContent">
      <Search v-if="renderCenterComponent==='Search'" />
      <AlbumContent v-if="renderCenterComponent==='Album'" />
      <ArtistContent v-if="renderCenterComponent==='Artist'" />
      <PlaylistContent v-if="renderCenterComponent==='Playlist'" />
    </div>
    <div class="rightBarTop">
      <Queue />
    </div>
    <div class="rightBarBottom">
      <p>Right Sidebar Bottom</p>
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
import Player from "../components/Player";
import Queue from "../components/Queue";

import AlbumContent from "../components/AlbumContent";
import ArtistContent from "../components/ArtistContent";
import PlaylistContent from "../components/PlaylistContent";

export default {
  name: "Home",
  components: {

    Search,
    Player,
    Queue,
    AlbumContent,
    ArtistContent,
    PlaylistContent
  },
  computed: {
    renderCenterComponent() {
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
  background-color: rgb(179, 4, 4);
  grid-row: 2;
}
</style>
