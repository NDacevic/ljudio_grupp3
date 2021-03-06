<template>
  <div id="searchComponent">
    <input id="searchbox" type="text" placeholder="Search for Song, Album, Artist or Playlist..." v-model="searchString" @keyup.enter="getMedia(), setSearchHasBeenPerformedToTrue()" />

    <md-tabs id="tab-container" class="md-transparent" v-if="getSearchHasBeenPerformed === true">
      <md-tab id="tab-songs" md-label="Songs" @click="setSearchMediaType('songs'), getMedia()"></md-tab>
      <md-tab id="tab-albums" md-label="Albums" @click="setSearchMediaType('albums'), getMedia()"></md-tab>
      <md-tab id="tab-artists" md-label="Artists" @click="setSearchMediaType('artists'), getMedia()"></md-tab>
      <md-tab id="tab-playlists" md-label="Playlists" @click="setSearchMediaType('playlists'), getMedia()"></md-tab>
      <md-tab id="tab-video" md-label="Videos" @click="setSearchMediaType('videos'), getMedia()"></md-tab>
    </md-tabs>
    <div id="searchResultsContainer" v-if="getSearchHasBeenPerformed === true">
      <div v-if="this.searchMedia === 'songs'" class="headers">
        <h3>Title</h3>
        <h3>Artist</h3>
        <h3>Album</h3>
        <h3>Duration</h3>
      </div>
      <div v-if="this.searchMedia === 'albums'" id="albumHeaders" class="headers">
        <h3>Title</h3>
        <h3>Artist</h3>
        <h3>Year</h3>
      </div>
      <div v-if="this.searchMedia === 'artists'" id="artistHeaders" class="headers">
        <h3>Artist</h3>
      </div>
      <div v-if="this.searchMedia === 'playlists'" id="playlistHeaders" class="headers">
        <h3>Title</h3>
      </div>
      <div v-if="this.searchMedia === 'videos'" id="videoHeaders" class="headers">
        <h3>Title</h3>
        <h3>Artist</h3>
        <h3>Duration</h3>
      </div>
      <div id="searchResults" class="md-scrollbar">
        <div class="mediaContainer" v-for="(media, index) in getSearchContent" :key="index">
          <button @contextmenu.prevent.stop="showOptionsOnClick($event, media)" class="listButton" v-if="media.type === 'song'" @dblclick="performActionWhenMediaIsClicked(media)">
            <p>{{ truncatedTrackTitleArtistName(media.name) }}</p>
            <p>{{ media.artist.name }}</p>
            <p>{{ media.album.name }}</p>
            <p>{{ convertMillisecondsToTimeString(media.duration) }}</p>
          </button>
          <button @contextmenu.prevent.stop="showOptionsOnClick($event, media)" class="listButton" id="albumButton" v-if="media.type === 'album'" @dblclick="performActionWhenMediaIsClicked(media)">
            <p>{{ truncatedTrackTitleArtistName(media.name) }}</p>
            <p>{{ media.artist }}</p>
            <p>{{ media.year }}</p>
          </button>
          <button
            @contextmenu.prevent.stop="showArtistOptionOnClick($event, media)"
            class="listButton"
            id="artistButton"
            v-if="media.type === 'artist'"
            @dblclick="performActionWhenMediaIsClicked(media)"
          >
            <p>{{ media.name }}</p>
          </button>
          <button
            @contextmenu.prevent.stop="showPlaylistOptionOnClick($event, media)"
            class="listButton"
            id="playlistButton"
            v-if="searchMedia === 'playlists'"
            @dblclick="performActionWhenMediaIsClicked(media)"
          >
            <p>{{ media.PlaylistName }}</p>
          </button>
          <button @contextmenu.prevent.stop="showOptionsOnClick($event, media)" class="listButton" id="videoButton" v-if="searchMedia === 'videos'" @dblclick="performActionWhenMediaIsClicked(media)">
            <p>{{ media.name }}</p>
            <p>{{ media.author }}</p>
            <p>{{ convertMillisecondsToTimeString(media.duration) }}</p>
          </button>
        </div>
      </div>
    </div>
    <AddPlaylist v-if="this.$store.getters.getcreatePlaylistBool === true"/>
    <OptionsMenu :elementId="'optionMenuId'" :options="menuOptions" :ref="'optionMenu'" @option-clicked="setOption" />
    <OptionsMenu :elementId="'playlistMenuId'" :options="playlistOptions" :ref="'playlistMenu'" @option-clicked="setOption" />
    <OptionsMenu :elementId="'artistMenuId'" :options="artistOptions" :ref="'artistMenu'" @option-clicked="setOption" />
  </div>
</template>

<script>
import OptionsMenu from "../components/OptionsMenu";
import AddPlaylist from "../components/AddPlaylist";

export default {
  name: "Search",

  components: {
    OptionsMenu,
    AddPlaylist

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
      if (this.searchMedia === "") {
        this.searchMedia = "songs";
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
      if(media.artist.length<1)
      {
        media.artist={name:" "}
      }
      this.media = media;
      this.$refs.optionMenu.showMenu(event);
    },
    showPlaylistOptionOnClick(event, media) {
      this.media = media;
      this.$refs.playlistMenu.showMenu(event);
    },
    showArtistOptionOnClick(event, media) {
      this.media = media;
      this.$refs.artistMenu.showMenu(event);
    },
    setOption(event) {
      if (event.option.slug == "queue") {
        this.queuedTracks.push(this.media);
      }
      else if (event.option.slug == "add") {
        this.$store.commit("setcreatePlaylistHasBeenClicked", true);
        this.$store.commit("setplaylistTrack",this.media);
      }
      else if (event.option.slug == "share") {
        this.$store.commit("showShareComponent", true);
        this.$store.commit("setShareMedia", this.media);
      }
    },
    performActionWhenMediaIsClicked(media) {
      switch (media.type) {
        case "song":
          this.$store.dispatch("setTrackToPlay", { media, caller: "search" });
          break;
        case "video":
          this.$store.dispatch("setTrackToPlay", { media, caller: "search" });
          break;
        default:
          //for artist, album and playlist
          if(this.searchMedia === 'playlists'){         
            this.$store.dispatch("getCurrentPlaylist", media.PlaylistId);
          }
          media.type === undefined ? this.$store.commit("setComponentToRenderInHomeCenter", "playlist") : this.$store.commit("setComponentToRenderInHomeCenter", media.type);
          break;
        case "artist":
          this.$store.commit("setSelectedArtistBrowseId", media.browseId);
          this.$store.commit("setComponentToRenderInHomeCenter", media.type);
          break;
        case "album":
          this.$store.commit("setSelectedAlbumBrowseId", media.browseId);
          this.$store.commit("setComponentToRenderInHomeCenter", media.type);
        break;
      }
    },
    truncatedTrackTitleArtistName(mediaName) {
      let length = 70;
      if (mediaName == null || mediaName.Length < length || mediaName.indexOf(" ", length) == -1) return mediaName;
      return mediaName.substring(0, mediaName.indexOf(" ", length)) + "...";
    },
  },
  computed: {
    getSearchContent() {
      return this.$store.getters.getSearchContent;
    },
    getSearchHasBeenPerformed() {
      return this.$store.getters.getSearchHasBeenPerformed;
    },
    getcreatePlaylistBool() {
      return this.$store.getters.getcreatePlaylistBool;
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
      media: {},
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
    };
  },
};
</script>
