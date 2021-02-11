<template>
  <div id="searchComponent">
    <p>Search here:</p>
    <input id="searchbox" type="text" placeholder="Search for Song, Album, Artist or Playlist...">
    
    <!-- TODO: Only render after a search has been performed -->
    <md-tabs id="tab-container" class="md-black" v-if="1">
      <md-tab @contextmenu.prevent.stop="showMenuOnClick($event)" id="tab-songs" md-label="Songs" @click="{}"></md-tab>
      <md-tab id="tab-albums" md-label="Albums" @click="{}"></md-tab>
      <md-tab id="tab-artists" md-label="Artists" @click="{}"></md-tab>
      <md-tab id="tab-playlists" md-label="Playlists" @click="{}"></md-tab>
    </md-tabs>

    <div id="searchResultsContainer" v-for="(media, index) in getSearchContent" 
      :key="index">
      <p>{{index}}</p>
    </div>
      <OptionsMenu
       :elementId="'myUniqueId'"
       :ref="'OptionsMenu'"
       @option-clicked="optionClicked1"
      />
  </div>
</template>

<script>

import OptionsMenu from "../components/OptionsMenu"

export default {
  name: "Search",
  data() {
return {
      
    }
  },
  components: {
    OptionsMenu
  },
  methods: {
    showMenuOnClick (event) {
    this.$refs.OptionsMenu.showMenu(event)
        },
        optionClicked1 (event) {
        alert("hej")
      window.alert(JSON.stringify(event))
    },
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
