<template>
  <div class="albumContainer">
    <div class="albumImage">
      <img v-if="selectedAlbum != undefined" class="image" :src="selectedAlbum.thumbnails[2].url"/>
      <div class="infoContainer">
        <h1 class="albumHeader">{{ selectedAlbum.title }}</h1>
        <p class="albumDescription">
          {{ `${selectedAlbum.description.substring(0, 200)}...` }}
        </p>
      </div>
    </div>
    <div class="albumFooter">
      <md-button @click="playAlbum(selectedAlbum)">Play</md-button>
      <md-button>Add to Playlist</md-button>
      <md-button @click="shareAlbum(selectedAlbum)">Share Album</md-button>
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
    <OptionsMenu :elementId="'optionMenuId'" :options="menuOptions" :ref="'optionMenu'" @option-clicked="setOption" />
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
        return this.$store.getters.getSelectedAlbum;
      },
    },
    queuedTracks: {
      get() {
        return this.$store.getters.getQueuedTracks;
      },
      set(newQueue) {
        this.$store.commit("updateQueue", newQueue);
      },
    }
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
      this.$refs.optionMenu.showMenu(event);
    },
    setOption(event) {
      if (event.option.slug == "queue") {
        this.queuedTracks.push(this.selectedTrack);
      }
      if (event.option.slug == "add") {
        //Add to playlist
      }
      if (event.option.slug == "share") {
        console.log(this.selectedTrack);
        this.$store.commit("showShareComponent", true);
        this.$store.commit("setShareMedia", {
          name: this.selectedTrack.name,
          artist: {
            name: this.selectedTrack.artistNames,
          },
          type: "song",
          videoId: this.selectedTrack.videoId
        });
      }
    },
    playAlbum(album) {
      this.$store.dispatch("setTrackToPlay", {
        media: album.tracks[0],
        caller: "search",
      });
      this.queuedTracks = album.tracks.slice(1, album.tracks.length);
    },
    addAlbumToPlaylist(/* album */) {
      //@TODO: Add album to playlist
    },
    shareAlbum(album) {
      this.$store.commit("showShareComponent", true);
      this.$store.commit("setShareMedia", {
        name: album.title,
        artist: album.artist[0].name,
        type: "album",
        browseId: album.browseId,
        year: album.year
      });
    }
  },
  data() {
    return {
      selectedTrack: Object,
      menuOptions: [
        {
          name: "Add to playlist",
          slug: "add",
        },
        {
          name: "Add to queue",
          slug: "queue",
        },
        {
          name: "Share",
          slug: "share",
        },
      ]
    };
  },
};
</script>

<style scoped>
.albumImage {
  display: flex;
}
.albumContainer {
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
.albumFooter {
  display: inline-block;
  margin-left: auto;
}
</style>
