<template>
  <div class="playlistContent">
    <div class="head">
      <h1 v-if="playlist[0] !== undefined">{{ playlist[0].PlaylistName }}</h1>
      <h1 v-else>Playlist error</h1>
      <button v-on:click="addToQueue()">Add to queue</button>
    </div>
    <md-table v-model="playlist" md-fixed-header class="md-scrollbar">
      <md-table-row
        v-for="(track, index) in playlist"
        :key="index"
        @dblclick="playSong(track)"
        @contextmenu.prevent.stop="showOptionsOnClick($event, track)"
      >
        <md-table-cell md-label="Title">{{ track.Title }}</md-table-cell>
        <md-table-cell md-label="Artist">{{ track.Artist }}</md-table-cell>
        <md-table-cell md-label="Album">{{ track.AlbumName }}</md-table-cell>
        <md-table-cell md-label="Duration">{{ convertMillisecondsToTimeString(track.Duration) }}</md-table-cell>
      </md-table-row>
    </md-table>
    <OptionsMenu
      :elementId="'optionMenuId'"
      :options="menuOptions"
      :ref="'optionMenu'"
      @option-clicked="setOption"
    />
  </div>
</template>

<script>
import OptionsMenu from "./OptionsMenu";

export default {
  name: "PlaylistContent",
  components: {
    OptionsMenu,
  },
  computed: {
    playlist() {
      return this.$store.getters.getCurrentPlaylist;
    },
  },
  data() {
    return {
      menuOptions: [
        {
          name: "Add to queue",
          slug: "queue",
        },
        {
          name: "Share",
          slug: "share",
        },
      ],
      selectedTrack: Object,
    };
  },
  methods: {
    playSong(track) {
      this.$store.dispatch("getMediaObjectAndAddToQueueOrPlay", {
        addToQueue: false,
        sharedContentType: track.contentType,
        sharedContentId: track.videoId,
      });
    },
    addToQueue() {
      for (let track of this.playlist) {
        this.$store.dispatch("getMediaObjectAndAddToQueueOrPlay", {
          addToQueue: true,
          sharedContentType: track.contentType,
          sharedContentId: track.videoId,
        });
      }
    },
    showOptionsOnClick(event, track) {
      this.selectedTrack = track;
      this.$refs.optionMenu.showMenu(event);
    },
    setOption(event) {
      if (event.option.slug == "queue") {
        this.$store.dispatch("getMediaObjectAndAddToQueueOrPlay", {
          addToQueue: true,
          sharedContentType: this.selectedTrack.contentType,
          sharedContentId: this.selectedTrack.videoId,
        });
      }
      if (event.option.slug == "share") {
        this.$store.commit("showShareComponent", true);
        this.$store.commit("setShareMedia", {
          name: this.selectedTrack.Title,
          artist: {
            name: this.selectedTrack.Artist,
          },
          type: this.selectedTrack.contentType,
          videoId: this.selectedTrack.videoId,
        });
      }
    },
    convertMillisecondsToTimeString(milliseconds) {
      let seconds = milliseconds / 1000;
      let minutes = Math.floor(seconds / 60);
      let remainingSeconds = seconds % 60;
      if (remainingSeconds.toString().length === 1) {
        return minutes + ":0" + remainingSeconds;
      } else {
        return minutes + ":" + remainingSeconds;
      }
    },
  },
};
</script>

<style lang="scss">
.playlistContent {
  color: white;
  width: 100%;
  height: 100%;

  & .head {
    margin-top: 5vh;
    margin-bottom: 10vh;
    margin-left: 1vw;

    & button {
      margin-top: 2vh;
      border-radius: 50%;
      font-weight: semi-bold;
      border-radius: 20px;
      padding: 5px;
      border: 1px white solid;
      background-color: black;
      padding: 6px;
    }
  }
}
</style>
