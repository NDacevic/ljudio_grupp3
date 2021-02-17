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
      :key="index">{{playlist}}</option>
       </select>
 
       
    </div>
  </div>
</template>

<script>
export default {
  name: "AddPlaylist",
data() {
  return {
    newPlaylist:[],
    selectedPlaylist:[],
    pickedTrack:{},
  }
},
  methods: {
    addToPlaylist(playlistId){   
      alert(playlistId)
      this.$store.dispatch("getCurrentPlaylist", playlistId );
      this.selectedPlaylist.push(this.pickedTrack)
      this.addTrackToPlaylist.push(this.pickedTrack)
      console.log(this.$store.getters.getCurrentPlaylist)
    },
    getTrack(track){
    
      this.pickedTrack=track;

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
    addTrackToPlaylist:{
      get() {
        return this.$store.getters.getCurrentPlaylist;
      },
      set(selectedPlaylist) {
        this.$store.commit("setCurrentPlaylist",selectedPlaylist);
      },
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

