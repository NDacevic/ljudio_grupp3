<template>
  <div class="playlistContent">
    <div class="head">
      <h1 v-if="playlist[0] !== undefined">{{ playlist[0].PlaylistName }}</h1>
      <h1 v-else>Playlist error</h1>
      <button v-on:click="addToQueue(playlist)">Add to queue</button>
    </div>

    <div class="listContainer">
      <div class="headers">
        <h3>Title</h3>
        <h3>Artist</h3>
        <h3>Album</h3>
        <h3>Duration</h3>
      </div>

      <li
        v-for="(track, index) in playlist"
        :key="index"
        @dblclick="playSong(track)"
         @contextmenu.prevent.stop="showOptionsOnClick($event, track)"
      >
        <div class="listItem">
          <p>{{ track.Title }}</p>
          <p>{{ track.Artist }}</p>
          <p>{{ track.AlbumName }}</p>
          <p>{{ track.Duration }}</p>
        </div>
      </li>
    </div>
    <OptionsMenu
      :elementId="'optionMenuId'"
      :options="menuOptions"
      :ref="'optionMenu'"
      @option-clicked="setOption"
    />
  </div>
</template>

<script>
import OptionsMenu from "./OptionsMenu";

export default {
  name: "PlaylistContent",
  components: {
    OptionsMenu
  },
  computed: {
    queue: {
      get() {
        return this.$store.getters.getQueuedTracks;
      },
      set(newQueue) {
        this.$store.commit("updateQueue", newQueue);
      },
    },
    playlist() {
      return this.$store.getters.getCurrentPlaylist;
    },
  },
  data () {
    return {
        menuOptions:[
       {
          name: 'Add to queue',
          slug: 'queue'
        },
        {
          name: 'Share',
          slug: 'share'
        },
      ],
      selectedTrack: Object
    }
  },
  methods: {
    playSong(track) {
      console.log(track.contentType)
      console.log(track.videoId)
      this.$store.dispatch("getMediaObjectAndAddToQueueOrPlay", {addToQueue:false, sharedContentType: track.contentType, sharedContentId: track.videoId});
    },
    addToQueue(playlist) {
      this.$store.commit("addPlaylistToQueue", playlist)
    },
    showOptionsOnClick(event, track) {
      this.selectedTrack = track;      
      this.$refs.optionMenu.showMenu(event);
    },
    setOption(event) {
      if (event.option.slug == "queue") {
        this.$store.dispatch("getMediaObjectAndAddToQueueOrPlay", {addToQueue:true, sharedContentType: this.selectedTrack.contentType, sharedContentId: this.selectedTrack.videoId});
      }
      if (event.option.slug == "share") {
        //@TODO: Share selectedAlbum
      }
    },
  },
};
</script>

<style lang="scss">
.playlistContent {
  color: white;
  width: 100%;
  height: 100%;
  grid-template-columns: 57.5fr 23fr 23fr 13fr;

  & .head {
    margin-top: 5vh;
    margin-bottom: 10vh;
    margin-left: 1vw;

    & button {
      margin-top: 2vh;
      border-radius: 50%;
      font-weight: semi-bold;
      border-radius: 20px;
      padding: 5px;
      border: 1px white solid;
      background-color: black;
      padding: 6px;
    }
  }
  //   .col-1 {
  //   grid-column-start: 1;
  //   grid-column-end: 2;
  // }

  // .col-2 {
  //   grid-column-start: 2;
  //   grid-column-end: 3;
  // }

  // .col-3 {
  //   grid-column-start: 3;
  //   grid-column-end: 4;
  // }

  // .col-4 {
  //   grid-column-start: 4;
  //   grid-column-end: 5;
  // }

  .listContainer {
    .headers {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #44507f;
      margin-bottom: 2vh;
      margin-left: 1vw;
      margin-right: 1vw;
      padding: 1%;
      //grid-template-columns: 57.5fr 23fr 23fr 13fr;
    }
    div > h3:first-child {
      //flex-grow: 0.5;
      width: 33%;
    }

    li::marker {
      content: "";
    }

    .listItem {
      display: flex;
      justify-content: space-between;
      margin-left: 1vw;
      margin-right: 1vw;
      padding: 1%;
      //grid-template-columns: 57.5fr 23fr 23fr 13fr;
    }
    div > p:first-child {
      //flex-grow: 0.5;
      width: 33%;
    }
  }
}
</style>
