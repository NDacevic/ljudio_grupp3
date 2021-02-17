<template>
  <div class="addPlaylist" >
    <div>
    <h2>Choose playlist from menu or create a new</h2>
      <form>
        <input type="text" value="Enter name">
        <input type="submit" value="Create playlist" >
      </form>
     <select  v-model="selected">
       <option disabled value="">Please select one</option>
       <option  v-for="(playlist, index) in getPlaylists"
      :key="index">{{playlist.PlaylistName}}</option>
       </select>
       <button>Add</button>

    </div>
  </div>
</template>

<script>
export default {
  name: "AddPlaylist",

  methods: {

  },
  computed: {
      getPlaylists() {
        return this.$store.getters.getPlaylists;
    },
  },
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

