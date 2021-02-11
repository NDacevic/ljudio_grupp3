import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchResults: [],
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
  },
  getters: {
    getSearchContent(state) {
      return state.searchResults;
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
