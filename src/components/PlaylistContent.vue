<template>
  <div class="playlistContent">
       <h1 v-if="playlist[0] !== undefined">{{ playlist[0].PlaylistName }}</h1>
       <h1 v-else>Playlist error</h1>
       <div class="listContainer">
         <div class="headers">
          <h3>Title</h3>
          <h3>Artist</h3>
          <h3>Album</h3>
          <h3>Duration</h3>
         </div>

             <li
      v-for="(media, index) in playlist"
      :key="index"
      @dblclick="playSong(media)"
    >
      <div class="listItem">
            <p>{{ media.Title }}</p>
            <p>{{ media.Artist }}</p>
            <p>{{ media. AlbumName }}</p>
            <p>{{ media.Duration }}</p>
      </div>
    </li>
       </div>

  </div>
</template>

<script>
export default {
  name: "PlaylistContent",
  computed: {
    currentPlaylistId: {
      get() {
        return this.$store.getters.getCurrentPlaylistId;
      }
    },
    playlist() {
      return this.$store.getters.getCurrentPlaylist;
      // get() {
      //   return this.$store.getters.getCurrentPlaylist;
      // },
      // set (updatedPlaylist) {
      //   this.$store.commit("setCurrentPlaylist", updatedPlaylist);
      // }
    }
  },
  methods: {
    playSong(media){
      this.$store.dispatch("setSongToPlay", media);
    }
  },
    created() {
      this.$store.dispatch("getCurrentPlaylist", this.currentPlaylistId);
      console.log(this.currentPlaylistId);
  }

};
</script>

<style lang="scss">
.playlistContent {
  color: white;
  width: 100%;
  height:100%;
  grid-template-columns: 57.5fr 23fr 23fr 13fr;


  & h1 {
    margin-top: 5vh;
    margin-bottom: 10vh;
    margin-left: 1vw;
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
       border-bottom: 2px solid #44507F;
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
