<template>
  <div id="searchComponent">
    <input
      id="searchbox"
      type="text"
      placeholder="Search for Song, Album, Artist or Playlist..."
      v-model="searchString"
      @keyup.enter="getMedia(), setSearchHasBeenPerformedToTrue()"
    />

    <md-tabs
      id="tab-container"
      class="md-transparent"
      v-if="getSearchHasBeenPerformed === true"
    >
      <md-tab
        id="tab-songs"
        md-label="Songs"
        @click="setSearchMediaType('songs'), getMedia()"
      ></md-tab>
      <md-tab
        id="tab-albums"
        md-label="Albums"
        @click="setSearchMediaType('albums'), getMedia()"
      ></md-tab>
      <md-tab
        id="tab-artists"
        md-label="Artists"
        @click="setSearchMediaType('artists'), getMedia()"
      ></md-tab>
      <md-tab
        id="tab-playlists"
        md-label="Playlists"
        @click="setSearchMediaType('playlists'), getMedia()"
      ></md-tab>
    </md-tabs>
    <div id="searchResultsContainer" v-if="getSearchHasBeenPerformed === true">
      <div v-if="this.searchMedia === 'songs'" class="headers">
        <h3>Title</h3>
        <h3>Artist</h3>
        <h3>Album</h3>
        <h3>Duration</h3>
      </div>
      <div
        v-if="this.searchMedia === 'albums'"
        id="albumHeaders"
        class="headers"
      >
        <h3>Title</h3>
        <h3>Artist</h3>
        <h3>Year</h3>
      </div>
      <div
        v-if="this.searchMedia === 'artists'"
        id="artistHeaders"
        class="headers"
      >
        <h3>Artist</h3>
      </div>
      <div
        v-if="this.searchMedia === 'playlists'"
        id="playlistHeaders"
        class="headers"
      >
        <h3>Title</h3>
      </div>
      <div id="searchResults">
        <div
          class="mediaContainer"
          v-for="(media, index) in getSearchContent"
          :key="index"
        >
          <button
            @contextmenu.prevent.stop="showOptionsOnClick($event, media)"
            class="listButton"
            v-if="media.type === 'song'"
            @dblclick="performActionWhenMediaIsClicked(media)"
          >
            <p>{{ media.name }}</p>
            <p>{{ media.artist.name }}</p>
            <p>{{ media.album.name }}</p>
            <p>{{ convertMillisecondsToTimeString(media.duration) }}</p>
          </button>
          <button
            class="listButton"
            id="albumButton"
            v-if="media.type === 'album'"
            @dblclick="performActionWhenMediaIsClicked(media)"
          >
            <p>{{ media.name }}</p>
            <p>{{ media.artist }}</p>
            <p>{{ media.year }}</p>
          </button>
          <button
            class="listButton"
            id="artistButton"
            v-if="media.type === 'artist'"
            @dblclick="performActionWhenMediaIsClicked(media)"
          >
            <p>{{ media.name }}</p>
          </button>
          <button
            class="listButton"
            id="playlistButton"
            v-if="searchMedia === 'playlists'"
            @dblclick="performActionWhenMediaIsClicked(media)"
          >
            <p>{{ media.PlaylistName }}</p>
          </button>
        </div>
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
let song = {};
import OptionsMenu from "../components/OptionsMenu";

export default {
  name: "Search",

  components: {
    OptionsMenu,
  },
  methods: {
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
    getMedia() {
      if(this.searchMedia === "") {
        this.searchMedia = "songs"
      }
      if (this.searchString !== "") {
        this.$store.dispatch("getSearchResults", {
          searchMedia: this.searchMedia,
          searchString: this.searchString,
        });
      } else {
        this.$store.commit("setSearchHasBeenPerformed", false);
        this.$store.commit("setSearchResults", []);
      }
    },
    setSearchMediaType(searchMedia) {
      this.searchMedia = searchMedia;
    },
    setSearchHasBeenPerformedToTrue() {
      if (this.searchString !== "") {
        this.$store.commit("setSearchHasBeenPerformed", true);
      }
    },
    showOptionsOnClick(event, media) {
      song = media;
      this.$refs.OptionsMenu.showMenu(event);
    },
    setOption(event) {
      if (event.option.slug == "queue") {
        this.queuedTracks.push(song);
      }
      if (event.option.slug == "add") {
        //Add to playlist
      }
    },
    performActionWhenMediaIsClicked(media) {
      switch (media.type) {
        case "song":
          this.$store.dispatch("setSongToPlay", media);
          break;
        default:
          //for artist, album and playlist
          media.type === undefined
            ? this.$store.commit("setComponentToRenderInHomeCenter", "playlist")
            : this.$store.commit(
                "setComponentToRenderInHomeCenter",
                media.type
              );
          break;
      }
    },
  },
  computed: {
    getSearchContent() {
      return this.$store.getters.getSearchContent;
    },
    getSearchHasBeenPerformed() {
      return this.$store.getters.getSearchHasBeenPerformed;
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
  data() {
    return {
      searchString: "",
      searchMedia: "songs",
    };
  },
};
</script>

<style lang="scss">
#searchComponent {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-image: url("../assets/Ljudio_logo_Large.png");
  background-position: center;
  background-repeat: no-repeat;
  background-position: 50% 75%;

  .headers {
    width: 95%;
    display: grid;
    grid-template-columns: 57.5fr 23fr 23fr 13fr;
    // color: rgb(196, 196, 196);
    margin: 20px auto 0 auto;
    border-bottom: 2px white solid;

    & > h3:first-child {
      margin-left: 20px;
    }
  }

  #albumHeaders {
    grid-template-columns: 76fr 38fr 28fr;
  }

  #artistHeaders {
    grid-template-columns: 1fr;
  }

  #playlistHeaders {
    grid-template-columns: 1fr;
  }

  .mediaContainer {
    color: white;
    border-bottom: 1px gray solid;
    width: 100%;
    margin: auto;
    height: 50px;
  }

  .listButton {
    width: 100%;
    display: grid;
    grid-template-columns: 5fr 2fr 2fr 1fr;
    height: 100%;
    text-align: left;
    justify-content: space-between;
    // background-color: rgb(27, 27, 27);
    border: none;

    & > p {
      font-size: 14px;
      //color: rgb(196, 196, 196);
      margin: auto 0 auto 0;
      &:hover {
        color: royalblue;
      }
      &:first-child {
        margin-left: 20px;
      }
    }
  }

  #albumButton {
    grid-template-columns: 6fr 3fr 2fr;
  }

  #artistButton {
    grid-template-columns: 1fr;
  }

  #playlistButton {
    grid-template-columns: 1fr;
  }

  #searchbox {
    width: 80%;
    min-height: 50px;
    margin: 30px auto 10px auto;
    border-radius: 50px;
    padding-left: 20px;
    font-size: 20px;
    //color: rgb(51, 51, 51);

    &:focus {
      outline: none;
    }
  }

  .md-tabs-navigation {
    display: flex;
    justify-content: center;
  }

  #tab-container {
    margin-top: 20px;
    //background-color: rgb(27, 27, 27);
    z-index: 0;
  }

  button {
    //color: rgb(196, 196, 196);
    font-size: 20px;
  }

  #searchResultsContainer {
    display: flex;
    flex-direction: column;

    overflow-x: hidden;
  }

  #searchResults {
    width: 95%;
    overflow-y: scroll;
    margin: 0 auto;
  }
}
</style>
