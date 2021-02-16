<template>
  <div class="player">
    <div class="thumbnail-container">
      <img
        v-if="
          currentTrack.thumbnails !== undefined && currentTrack.type === 'song'
        "
        :src="currentTrack.thumbnails[1].url"
      />
      <img
        v-if="
          currentTrack.thumbnails !== undefined && currentTrack.type === 'video'
        "
        :src="currentTrack.thumbnails.url"
      />
    </div>
    <section class="controls-container">
      <div class="controls-container-seekbar">
        <p
          v-if="
            currentTrack.artist == undefined && currentTrack.author == undefined
          "
        ></p>
        <p
          v-if="
            currentTrack.artist != undefined && currentTrack.type === 'song'
          "
        >
          {{ currentTrack.artist.name + " - " + currentTrack.name }}
        </p>
        <p
          v-if="
            currentTrack.author != undefined && currentTrack.type === 'video'
          "
        >
          {{ currentTrack.author + " - " + currentTrack.name }}
        </p>
        <div>
          <p>{{ convertSecondsToTimeString(this.trackProgress) }}</p>
          <input
            type="range"
            min="0"
            v-bind:max="trackDuration"
            v-on:click="playFromTime"
            v-bind:value="trackProgress"
          />
          <p>{{ convertSecondsToTimeString(this.trackDuration) }}</p>
        </div>
      </div>
      <div class="controls-container-buttons">
        <figure
          :class="{ active: this.$store.getters.getTrackHistoryLength < 1 }"
          v-on:click="playPrev()"
        >
          <i class="material-icons-round">skip_previous</i>
        </figure>
        <div class="playPause">
          <figure v-if="!playing" v-on:click="play()">
            <i class="material-icons-round">play_arrow</i>
          </figure>
          <figure v-if="playing" v-on:click="pause()">
            <i class="material-icons-round">pause</i>
          </figure>
        </div>
        <figure
          :class="{ active: this.$store.getters.getQueuedTracksLength < 1 }"
          v-on:click="playNext()"
        >
          <i class="material-icons-round">skip_next</i>
        </figure>
        <figure v-on:click="showPlayer()">
          <i class="material-icons-round">music_video</i>
        </figure>
        <!--Volume control-->
        <div class="volume-control">
          <div class="mutePlayer-container">
            <figure v-if="!muted" v-on:click="playerMute">
              <i class="material-icons-round">volume_up</i>
            </figure>
            <figure v-if="muted" v-on:click="playerMute">
              <i class="material-icons-round">volume_off</i>
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
    play() {
      window.player.playVideo();
    },
    pause() {
      window.player.pauseVideo();
    },
    playNext() {
      let media;
      if (this.$store.getters.getQueuedTracks.length > 0) {
        media = this.$store.state.queuedTracks[0];
        this.$store.dispatch("setTrackToPlay", { media, caller: "playNext" });
        this.$store.commit("removeTopFromQueue");
        return true;
      } else {
        return false;
      }
    },
    playPrev() {
      console.log(this.$store.getters.getTrackHistoryLength);
      if (this.$store.state.trackHistory.length > 0) {
        let media = this.$store.state.trackHistory[this.$store.state.trackHistory.length-1];
        this.$store.commit("addTrackToTopOfQueue", this.$store.state.currentTrack)
        this.$store.dispatch("setTrackToPlay", { media, caller: "playPrev" });
        this.$store.commit("removeFromBottomOfHistory");
      }
    },
    showPlayer() {
      if (window.YT.player !== null || window.YT.player !== undefined) {
        let player = document.getElementById("yt-player");

        if (player.style.display == "none") {
          player.style.display = "block";
        } else {
          player.style.display = "none";
        }
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
              this.trackProgress = window.player.getCurrentTime();
            }
          }
        }.bind(this),
        1000
      );
    },
    initYoutubePlayer() {
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      if (window.YT.loaded === 1 && window.player == null) {
        if (window.player === undefined || window.player === null) {
          this.createPlayer();
        }
      } else {
        window.onYouTubeIframeAPIReady = () => {
          if (window.player == null) {
            this.createPlayer();
          }
        };
      }
    },
    createPlayer() {
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
          // console.log("unstarted");
          this.trackDuration = window.player.getDuration();
          break;
        case 0:
          // console.log("ended");
          if (!this.playNext()) {
            window.player.stopVideo();
          }
          break;
        case 1:
          // console.log("playing");
          this.playing = true;
          break;
        case 2:
          // console.log("paused");
          this.playing = false;
          break;
        case 3:
          //  console.log("buffering");
          break;
      }
    },
    convertSecondsToTimeString(inputSeconds) {
      if (isNaN(inputSeconds)) return "0:00";

      let seconds = Math.floor(inputSeconds);
      let minutes = Math.floor(seconds / 60);
      let remainingSeconds = seconds % 60;
      if (remainingSeconds.toString().length === 1) {
        return minutes + ":0" + remainingSeconds;
      } else {
        return minutes + ":" + remainingSeconds;
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
      muted: false,
    };
  },
  computed: {
    trackDuration: {
      get: function() {
        return this.duration;
      },
      set: function(value) {
        this.duration = value;
      },
    },
    trackProgress: {
      get: function() {
        return this.progress;
      },
      set: function(value) {
        if (value != null) {
          this.progress = value;
        }
      },
    },
    currentTrack() {
      return this.$store.state.currentTrack;
    },
  },
  mounted() {
    this.initYoutubePlayer();
    this.updateSeekBar();
  },
};
</script>
