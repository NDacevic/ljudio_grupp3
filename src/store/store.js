import Vue from "vue";
import Vuex from "vuex";
import router from "../router/index";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    router,
    user: {},
    searchResults: [],
    playlists: [],
    currentTrack: {},
    trackHistory: [],
    componentToRenderInHomeCenter: "search",
    queuedTracks: [],
    searchHasBeenPerformed: false, //Used to render search headers (or not)
    selectedAlbum: {},
    newNotifications: [],
    createPlaylistBool:false,
    currentPlaylistId: "",
    selectedArtistBrowseId: "",
    selectedArtist: {},
    selectedAlbumBrowseId: "",
    currentPlaylist: []

  },
  mutations: {
    setSearchResults(state, searchResults) {
      state.searchResults = searchResults;
    },
    setPlaylistList(state, playlists) {
      state.playlists = playlists;
    },
    playTrack(state, track) {
      state.currentTrack = track;
    },
    removeLatestHistory(state) {
      let track = state.trackHistory.splice(
        state.trackHistory.length - 1,
        1
      )[0];
      return track;
    },
    updateQueue(state, newQueue) {
      state.queuedTracks = newQueue;
    },
    modifyPlaylist(state, playlistId) {
      state.playlists.splice(
        state.playlists.indexOf(
          state.playlists.find((x) => x.PlaylistId === playlistId)
        ),
        1
      );
    },
    removeTopFromQueue(state) {
      state.queuedTracks.shift();
    },
    removeFromBottomOfHistory(state){
      state.trackHistory.pop();
    },
    addTrackToHistory(state, trackToAdd) {
      state.trackHistory.push(trackToAdd);
    },
    addTrackToTopOfQueue(state, trackToAdd) {
      state.queuedTracks.unshift(trackToAdd);
    },
    setComponentToRenderInHomeCenter(state, componentToRender) {
      state.componentToRenderInHomeCenter = componentToRender;
    },
    updateUser(state, newUser) {
      state.user = newUser;
    },
    setSearchHasBeenPerformed(state, searchHasBeenPerformed) {
      state.searchHasBeenPerformed = searchHasBeenPerformed;
    },
    setCurrentPlaylistId(state, playlistId) {
      state.currentPlaylistId = playlistId;
    },
    setCurrentPlaylist(state, currentPlaylist) {
      state.currentPlaylist = currentPlaylist;
    },
    setSelectedArtistBrowseId(state, browseId) {
      state.selectedArtistBrowseId = browseId;
    },
    setSelectedArtist(state, artist) {
      state.selectedArtist = artist;
    },
    setSelectedAlbumBrowseId(state, browseId) {
      state.selectedAlbumBrowseId = browseId;
    },
    setSelectedAlbum(state, album) {
      state.selectedAlbum = album;
    },
    setNewNotifications(state, newNotifications) {
      state.newNotifications = newNotifications;
    },
    setcreatePlaylistHasBeenClicked(state, createPlaylistBool) {
      state.createPlaylistBool = createPlaylistBool;
    }
  },
  actions: {
    async setTrackToPlay({ commit }, payload) {
      if (this.state.currentTrack.videoId != null) {
        if (payload.caller === "playNext")
          commit("addTrackToHistory", this.state.currentTrack);
      }
      window.player.loadVideoById(payload.media.videoId);
      window.player.playVideo();
      commit("playTrack", payload.media);
    },
    async getSearchResults({ commit }, searchParameters) {
      let response;
      if (searchParameters.searchMedia === "playlists") {
        //Todo: Create endpoint when there are playlists available
        response = await fetch(
          `/api/playlist/${searchParameters.searchString}`
        );
      } else {
        response = await fetch(
          `/api/yt/${searchParameters.searchMedia}/search+${searchParameters.searchString}`
        );
      }

      let searchResults = await response.json();

      //Changing album type from 'ep' 'single' etc to 'album', to be able to render all content correctly
      if (searchParameters.searchMedia === "albums") {
        for (let i = 0; i < searchResults.content.length; i++) {
          if (searchResults.content[i].type !== "album") {
            searchResults.content[i].type = "album";
          }
        }
      }
      if (searchParameters.searchMedia === "playlists") {
        commit("setSearchResults", searchResults);
      } else {
        commit("setSearchResults", searchResults.content);
      }
    },
    async addNewPlaylist(){ 
      let playlist={};
      playlist.PlaylistName = this.state.currentPlaylist.PlaylistName
      alert(playlist.PlaylistName)
      const response = await fetch("/api/newPlaylist/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playlist),
      });
      if (response.status == "200") {
        alert("playlist has been created");
      } else {
        alert("Something went wrong, try again");
      }
    },
    async getPlaylists({ commit }) {
      try {
        let response = await fetch(`/api/getplaylist/`);
        const playlists = await response.json();
        commit("setPlaylistList", playlists);
      } catch {
        let playlists = [];
        commit("setPlaylistList", playlists);
      }
    },
    async unfollowPlaylist(playlistId) {
      let response = await fetch(`/api/unfollowpPlaylist/${playlistId}`, {
        method: "delete",
      });
    await response.json(); 
    },
    
    async deletePlaylist({ commit }, playlistId) {
      console.log("test", playlistId);
      let response = await fetch(`/api/deletePlaylist/${playlistId}`, {
        method: "delete",
      });
      await response.json();
      commit("modifyPlaylist", playlistId);
    },
    async getCurrentPlaylist({ commit }, playlistId) {
      alert(playlistId)
      let response = await fetch(`/api/getMusicPlaylist/${playlistId}`);
      let playlist = await response.json();
      console.log(playlist)
      commit("setCurrentPlaylist", playlist);
    },
    async createUser() {
      
      const response = await fetch("/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.user),
      });
      if (response.status == "200") {
        alert("User has been created");
        router.go();
      } else {
        alert("Something went wrong, try again");
      }
    },
    async validateUsername() {
      const response = await fetch("/api/checkUser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.user),
      });
      if (response.status == "200") {
        await this.dispatch("createUser");
      } else {
        alert("Username already exists,choose another");
      }
    },
    async logOut() {
      const response = await fetch("/api/login/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.user),
      });
      if (response.status == "200") {
        router.push("/");
      }      
    },
    async loginUser() {
      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.user),
      });
      if (response.status == "200") {
        alert("logged in");
        this.dispatch("checkAuth");
      }
      else {alert("Wrong username and/or password")}
    },
    async checkAuth() {
      let response = await fetch(`/api/login/`);
      let data = await response.json();
      this.state.user = data;
      router.push("/Home");
    },
    async fetchArtistByBrowseId({ commit }, browseId) {
      const response = await fetch(`api/yt/artist/${browseId}`);
      const artist = await response.json();
      commit("setSelectedArtist", {
        name: artist.name,
        artist: artist,
        albums: artist.products.albums.content,
      });
    },
    async fetchAlbumByBrowseId({ commit }, browseId) {
      return fetch(`api/yt/album/${browseId}`)
        .then(async (res) => {
          const album = await res.json();
          commit("setSelectedAlbum", album);
        })
    },
    async getNewNotifications({ commit }) {
      const response = await fetch(
        `/api/notification/${this.state.user.userId}`
      );
      const newNotifications = await response.json();
      commit("setNewNotifications", newNotifications);
    },
  },
  getters: {
    getSearchContent(state) {
      return state.searchResults;
    },
    getPlaylists(state) {
      return state.playlists;
    },
    getCurrentTrack(state) {
      return state.currentTrack;
    },
    getCenterComponentForHome(state) {
      return state.componentToRenderInHomeCenter;
    },
    getQueuedTracks(state) {
      return state.queuedTracks;
    },
    getTrackHistoryLength(state) {
      return state.trackHistory.length;
    },
    getUser(state) {
      return state.user;
    },
    getQueuedTracksLength(state) {
      return state.queuedTracks.length;
    },
    getSearchHasBeenPerformed(state) {
      return state.searchHasBeenPerformed;
    },
    getCurrentPlaylistId(state) {
      return state.currentPlaylistId;
    },
    getCurrentPlaylist(state) {
      return state.currentPlaylist;
    },
    getSelectedArtistBrowseId(state) {
      return state.selectedArtistBrowseId;
    },
    getSelectedArtist(state) {
      return state.selectedArtist;
    },
    getSelectedAlbumBrowseId(state) {
      return state.selectedAlbumBrowseId;
    },
    getSelectedAlbum(state) {
      return state.selectedAlbum;
    },
    getNewNotifications(state) {
      return state.newNotifications;
    },
    getcreatePlaylistBool(state){
      return state.createPlaylistBool;
    }
  },
  modules: {},
});
