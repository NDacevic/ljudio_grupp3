<template>
<div class="playlistBar">
    <h3>Playlists</h3>
    <li v-for="(playlist, index) in getPlaylists" :key="index" @click="goToPlaylist(index)">
        <div class="listItem">            
            <p>{{playlist.title}}</p>    
            <button v-if="playlist.ownerId===login.userId" @click="removePlaylist">Delete</button>
            <button v-else @click="unfollowPlaylist">Unfollow</button>            
        </div>
    </li>
</div>


</template>
    
<script>
export default {
    name: "Playlists",
    components: {

    },
    data() {
        return {
            playlistList: [
            {
             id: 1,
             title: "Pop",
             ownerId: "1"
            },
            {
             id: 2,
             title: "Lounge",
             ownerId: "1"
            }
        ],
        login: [
            {
             userId: "2" 
            }

        ]
    }
  },
    computed: {
    getPlaylists() {
      let playlists = this.$store.getters.getPlaylists;
      return playlists;
    }
  },
    methods: {
        goToPlaylist(/*index*/) {
            //rendera playlistcomponent
        },
        unfollowPlaylist() {
            //fetch ta bort playlist från UserPlaylist i db
        },
        removePlaylist() {
            //fetch ta bort playlist helt eller bara i UserPlaylist i db?
        }
    }
}
</script>

<style lang="scss">
.playlistBar {
    padding: 0;
    margin: 0;
    box-sizing: border-box;

    .listItem {
        color:black;
        width: 100%;
        display: flex;
        justify-content: space-between;
        list-style-type: none;
    
    &:hover {
        background-color: rgb(233, 232, 232);
        color:#448aff
        }
    }

    li::marker {
        content: "";
    }

    & > h3 {
        margin-bottom: 2vh;
        margin-top: 2vh;
    }

    & button {
        background-color: rgb(233, 232, 232);;
        color: black;
        border: 0;
        margin: 0;
        padding-inline: 2%;
        border-radius: 0;
        font-size: x-small;

        &:hover {
            background-color: rgb(150, 150, 150);
        }
    }

    & p {
        padding: 5%;
    }
}

</style>