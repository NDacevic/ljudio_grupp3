<template>
  <div class="player">
<<<<<<< HEAD
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
=======
    <div id="yt-player"></div>
    <div class="player-seekbar">
      <input type="range" min="0" max="100" />
>>>>>>> 41cf501... Fixed conflicts
    </div>
    <figure v-on:click="PlayPrev()">Previous</figure>
    <figure v-on:click="Play()">Play</figure>
    <figure v-on:click="Pause()">Pause</figure>
<<<<<<< HEAD
    <figure v-on:click="PlayNext()">Next</figure>
=======
    <figure v-on:click="PlayPrev()">Next</figure>
>>>>>>> 41cf501... Fixed conflicts
  </div>
</template>

<script>
export default {
  name: "Player",
  methods: {
    PlayPrev() {
<<<<<<< HEAD
      window.player.previousVideo();
    },
    Play() {
      let videoId = this.$store.getters.getCurrentSong;
      window.player.loadVideoById(videoId);
      window.player.playVideo();
      window.player.setVolume(10);
    },
    Pause() {
      window.player.pauseVideo();
    },
    PlayNext() {
      //window.player.nextVideo();
=======
      //this.musicPlayer.previousVideo();
    },
    Play() {
      let videoId = "Jb_1A-dz8UQ";
      window.player.loadVideoById(videoId);
      window.player.playVideo();
    },
    Pause() {
      //this.musicPlayer.pauseVideo();
    },
    PlayNext() {
      //this.musicPlayer.nextVideo();
>>>>>>> 41cf501... Fixed conflicts
    },
    getSong() {
      this.currentSong = this.$store.getCurrentSong;
    },
<<<<<<< HEAD
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
=======
  },
  computed: {
    currentSong: Object,
    nextSong: Object,
    previousSong: Object,
>>>>>>> 41cf501... Fixed conflicts
  },
};
</script>

<style></style>
