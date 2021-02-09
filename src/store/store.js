import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResults: []
  },
  mutations: {
    setSearchResults(state, searchResults) {
      state.searchResults = searchResults;
    }
  },
  actions: {
    async getSearchResults({commit}, media, searchString) {
      const response = await fetch(`/api/yt/${media}/search+${searchString}`);
      const searchResults =  await response.json();
      commit("setSearchResults", searchResults);
    },
  },
  modules: {
  }
})
