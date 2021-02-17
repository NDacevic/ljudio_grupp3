<template>
  <div class="artistContainer" v-if="selectedAlbum != undefined">
    <div class="albumImage">
      <img class="image" :src="selectedAlbum.thumbnails[2].url"/>
      <div class="infoContainer">
        <h1 class="albumHeader">{{ selectedAlbum.title }}</h1>
        <p class="albumDescription">
          {{ `${selectedAlbum.description.substring(0, 200)}...` }}
        </p>
      </div>
    </div>
    <div class="artistFooter">
      <md-button @click="playAlbum(selectedAlbum)">Play</md-button>
      <md-button>Add to Playlist</md-button>
      <md-button>Share Album</md-button>
    </div>
    <md-table v-model="selectedAlbum" md-fixed-header>
      <md-table-row
        v-for="(track, index) in selectedAlbum.tracks"
        :key="index"
        @dblclick="playSong(track)"
        @contextmenu.prevent.stop="showOptionsOnClick($event, track)"
      >
        <md-table-cell md-label="Tracks">{{ track.name }}</md-table-cell>
        <md-table-cell md-label="Duration">{{ track.duration }}</md-table-cell>
      </md-table-row>
    </md-table>
    <OptionsMenu
      :elementId="'myUniqueId'"
      :ref="'OptionsMenu'"
      @option-clicked="setOption"
    />
  </div>
</template>

<script>
import OptionsMenu from "./OptionsMenu";

export default {
  components: {
    OptionsMenu,
  },
  computed: {
    selectedAlbumBrowseId: {
      get() {
        return this.$store.getters.getSelectedAlbumBrowseId;
      },
    },
    selectedAlbum: {
      get() {
        return this.$store.getters.getSelectedAlbum ?? {};
      },
    },
    queuedTracks: {
      get() {
        return this.$store.getters.getQueuedTracks;
      },
      set(newQueue) {
        this.$store.commit("updateQueue", newQueue);
      },
    },
  },
  created() {
    this.$store.dispatch("fetchAlbumByBrowseId", this.selectedAlbumBrowseId);
  },
  methods: {
    playSong(track) {
      this.$store.dispatch("setTrackToPlay", {
        media: track,
        caller: "search",
      });
    },
    showOptionsOnClick(event, track) {
      this.selectedTrack = track;
      this.$refs.OptionsMenu.showMenu(event);
    },
    setOption(event) {
      if (event.option.slug == "queue") {
        this.queuedTracks.push(this.selectedTrack);
      }
      if (event.option.slug == "add") {
        //Add to playlist
      }
      if (event.option.slug == "share") {
        //@TODO: Share selectedTrack
      }
    },
    playAlbum(album) {
      this.$store.dispatch('setSongToPlay', album.tracks[0]);
      this.queuedTracks = album.tracks.slice(1, album.tracks.length);
    },
    addAlbumToPlaylist(/* album */) {
      //@TODO: Add album to playlist
    },
    shareAlbum(/* album */) {
      //@TODO: Share album
    }
  },
  data() {
    return {
      selectedTrack: Object
    };
  },
};
</script>

<style scoped>
.albumImage {
  display: flex;
}
.artistContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.albumHeader {
  margin-top: 20px;
  margin-left: 20px;
  font-size: 40px;
  color: rgb(255, 255, 255);
  filter: drop-shadow(0px 0px 5px rgb(26, 26, 26));
  background: none;
}
.md-content {
  height: 100%;
  max-height: 100%;
}
.md-content .md-table-content .md-scrollbar .md-theme-default {
  height: 100%;
  max-height: 100%;
}
.albumDescription {
  width: 50%;
  font-size: 15px;
  margin-left: 20px;
  margin-top: 20px;
  background: none;
  box-shadow: black;
  filter: drop-shadow(0px 0px 1px rgb(26, 26, 26));
}
.image {
  display: inline-block;
  width: auto;
  height: 100%;
}
.infoContainer {
  display: inline-block;
}
.artistFooter {
  display: inline-block;
  margin-left: auto;
}
</style>
