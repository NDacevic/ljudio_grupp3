<template>
  <div class="queueContainer">
    <div class="queueHeader">
      <h1>Queue</h1>
    </div>
    <md-table v-model="queuedTracks" md-fixed-header class="md-scrollbar">
    <h3 class="emptyQueueHeader" v-if="queuedTracks.length === 0">No tracks in queue</h3>
      <draggable
        v-model="queuedTracks"
        @start="drag=true" 
        @end="drag=false"
      >
        <md-table-row
          class="listItem" 
          v-for="(track, index) in queuedTracks" 
          :key="track.id"
          @dblclick="playTrackAndRemoveFromQueue(index)"
        >
          <md-table-cell md-label="Track"><div>{{ track.name }}</div><div>{{ track.artist.name }}</div></md-table-cell>
          <md-table-cell md-label="Duration">{{ track.duration }}</md-table-cell>
          <md-table-cell class="buttonCell" md-label="">
            <md-button @click="removeFromQueue(index)" class="md-icon-button md-raised md-accent">
              <i class="material-icons-round">delete</i>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </draggable>
      <md-button v-if="queuedTracks.length !== 0" @click="clearQueue">Clear Queue</md-button>
    </md-table>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: "Queue",
  components: {
    draggable
  },
  methods: {
    setSelectedRow(index) {
      this.selectedIndex = index;
    },
    removeFromQueue(index) {
      this.queuedTracks.splice(index, 1);
    },
    playTrackAndRemoveFromQueue(index) {
      let media = this.queuedTracks[index];
      this.$store.dispatch("setSongToPlay", media);
      this.queuedTracks.splice(index, 1);
    },
    clearQueue() {
      this.queuedTracks = [];
    }
  },
  computed: {
    queuedTracks: {
        get() {
            return this.$store.getters.getQueuedTracks;
        },
        set(newQueue) {
            this.$store.commit('updateQueue', newQueue);
        }
    }
  },
  data() {
    return {
      selectedIndex: null
    }
  }
}
</script>