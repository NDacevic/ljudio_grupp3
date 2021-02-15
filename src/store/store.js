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
    searchHasBeenPerformed: false //Used to render search headers (or not)
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
      state.playlists.splice(state.playlists.indexOf(state.playlists.find(x => x.PlaylistId === playlistId)), 1)
    },
    setComponentToRenderInHomeCenter(state, componentToRender) {
      state.componentToRenderInHomeCenter = componentToRender;
    },
    setSearchHasBeenPerformed(state, searchHasBeenPerformed) {
      state.searchHasBeenPerformed = searchHasBeenPerformed;
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
    async getPlaylists({commit}) {
      let id =5;
      let response = await fetch(`/api/getplaylist/${id}`);
      const playlists = await response.json();
      commit("setPlaylistList", playlists);
    },
    async unfollowPlaylist(playlistId) {
      let id =5;
      let response = await fetch(`/api/unfollowpPlaylist/${id}/${playlistId}`,{
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
    getSearchHasBeenPerformed(state) {
      return state.searchHasBeenPerformed;
    }
  },
  modules: {},
});
