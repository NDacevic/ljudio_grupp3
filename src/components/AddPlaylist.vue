<template>
  <div class="addPlaylist" >
    <div>
    <h2 class="h2">Choose playlist from menu <br>or create a new</h2>
      <div class="createNew">
        <input class="namePlaylist" v-model="newPlaylist.PlaylistName" type="text">
        <input class="inputBtn" type="submit" value="Create" @click="addNewPlaylist()" >
      </div>
            <p class="dropdownPtag">Pick a playlist</p>

        <div class="sectionTwo">
      <select class="dropdown" @change="addToPlayList($event)">
        <option 
          v-for="(playlist, index) in getPlaylists"
          :key="index"
          :value="playlist.PlaylistId"
        >
          {{playlist.PlaylistName}}
        </option>
       </select> 
       <button @click="closePopUp" class="inputBtn">Cancel</button>
        </div>


    </div>
  </div>
</template>

<style>
.sectionTwo{
  display:flex;
  justify-content:space-between;
}
.dropdownPtag{
margin-top:20px;
font-size:15px;
}
.inputBtn{
  font-size:20px;
  padding:0 5px;
}
.dropdown {
  
  font-size:20px;
}
.namePlaylist{
  width:100%;
  flex:auto;
  font-size:20px;
  padding:0 5px;
  margin-right:10px;
}
.createNew{
  display:flex;
  width:100%;
  justify-content:space-between;
}
.addPlaylist{
 position:absolute;
 height: 300px;
 width:400px;
 top:46%;
 left:40%;
 border: 3px solid #6b749d;
 padding:20px;
}
.h2{
  text-align:center;
  font-size:25px;
  margin:20px 0;
  line-height:1;
}
</style>


<script>
export default {
  name: "AddPlaylist",
  props:{
  pickedTrack:{},
  },
data() {
  return {
    newPlaylist:{},
    selectedPlaylist:[],  
  }
},
  methods: {
    closePopUp(){
      this.$store.commit("setcreatePlaylistHasBeenClicked", false);
    },
    addToPlayList(event){
      this.$store.commit("setCurrentPlaylistId", event.target.value);    
      this.$store.dispatch("addPlaylistMusic");     
    },
    addNewPlaylist() {
      console.log("addnewplaylist",this.newPlaylist)
      this.newPlaylist.OwnerId = this.$store.getters.getUser.UserId;
      this.$store.dispatch("addNewPlaylist",this.newPlaylist) 
      this.addPlaylist.push(this.newPlaylist);
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

