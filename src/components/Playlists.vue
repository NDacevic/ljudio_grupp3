<template>
  <div class="playlistBar">
    <h3>My playlists</h3>
    <li v-for="(playlist, index) in getPlaylists" :key="index">
      <div class="listItem">
        <p v-on:click="goToPlaylist(playlist.PlaylistId)">
          {{ playlist.PlaylistName }}
        </p>
        <button
          v-if="playlist.OwnerId === user.UserId || user !== undefined"
          v-on:click="deletePlaylist(playlist.PlaylistId)"
        >
          Delete
        </button>
        <button v-else v-on:click="unfollowPlaylist(playlist.PlaylistId)">
          Unfollow
        </button>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  name: "Playlists",
  computed: {
    getPlaylists() {
      return this.$store.getters.getPlaylists;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    goToPlaylist(playlistId) {
      this.$store.dispatch("getCurrentPlaylist", playlistId);
      this.$store.commit("setComponentToRenderInHomeCenter", "playlist");
    },
    unfollowPlaylist(id) {
      this.$store.dispatch("unfollowPlaylist", id);
    },
    deletePlaylist(id) {
      this.$store.dispatch("deletePlaylist", id);
    },
  },
  mounted() {
    this.$store.dispatch("getPlaylists");
  },
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
      background-color: #44507f !important;
      & > p {
        color: #448aff;
      }
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
    background-color: rgb(199, 23, 23) !important;
    color: white;
    border: 0;
    margin: 0;
    padding-inline: 2%;
    border-radius: 0;
    font-size: small;

    &:hover {
      background-color: #44507f !important;
      color: #448aff;
    }
  }

  & p {
    padding: 5%;
  }
}
</style>
