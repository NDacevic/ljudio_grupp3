<template>
  <div class="player">
    <div id="yt-player" style="display:none"></div>
    <p>{{ videoTitle }}</p>
    <div class="player-seekbar">
      <input type="range" v-bind:value="this.songDuration" />
    </div>
    <figure v-on:click="PlayPrev()">Previous</figure>
    <figure v-on:click="Play()">Play</figure>
    <figure v-on:click="Pause()">Pause</figure>
    <figure v-on:click="PlayNext()">Next</figure>
  </div>
</template>

<script>
export default {
  name: "Player",
  methods: {
    PlayPrev() {
      window.player.previousVideo();
    },
    Play() {
      let videoId = this.$store.getters.getCurrentSong;
      window.player.loadVideoById(videoId);
      window.player.playVideo();
    },
    Pause() {
      window.player.pauseVideo();
    },
    PlayNext() {
      //window.player.nextVideo();
    },
    getSong() {
      this.currentSong = this.$store.getCurrentSong;
    },
    updateSeekBar() {
      setInterval(function() {
        if (window.player.getPlayerState() >= 0) {
          this.songDuration = window.player.getCurrentTime();
        }
      }, 1000);
    },
  },
  data() {
    return {
      videoTitle: "An Interesting Title",
      duration: Number,
    };
  },
  computed: {
    songDuration: {
      get: function() {
        return this.duration;
      },
      set: function(value) {
        this.duration = value;
      },
    },
  },
  mounted() {
    this.duration = 0;
    this.updateSeekBar();
  },
};
</script>

<style></style>
