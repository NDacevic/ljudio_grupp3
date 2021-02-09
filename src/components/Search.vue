<template>
  <div>
       <p>Search here</p>
       <input id="searchbox" type="text" placeholder="Search for Song, Album, Artist or Playlist...">
        <div>
    <md-tabs @md-changed="checkNewPosts">


      <md-tab id="tab-home" md-label="Home"></md-tab>
      <md-tab id="tab-pages" md-label="Pages"></md-tab>
      <md-tab id="tab-posts" md-label="Posts" :md-template-data="{ badge: newPosts }" @click="clearNewPosts"></md-tab>
      <md-tab id="tab-favorites" md-label="Favorites"></md-tab>
    </md-tabs>
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
