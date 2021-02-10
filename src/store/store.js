import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResults: [],
    playlists: []
  },
  mutations: {
    setSearchResults(state, searchResults) {
      state.searchResults = searchResults;
    },
    setPlaylistList(state, playlists) {
      state.playlists = playlists;
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
    async getPlaylists({commit}) {
      let response = await fetch("login.userId");
      const playlists = await response.json();
      commit("setPlaylistList", playlists);
    }
  },
  getters: {
    getSearchContent(state) {
      return state.searchResults;
    },
    getPlaylists(state) {
      return state.playlists;
    }
  },
  modules: {
  }
})
