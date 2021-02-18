<template>
  <div class="addPlaylist" >
    <div>
    <h2>Choose playlist from menu or create a new</h2>
      <form>
        <input v-model="newPlaylist.PlaylistName" type="text">
        <input type="submit" value="Create playlist" @click="addNewPlaylist()" >
      </form>
        
        <select>
       <option disabled value="">Please select one</option>
       <option v-on:click="addToPlaylist(playlist.PlaylistId)"  v-for="(playlist, index) in getPlaylists"
      :key="index">{{playlist.PlaylistName}}</option>
       </select>     
    </div>
  </div>
</template>

<script>
export default {
  name: "AddPlaylist",
  props:{
  pickedTrack:{},
  },
data() {
  return {
    newPlaylist:[],
    selectedPlaylist:[],  
  }
},
  methods: {
    addToPlaylist(playlistId){   
      this.$store.commit("setCurrentPlaylistId", playlistId );    
      this.$store.dispatch("addPlaylistMusic");     
    },
    addNewPlaylist() {
      this.addPlaylist.push(this.newPlaylist);
      this.$store.commit("setCurrentPlaylist",this.newPlaylist);
      this.$store.dispatch("addNewPlaylist") 
    }
  },
  computed: {
     getPlaylists() {
        return this.$store.getters.getPlaylists;
    },
    addPlaylist: {
      get() {
        return this.$store.getters.getPlaylists;
      },
      set(newPlaylist) {
        this.$store.commit("setPlaylistList",newPlaylist);
      },    
    }    
  }
}
</script>
<style scoped>
*{
   background-color:white;
   color:black;

}
.addPlaylist{
 height:50%;
 width:800px;
}
h2{
}
</style>

