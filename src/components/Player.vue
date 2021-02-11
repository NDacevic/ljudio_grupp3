<template>
  <div class="player">
    <div id="yt-player" style="display:none"></div>
    <p>{{ videoTitle }}</p>
    <div class="player-seekbar">
      <input
        type="range"
        min="0"
        v-on:click="playFromTime"
        v-bind:max="this.songDuration"
        v-model="this.songProgress"
      />
    </div>
    <figure v-on:click="playPrev()">Previous</figure>
    <figure v-on:click="play()">Play</figure>
    <figure v-on:click="pause()">Pause</figure>
    <figure v-on:click="playNext()">Next</figure>
  </div>
</template>

<script>
export default {
  name: "Player",
  methods: {
    playPrev() {
      window.player.previousVideo();
    },
    play() {
      let videoId = this.$store.getters.getCurrentSong;
      window.player.loadVideoById(videoId);
      window.player.playVideo();
      window.player.setVolume(10);
    },
    pause() {
      window.player.pauseVideo();
    },
    playNext() {
      //window.player.nextVideo();
    },
    getSong() {
      this.currentSong = this.$store.getCurrentSong;
    },
    playFromTime: function(event) {
      window.player.seekTo(event.target.value, true);
    },
    updateSeekBar() {
      setInterval(
        function() {
          this.songDuration = window.player.getDuration();
          this.songProgress = window.player.getCurrentTime();
        }.bind(this),
        1000
      );
    },
  },
  data() {
    return {
      videoTitle: "An Interesting Title",
      duration: Number,
      progress: Number,
      num: 25,
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
    songProgress: {
      get: function() {
        return this.progress;
      },
      set: function(value) {
        this.progress = value;
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
