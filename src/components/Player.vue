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
        v-bind:value="this.songProgress"
      />
    </div>
    <figure v-on:click="playPrev()">Previous</figure>
    <figure v-on:click="play()">Play</figure>
    <figure v-on:click="pause()">Pause</figure>
    <figure v-on:click="playNext()">Next</figure>
    <figure v-on:click="showPlayer()">Show Player</figure>
  </div>
</template>

<script>
export default {
  name: "Player",
  methods: {
    init() {
      //window.player.addEventListener("onStateChange", this.onStateChange);
    },
    hello() {
      console.log("Hello!");
    },
    playPrev() {},
    play() {
      let videoId = this.$store.getters.getCurrentSong.videoId;
      window.player.loadVideoById(videoId);
      window.player.playVideo();
      window.player.setVolume(10);
      this.startPlaying();
    },
    pause() {
      window.player.pauseVideo();
    },
    playNext() {},
    showPlayer() {
      window.player.setSize(window.outerWidth, "100vh");
      let player = document.getElementById("yt-player");
      
      if (player.style.display == "none") {
        player.style.display = "block";
      } else {
        player.style.display = "none";
      }
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
          if (window.player.getPlayerState() > 0) {
            this.songDuration = window.player.getDuration();
            this.songProgress = window.player.getCurrentTime();
          }
        }.bind(this),
        1000
      );
    },
    startPlaying() {
      this.songDuration = window.player.getDuration();
    },
    onStateChange(event) {
      if (event.data != window.YT.PlayerState.PLAYING) return;
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
        if (value != null) {
          this.progress = value;
        }
      },
    },
  },
  mounted() {
    this.init();
    this.updateSeekBar();
  },
};
</script>

<style></style>
