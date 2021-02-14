<template>
  <div class="player">
    <div class="thumbnail-container">
      <img
        v-if="currentSong.thumbnails != undefined"
        :src="currentSong.thumbnails[1].url"
      />
    </div>
    <section class="controls-container">
      <div class="controls-container-seekbar">
        <p v-if="currentSong.artist == undefined"></p>
        <p v-if="currentSong.artist != undefined">
          {{ currentSong.artist.name + " - " + currentSong.name }}
        </p>
        <input
          type="range"
          min="0"
          v-bind:max="songDuration"
          v-on:click="playFromTime"
          v-bind:value="songProgress"
        />
      </div>
      <div class="controls-container-buttons">
        <figure v-on:click="playPrev()">
          <md-icon class="md-size-2x">skip_previous</md-icon>
        </figure>
        <div class="playPause">
          <figure v-if="!playing" v-on:click="play()">
            <md-icon class="md-size-2x">play_arrow</md-icon>
          </figure>
          <figure v-if="playing" v-on:click="pause()">
            <md-icon class="md-size-2x">pause</md-icon>
          </figure>
        </div>
        <figure v-on:click="playNext()">
          <md-icon class="md-size-2x">skip_next</md-icon>
        </figure>
        <figure v-on:click="showPlayer()">
          <md-icon class="md-size-2x">music_video</md-icon>
        </figure>
        <!--Volume control-->
        <div class="volume-control">
          <div class="mutePlayer-container">
            <figure v-if="!muted" v-on:click="playerMute">
              <md-icon class="md-size-2x">volume_up</md-icon>
            </figure>
            <figure v-if="muted" v-on:click="playerMute">
              <md-icon  class="md-size-2x">volume_off</md-icon>
            </figure>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            :value="volume"
            @mouseup="setVolume"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Player",
  methods: {
    playPrev() {
      if (this.songProgress > 2) {
        window.player.seekTo(0, true);
        this.songProgress = 0;
      }
    },
    play() {
      window.player.playVideo();
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
    setVolume: function(event) {
      this.volume = event.target.value;
      window.player.setVolume(this.volume);
    },
    playerMute() {
      if (window.player.isMuted()) {
        this.muted = false;
        window.player.unMute();
      } else {
        this.muted = true;
        window.player.mute();
      }
    },
    updateSeekBar() {
      this.updateTrackInterval = setInterval(
        function() {
          if (window.player != null) {
            if (window.player.getPlayerState() > 0) {
              this.songProgress = window.player.getCurrentTime();
            }
          }
        }.bind(this),
        1000
      );
    },
    initYoutubePlayer() {
      window.onYouTubeIframeAPIReady = () => {
        window.player = new window.YT.Player("yt-player", {
          height: "640",
          width: "480",
          playerVars: {
            controls: 0,
            showInfo: 0,
          },
          events: {
            onStateChange: this.onPlayerStateChange,
          },
        });
      };
    },
    onPlayerStateChange(event) {
      /* STATES
         -1 – unstarted
          0 – ended
          1 – playing
          2 – paused
          3 – buffering
          5 – video cued */
      switch (event.data) {
        case -1:
          console.log("unstarted");
          this.songDuration = window.player.getDuration();
          break;
        case 0:
          console.log("ended");
          //load next song in playlist
          break;
        case 1:
          console.log("playing");
          this.playing = true;
          break;
        case 2:
          console.log("paused");
          this.playing = false;
          break;
        case 3:
          console.log("buffering");
          break;
      }
    },
  },
  data() {
    return {
      duration: Number,
      progress: Number,
      updateTrackInterval: Object,
      volume: 100,
      playing: false,
      muted:false
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
      return this.$store.state.currentSong;
    },
  },
  mounted() {
    this.initYoutubePlayer();
    this.updateSeekBar();
  },
};
</script>
