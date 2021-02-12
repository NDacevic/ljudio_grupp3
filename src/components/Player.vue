<template>
  <div class="player">
    <div class="thumbnail-container">
      <p v-if="currentSong.artist != undefined">{{ currentSong.artist.name +" - " + currentSong.name }}</p>
      <img
        v-if="currentSong.thumbnails != undefined"
        :src="currentSong.thumbnails[1].url"
      />
    </div>
    <div class="controls-container">
      <div class="controls-container-seekbar">
        <input
          type="range"
          min="0"
          v-bind:max="this.songDuration"
          v-on:click="playFromTime"
          v-bind:value="this.songProgress"
        />
      </div>
      <figure v-on:click="playPrev()">
        <md-icon class="md-size-2x">skip_previous</md-icon>
      </figure>
      <figure v-on:click="play()">
        <md-icon class="md-size-2x">play_arrow</md-icon>
      </figure>
      <figure v-on:click="pause()">
        <md-icon class="md-size-2x">pause</md-icon>
      </figure>
      <figure v-on:click="playNext()">
        <md-icon class="md-size-2x">skip_next</md-icon>
      </figure>
      <figure v-on:click="showPlayer()">
        <md-icon class="md-size-2x">music_video</md-icon>
      </figure>
    </div>
  </div>
</template>

<script>
export default {
  name: "Player",
  methods: {
    playPrev() {
      if (this.songProgress < 2) {
        window.player.seekTo(0, true);
        this.songProgress = 0;
      }
    },
    play() {
      window.player.playVideo();
      window.player.setVolume(10);
    },
    pause() {
      window.player.pauseVideo();
    },
    playNext() {},
    showPlayer() {
      let player = document.getElementById("yt-player");

      if (player.style.display == "none") {
        player.style.display = "block";
      } else {
        player.style.display = "none";
      }
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
    onStateChange(event) {
      if (event.data != window.YT.PlayerState.PLAYING) return;
    },
  },
  data() {
    return {
      duration: Number,
      progress: Number,
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
    currentSong() {
      console.log(this.$store.state.currentSong.thumbnails);
      return this.$store.state.currentSong;
    },
  },
  mounted() {
    this.updateSeekBar();
  },
};
</script>
