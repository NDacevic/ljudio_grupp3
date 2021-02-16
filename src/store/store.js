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
    currentSong: {},
    trackHistory: [],
    componentToRenderInHomeCenter: "search",
    queuedTracks: [],
    searchHasBeenPerformed: false, //Used to render search headers (or not)
    selectedArtistBrowseId: "",
    selectedArtist: {},
    selectedAlbumBrowseId: "",
    selectedAlbum: {},
    newNotifications: []
  },
  mutations: {
    setSearchResults(state, searchResults) {
      state.searchResults = searchResults;
    },
    setPlaylistList(state, playlists) {
      state.playlists = playlists;
    },
    setSongToPlay(state, song) {
      state.currentSong = song.videoId;
    },
    playSong(state, song) {
      state.currentSong = song;
    },
    updateQueue(state, newQueue) {
      state.queuedTracks = newQueue;
    },
    modifyPlaylist(state, playlistId) {
      state.playlists.splice(state.playlists.indexOf(state.playlists.find(x => x.PlaylistId === playlistId)), 1);
    },
    removeTopFromQueue(state) {
      state.queuedTracks.shift();
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
    }
  },
  actions: {
    async setTrackToPlay({ commit }, song) {
      if (
        this.state.currentSong !== null ||
        this.state.currentSong !== undefined
      ) {
        commit("addTrackToHistory", this.state.currentSong);
      }
      window.player.loadVideoById(song.videoId);
      window.player.playVideo();
      commit("playSong", song);
    },
    async playPrevTrack({ commit, dispatch }) {
      commit("addTrackToTopOfQueue", this.state.currentSong);
      dispatch("setTrackToPlay", this.state.getLatestTrackFromHistory);
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
    async getPlaylists({commit}) {
      try {
        let response = await fetch(`/api/getplaylist/`);
        const playlists = await response.json();
        commit("setPlaylistList", playlists);
      }
      catch {
        let playlists = [];
        commit("setPlaylistList", playlists);
      }
    },
    async unfollowPlaylist(playlistId) {
      let response = await fetch(`/api/unfollowpPlaylist/${playlistId}`,{
      method: 'delete' 
      });     
    await response.json(); 
    },
    async deletePlaylist({commit}, playlistId) {
      console.log("test", playlistId)
      let response = await fetch(`/api/deletePlaylist/${playlistId}`,{
        method: 'delete' 
        });
      await response.json();
      commit("modifyPlaylist", playlistId)
      },
    async createUser() {
      const response = await fetch("/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.user),
      });
      if (response.status == '200') {
        alert("User has been created")
        router.go()
      }
      else {
        alert("Something went wrong, try again")
          }      
     },
     async validateUsername()
     {
      const response = await fetch('/api/checkUser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',         
        },
        body: JSON.stringify(this.state.user)
      });
      if(response.status=='200')
      {
        this.dispatch('createUser')       
      }
      else
      {
        alert("Username already exists,choose another")
      }
     
     },
     async loginUser(){
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.user),
      });
      if (response.status == "200") {
        alert("logged in");
        this.dispatch("checkAuth");
      }
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
      const response = await fetch(`api/yt/album/${browseId}`);
      const album = await response.json();
      commit("setSelectedAlbum", album);
    },
    async getNewNotifications({commit}) {
      const response = await fetch(`/api/notification/${this.state.user.userId}`);
      const newNotifications = await response.json();
      commit("setNewNotifications", newNotifications);
    }
  },
  getters: {
    getSearchContent(state) {
      return state.searchResults;
    },
    getPlaylists(state) {
      return state.playlists;
    },
    getCurrentSong(state) {
      return state.currentSong;
    },
    getCenterComponentForHome(state) {
      return state.componentToRenderInHomeCenter;
    },
    getQueuedTracks(state) {
      return state.queuedTracks;
    },
    getLatestTrackFromHistory(state) {
      return state.trackHistory.shift();
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
  },
  modules: {},
});
