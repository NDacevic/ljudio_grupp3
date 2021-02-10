import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResults: [],
    currentSong: "j9V78UbdzWI",
    componentToRenderInHomeCenter: "search"
  },
  mutations: {
    setSearchResults(state, searchResults) {
      state.searchResults = searchResults;
    }
  },
  actions: {
    async getSearchResults({commit}, payload) {
      let response;
      if (payload.media === "playlists") {
        response = await fetch("our own endpoint towards playlists-table")
      }
      else {
        response = await fetch(`/api/yt/${payload.media}/search+${payload.searchString}`);
      }
      const searchResults =  await response.json();
      commit("setSearchResults", searchResults.content);
    },
  },
  getters: {
    getSearchContent(state) {
      return state.searchResults;
    },
    getCurrentSong(state){
      return state.currentSong;
    },
    getCenterComponent(state) {
      return state.componentToRenderInHomeCenter;
    }
  },
  modules: {
  }
})
