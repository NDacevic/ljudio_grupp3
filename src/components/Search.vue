<template>
  <div id="searchComponent">
    <div id="yt-player" style="display:none"></div>
    <input id="searchbox" type="text" placeholder="Search for Song, Album, Artist or Playlist..." v-model="searchString" @keyup.enter="setMediaType('songs'), getMedia(), setSearchHasBeenPerformedToTrue()">
    <md-tabs id="tab-container" class="md-transparent" v-if="this.searchHasBeenPerformed===true">
      <md-tab id="tab-songs" md-label="Songs" @click="setMediaType('songs'), getMedia()"></md-tab>
      <md-tab id="tab-albums" md-label="Albums" @click="setMediaType('albums'), getMedia()"></md-tab>
      <md-tab id="tab-artists" md-label="Artists" @click="setMediaType('artists'), getMedia()"></md-tab>
      <md-tab id="tab-playlists" md-label="Playlists" @click="setMediaType('playlists'), getMedia()"></md-tab>
    </md-tabs>
     <div id="searchResultsContainer" v-if="this.searchHasBeenPerformed===true">
        <div class="mediaContainer" v-for="(media, index) in getSearchContent" 
          :key="index">
          <button @contextmenu.prevent.stop="showOptionsOnClick($event,media)" class="listButton" v-if="media.type === 'song'" @click="setSongToPlay(media)">
          <button class="listButton" v-if="media.type === 'song'" @dblclick="setSongToPlay(media)">
            <p>{{media.name}} {{media.duration}} {{media.album.name}}</p>
          </button>
          <button class="listButton" v-if="media.type === 'album'">
            <p>{{media.name}} {{media.artist}} {{media.year}}</p>
          </button>
          <button class="listButton" v-if="media.type === 'artist'">
            <p>{{media.name}}</p>
          </button>
          <button class="listButton" v-if="media.type === 'playlist'">
            <p>{{media.name}}</p>
          </button>
        </div>
      </div>
      <OptionsMenu
       :elementId="'myUniqueId'"
       :ref="'OptionsMenu'"
       @option-clicked="setOption"
      />
  </div>
  
</template>

<script>
let song= {}
import OptionsMenu from "../components/OptionsMenu"

export default {
  name: "Search",

  data() {
return {
      searchString: "",
      mediaType: "songs",
      searchHasBeenPerformed: false,
    }
  },
  components: {
    OptionsMenu
  },
  methods: {
    getMedia(){
      this.$store.dispatch('getSearchResults', {media: this.mediaType, searchString: this.searchString})
    },
    setMediaType(mediaType) {
      this.mediaType = mediaType
    },
    setSearchHasBeenPerformedToTrue() {
      this.searchHasBeenPerformed=true;
    },
    setSongToPlay(media) {
      console.log(media.videoId)
      this.$store.commit("setSongToPlay", media);
      this.$store.dispatch("setSongToPlay", media);
    },
    showOptionsOnClick (event,media) {
    
      song = media
      this.$refs.OptionsMenu.showMenu(event)
    },
    setOption (event) { 

      let artist = song.artist.name;
      let songName = song.name;
      let songDuration = song.duration;
      
      if(event.option.slug=='queue')
      {
        this.queuedTracks.push({name:songName,artist:artist,duration:songDuration})
      }
      if(event.option.slug=='add')
      {
        //Add to playlist
      }
    },
  },
      
  computed: {
    getSearchContent() {
      return this.$store.getters.getSearchContent;
    },
        queuedTracks: {
        get() {
            return this.$store.getters.getQueuedTracks;
        },
        set(newQueue) {
            this.$store.commit('updateQueue', newQueue);
        }
    }
    
  },
}
</script>

<style lang="scss">
#searchComponent {
  position:relative;
  width: 100%;
  display: flex;
  flex-direction: column;

  .listButton {
    width: 100%;
    height: 100%;
    text-align: left;
    background-color: black;
    border: none;

    &>p{
      font-size: 14px;
      margin-left: 20px;
      color: white;
        &:hover{
        color:royalblue;
    };
    }
  }

  #tab-songs {
    color:white;
  }

  #searchbox {
    width: 80%;
    height: 50px;
    margin: 10px auto 10px auto;
    border-radius: 50px;
  }

  #tab-container {
    background-color: rgb(63, 63, 63);
  }

  button {
    color: black;
    &:focus {
      color: #448aff
    }
  }

  .mediaContainer {
    color: white;
    border-bottom: 1px gray solid;
    height: 50px
  }

  #searchResultsContainer {
    overflow-y: scroll;
  }
}
</style>
