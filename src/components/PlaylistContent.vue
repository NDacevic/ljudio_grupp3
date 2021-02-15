<template>
  <div class="playlistContent">
      <h3>Playlist</h3>
    <li
      v-for="(media, index) in playlist"
      :key="index"
      @dblclick="playSong(media)"
    >
      <div class="listItem">
            <p>{{ media.name }}</p>
            <p>{{ media.artist.name }}</p>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  name: "PlaylistContent",
  computed: {
    currentPlaylistId: {
      get() {
        return this.$store.getters.getCurrentPlaylistId;
      }
    },
    playlist: {
      get() {
        return this.$store.getters.currentPlaylist;
      },
      set (updatedPlaylist) {
        this.$store.commit("setCurrentPlaylist", updatedPlaylist);
      }
    }
  },
  methods: {
    playSong(media){
      this.$store.dispatch("setSongToPlay", media);
    }
  },
    mounted() {
      this.$store.dispatch("getCurrentPlaylist", this.currentPlaylistId);
      console.log(this.currentPlaylistId);
  }

};
</script>

<style>
#playlistContent {
  color: white;
}
</style>
