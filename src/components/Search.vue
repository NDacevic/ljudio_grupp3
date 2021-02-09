<template>
  <div>
    <p>Search here:</p>
    <input id="searchbox" type="text" placeholder="Search for Song, Album, Artist or Playlist...">
    
    <!-- TODO: Only render after a search has been performed -->
    <md-tabs v-if="1">
      <md-tab id="tab-songs" md-label="Songs" @click="{}"></md-tab>
      <md-tab id="tab-albums" md-label="Albums" @click="{}"></md-tab>
      <md-tab id="tab-artists" md-label="Artists" @click="{}"></md-tab>
      <md-tab id="tab-playlists" md-label="Playlists" @click="{}"></md-tab>
    </md-tabs>
    <div id="searchResultsContainer">

    </div>
  </div>
</template>

<script>

export default {
    components: {

    }
}
</script>

<style>
 #searchbox {
     width: 80%;
 }
</style>
