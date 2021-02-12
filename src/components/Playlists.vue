<template>
  <div class="playlistBar">
    <h3>Playlists</h3>
    <li
      v-for="(playlist, index) in getPlaylists"
      :key="index"
      @click="goToPlaylist(index)"
    >
      <div class="listItem">
        <p>{{ playlist.PlaylistName}}</p>
        <p>{{ playlist.PlaylistId}}</p>
        <button
          v-if="playlist.OwnerId === login.userId"
          @click="removePlaylist(playlist.PlaylistId)"
        >
          Delete
        </button>
        <button v-else @click="unfollowPlaylist(playlist.PlaylistId)">Unfollow</button>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  name: "Playlists",
  components: {},
  data() {
    return {
      playlistList: [
        {
          id: 1,
          title: "Pop",
          ownerId: "1",
        },
        {
          id: 2,
          title: "Lounge",
          ownerId: "1",
        },
      ],
      login: [
        {
          userId: 5,
        },
      ],
    };
  },
  computed: {
    getPlaylists() {
        return this.$store.getters.getPlaylists;
    }
  },
  methods: {
    goToPlaylist() {
      //rendera playlistcomponent
    },
    unfollowPlaylist(id) {
      //fetch ta bort playlist från UserPlaylist i db
      this.$store.dispatch("unfollowPlaylist", id) //commit?
    },
    removePlaylist(id) {
      //fetch ta bort playlist i playlist och userplaylist
      this.$store.dispatch("removePlaylist", id) //commit?
    },
  },
  mounted(){
      this.$store.dispatch("getPlaylists")
  }
};
</script>

<style lang="scss">
.playlistBar {
  padding: 0;
  margin: 0;
  box-sizing: border-box;

  .listItem {
    color: black;
    width: 100%;
    display: flex;
    justify-content: space-between;
    list-style-type: none;

    &:hover {
      background-color: rgb(233, 232, 232);
      color: #448aff;
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
    background-color: rgb(233, 232, 232);
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
