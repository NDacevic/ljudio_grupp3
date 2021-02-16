import Vue from "vue";
import Vuex from "vuex";
import router from '../router/index'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    router,
    user: {},
    searchResults: [],
    currentSong: {},
    nextSong: {},
    prevSong: {},
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
    playSong(state, song) {
      state.currentSong = song;
    },
    updateQueue(state, newQueue) {
      state.queuedTracks = newQueue;
    },
    removeTopFromQueue(state) {
      state.queuedTracks.shift();
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
    async setSongToPlay({ commit }, song) {
      window.player.loadVideoById(song.videoId);
      window.player.playVideo();
      commit("playSong", song);
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
    async createUser() {
      const response = await fetch('/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.user)
      });
      if (response.status == '200') {
        alert("User have been created")
      }
      else {
        alert("Something went wrong, try again")
      }
    },
    async loginUser() {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.user)
      });
      if (response.status == '200') {
        alert("logged in")
        this.dispatch('checkAuth')
      }
    },
    async checkAuth() {
      let response = await fetch(`/api/login/`)
      let data = await response.json()
      this.state.user = data
      router.push("/Home")

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
    getCenterComponentForHome(state) {
      return state.componentToRenderInHomeCenter;
    },
    getQueuedTracks(state) {
      return state.queuedTracks;
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
