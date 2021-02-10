import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResults: [],
    currentSong: "j9V78UbdzWI",
    nextSong: "",
    prevSong: ""
  },
  mutations: {
    setSearchResults(state, searchResults) {
      state.searchResults = searchResults;
    }
  },
  actions: {
    async getSearchResults({commit}, media, searchString) {
      let response;
      if (media === "playlists") {
        response = await fetch("our own endpoint towards playlists-table")
      }
      else {
        response = await fetch(`/api/yt/${media}/search+${searchString}`);
      }
      const searchResults =  await response.json();
      commit("setSearchResults", searchResults);
    },
  },
  getters: {
    getSearchContent(state) {
      return state.searchResults;
    },
    getCurrentSong(state){
      return state.currentSong;
    }
  },
  modules: {
  }
})
