<template>
  <div class="homeContainer">
    <div class="leftBar">
      <LeftMenu/>
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
      <Playlists />
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
import LeftMenu from "../components/LeftMenu";
import Search from "../components/Search";
import Playlists from "../components/Playlists";
import Player from "../components/Player";
import Queue from "../components/Queue";

import AlbumContent from "../components/AlbumContent";
import ArtistContent from "../components/ArtistContent";
import PlaylistContent from "../components/PlaylistContent";

export default {
  name: "Home",
  components: {
    LeftMenu,
    Search,
    Playlists,
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
    beforeCreated(){
    this.$store.dispatch("getNewNotifications");
  }
};

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
