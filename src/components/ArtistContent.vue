<template>
  <div class="artistContainer">
    
    <div class="artistImage">
      <h1 class="artistHeader">{{ selectedArtist.name }}</h1>
      <p class="artistDescription">{{ `${selectedArtist.artist.description.substring(0, 200)}...` }}</p>
      <img :src="selectedArtist.artist.thumbnails[2].url">
    </div>
    <md-table v-model="selectedArtist" md-fixed-header>
      <md-table-row 
        v-for="(album, index) in selectedArtist.albums" 
        :key="index" 
        @dblclick="setAlbumBrowseId(album)"
      >
        <img :src="album.thumbnails[0].url">
        <md-table-cell md-label="Albums">{{ album.name }}</md-table-cell>
        <md-table-cell md-label="Year">{{ album.year }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  computed: {
    selectedArtistBrowseId: {
      get() {
        return this.$store.getters.getSelectedArtistBrowseId;
      }
    },
    selectedArtist: {
      get() {
        return this.$store.getters.getSelectedArtist ?? {};
      }
    },
  },
  created() {
    this.$store.dispatch('fetchArtistByBrowseId', this.selectedArtistBrowseId);
  },
  methods: {
    setAlbumBrowseId(album) {
      this.$store.commit("setSelectedAlbumBrowseId", album.browseId);
      this.$store.commit("setComponentToRenderInHomeCenter", "album");
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
.md-content {
  height: 100%;
  max-height: 100%;
}
.md-content .md-table-content .md-scrollbar .md-theme-default {
  height: 100%;
  max-height: 100%;
}
.artistImage {
  display: flex;
  overflow: hidden;
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
</style>
