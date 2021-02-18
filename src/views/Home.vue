<template>
  <div class="homeContainer">
    <Share v-if="this.$store.getters.getShareComponentVisible" :media="this.$store.getters.getShareMedia" />
    <div class="leftBar">
      <LeftMenu />
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
      <div class="rightBarBottom md-scrollbar">
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
import Share from "../components/ShareComponent";

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
    Share,
  },
  data() {
    return {
      shareRendered: false,
    };
  },
  computed: {
    renderCenterComponent() {
      return this.$store.getters.getCenterComponentForHome;
    },
  },
    beforeMount(){
    this.$store.dispatch("getNewNotifications");
  },
};
</script>