import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchResults: [],
    playlists: [],
    currentSong: {},
    nextSong: {},
    prevSong: {},
    componentToRenderInHomeCenter: "search",
    queuedTracks: [],
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
  },
  actions: {
    async setSongToPlay({ commit }, song) {
      window.player.loadVideoById(song.videoId);
      window.player.playVideo();
      commit("playSong", song);
    },
    async getSearchResults({ commit }, payload) {
      let response;
      if (payload.media === "playlists") {
        response = await fetch("our own endpoint towards playlists-table");
      } else {
        response = await fetch(
          `/api/yt/${payload.media}/search+${payload.searchString}`
        );
      }
      const searchResults = await response.json();
      commit("setSearchResults", searchResults.content);
    },
    async getPlaylists({commit}) {
      let id =5;
      let response = await fetch(`/api/getplaylist/${id}`);
      const playlists = await response.json();
      commit("setPlaylistList", playlists);
    },
    async unfollowPlaylist({dispatch}, playlistId) {
      let id =5;
      let response = await fetch(`/api/unfollowpPlaylist/${id}/${playlistId}`,{
      method: 'delete' 
      });     
    await response.json(); 
    dispatch("getPlaylists")
    },
    async deletePlaylist(playlistId) {
      let response = await fetch(`/api/deletePlaylist/${playlistId}`,{
        method: 'delete' 
        });
      await response.json();
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
  },
  modules: {},
});
