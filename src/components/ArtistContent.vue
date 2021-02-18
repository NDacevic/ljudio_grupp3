<template>
  <div class="artistContainer" v-if="selectedArtist.artist != undefined">
    <div class="artistImage">
      <h1 class="artistHeader">{{ selectedArtist.name }}</h1>
      <p class="artistDescription">
        {{ `${selectedArtist.artist.description.substring(0, 200)}...` }}
      </p>
      <img :src="selectedArtist.artist.thumbnails[2].url" />
    </div>
    <md-table v-model="selectedArtist" md-fixed-header>
      <md-table-row
        v-for="(album, index) in selectedArtist.albums"
        :key="index"
        @dblclick="setAlbumBrowseId(album)"
        @contextmenu.prevent.stop="fetchSelectedAlbum(album, false), showOptionsOnClick($event, album)"
      >
        <md-table-cell class="imageCell">
          <div class="albumImage">
            <button
              @click="fetchSelectedAlbum(album, true)"
              class="md-icon-button md-raised md-accent temp"
            >
              <i class="material-icons-round">play_arrow</i>
            </button>
            <img :src="album.thumbnails[0].url">
          </div>
        </md-table-cell>
        <md-table-cell md-label="Album">{{ album.name }}</md-table-cell>
        <md-table-cell md-label="Year">{{ album.year }}</md-table-cell>
      </md-table-row>
    </md-table>
    <OptionsMenu :elementId="'optionMenuId'" :options="menuOptions" :ref="'optionMenu'" @option-clicked="setOption" />
    <OptionsMenu :elementId="'playlistMenuId'" :options="playlistOptions" :ref="'playlistMenu'" @option-clicked="setOption" />
    <OptionsMenu :elementId="'artistMenuId'" :options="artistOptions" :ref="'artistMenu'" @option-clicked="setOption" />
  </div>
</template>

<script>
import OptionsMenu from "./OptionsMenu";

export default {
  components: {
    OptionsMenu
  },
  computed: {
    selectedArtistBrowseId: {
      get() {
        return this.$store.getters.getSelectedArtistBrowseId;
      },
    },
    selectedArtist: {
      get() {
        return this.$store.getters.getSelectedArtist ?? {};
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
    selectedAlbum: {
      get() {
        return this.$store.getters.getSelectedAlbum ?? {};
      }
    }
  },
  created() {
    this.$store.dispatch("fetchArtistByBrowseId", this.selectedArtistBrowseId);
  },
  methods: {
    setAlbumBrowseId(album) {
      this.$store.commit("setSelectedAlbumBrowseId", album.browseId);
      this.$store.commit("setComponentToRenderInHomeCenter", "album");
    }, 
    showOptionsOnClick(event) {
      this.$refs.optionMenu.showMenu(event);
    },
    setOption(event) {
      if (event.option.slug == "queue") {
        this.queuedTracks.push(...this.selectedAlbum.tracks);
      }
      if (event.option.slug == "add") {
        // Add selectedAlbum to playlist
      }
      if (event.option.slug == "share") {
        const album = this.selectedAlbum;
        console.log(album);
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
    async fetchSelectedAlbum(album, playAlbum) {
      await this.$store.dispatch("fetchAlbumByBrowseId", album.browseId);
      if (playAlbum) {
        this.playAlbum();
      }
    },
    playAlbum() {
      this.$store.dispatch("setTrackToPlay", {
        media: this.selectedAlbum.tracks[0],
        caller: "search",
      });
      this.queuedTracks = this.selectedAlbum.tracks.slice(1, this.selectedAlbum.tracks.length);
    }
  },
  data() {
    return {
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
      ],
      artistOptions: [
        {
          name: "Share",
          slug: "share",
        },
      ],
      playlistOptions: [
        {
          name: "Add to queue",
          slug: "queue",
        },
        {
          name: "Share",
          slug: "share",
        },
      ],
    }
  }
}
</script>

<style scoped>
.artistContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.artistHeader {
  margin-top: 20px;
  margin-left: 20px;
  font-size: 40px;
  color: rgb(255, 255, 255);
  filter: drop-shadow(0px 0px 5px rgb(26, 26, 26));
  background: none;
  top: 0;
  position: absolute;
}

.md-content .md-table-content .md-scrollbar .md-theme-default {
  height: 100%;
  max-height: 100%;
}

.artistImage {
  display: flex;
  height: 45%;
  flex-direction: column;
}

.artistDescription {
  width: 50%;
  position: absolute;
  margin-left: 20px;
  margin-top: 50px;
  background-color: transparent;
  filter: drop-shadow(0px 0px 5px rgb(26, 26, 26));
}
.albumImage {
  position: relative;
  width: 226px;
  height: 226px;
}

.temp {
  position: absolute;
  left: calc(50% - 60px);
  bottom: calc(50% - 60px);
  width: 120px;
  height: 120px;
  color: transparent;
  background-color: transparent !important;
}
.temp > i {
  background-color: transparent;
  font-size: 70px;
  color: rgba(200, 200, 200, 0.6);
  filter: drop-shadow(0px 0px 1px rgb(26, 26, 26));
}
.md-icon-button :hover {
  cursor: pointer;
}

.imageCell {
  width: 226px;
  height: 226px;
}
</style>
