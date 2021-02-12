import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResults: [],
    playlists: [],
    currentSong: "j9V78UbdzWI",
    componentToRenderInHomeCenter: "search"
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
    async getPlaylists({commit}) {
      let id =5;
      let response = await fetch(`/api/getplaylist/${id}`);
      const playlists = await response.json();
      commit("setPlaylistList", playlists);
    },
    /*async unfollowPlaylist({commit}, playlistId) {
      let id =5;
      let response = await fetch(`/api/unfollowPlaylist/${id}/${playlistId}`,{
      method: 'delete' 
      });
      
      const result = await response.json(); 
      commit("setPlaylistList")?
    }*/
  },
  getters: {
    getSearchContent(state) {
      return state.searchResults;
    },
    getPlaylists(state) {
      return state.playlists;
    },
    getCurrentSong(state){
      return state.currentSong;
    },
    getCenterComponentForHome(state) {

      return state.componentToRenderInHomeCenter;
    }
  },
  modules: {
  }
})
