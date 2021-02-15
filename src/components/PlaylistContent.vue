<template>
  <div>
      <h3>Playlist</h3>
    <li
      v-for="(song, index) in getCurrentPlaylist"
      :key="index"
      @dblclick="playSong(song)"
    >
      <div class="listItem">
        <p>{{song.PlaylistId}}</p>
        console.log(song.PlaylistId)
        <p>{{song.Title}}</p>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  name: "PlaylistContent",
  computed: {
        getCurrentPlaylist() {
        return this.$store.getters.getCurrentPlaylist;
    }
  },
  methods: {
    playSong(media){
      this.$store.dispatch("setSongToPlay", media);
    }
  },
    mounted() {
      return this.$store.getters.getCurrentPlaylist;
  }

};
</script>

<style>
#placeholder {
  color: white;
}
</style>
