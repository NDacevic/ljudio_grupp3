<template>
  <div class="homeContainer">
    <div class="leftBar">
      <p>Left Sidebar</p>
      <!-- Komponent 1 -->
    </div>
    <div class="centerContent">
      <Search v-if="renderCenterComponent === 'search'" />
      <AlbumContent v-if="renderCenterComponent === 'album'" />
      <ArtistContent v-if="renderCenterComponent === 'artist'" />
      <PlaylistContent v-if="renderCenterComponent === 'playlist'" />
      <div id="yt-player" style="display:none"></div>
    </div>
    <section class="rightBar">
    <div class="rightBarTop">
      <Queue />
    </div>
    <div class="rightBarBottom">
      <p>Right Sidebar Bottom</p>
      <!-- Komponent 4 -->
    </div>
    </section>
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
    PlaylistContent,
  },
  computed: {
    renderCenterComponent() {
      return this.$store.getters.getCenterComponentForHome;
    },
  },
};
</script>