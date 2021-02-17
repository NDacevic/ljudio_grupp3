<template>
  <div class="addPlaylist" >
    <div>
    <h2>Choose playlist from menu or create a new</h2>
      <form>
        <input type="text" value="Enter name">
        <input type="submit" value="Create playlist" >
      </form>
     <select v-model="selected">
       <option disabled value="">Please select one</option>
       <option>Playlist 1</option>
       <option>Playlist 2</option>
       <option>Playlist 3</option>
       </select>
       <button>Add</button>

    </div>
  </div>
</template>

<script>
export default {
  name: "LeftMenu"
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

