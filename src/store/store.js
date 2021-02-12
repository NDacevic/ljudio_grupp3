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
    setComponentToRenderInHomeCenter(state, componentToRender) {
      state.componentToRenderInHomeCenter = componentToRender;
    },
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
  },
  modules: {},
});
