<template>
  <div id="searchComponent">
    <p>Search here:</p>
    <input id="searchbox" type="text" placeholder="Search for Song, Album, Artist or Playlist...">
    
    <!-- TODO: Only render after a search has been performed -->
    <md-tabs id="tab-container" class="md-black" v-if="1">
      <md-tab id="tab-songs" md-label="Songs" @click="{}"></md-tab>
      <md-tab id="tab-albums" md-label="Albums" @click="{}"></md-tab>
      <md-tab id="tab-artists" md-label="Artists" @click="{}"></md-tab>
      <md-tab id="tab-playlists" md-label="Playlists" @click="{}"></md-tab>
    </md-tabs>

    <div id="searchResultsContainer" v-for="(media, index) in getSearchContent" 
      :key="index">
      <p>{{index}}</p>
    </div>

  </div>
</template>

<script>

export default {
  name: "Search",
  components: {

  },
  methods: {

  },
  computed: {
    getSearchContent() {
      let media = this.$store.getters.getSearchContent;
      return media;
    }
  }
}
</script>

<style>

#tab-songs {
  color:white;
}

#searchbox {
  width: 80%;
  height: 50px;
  border-radius: 50px;
  margin-bottom: 10px;
}

#tab-container {
  background-color: rgb(63, 63, 63);
  
}
</style>
