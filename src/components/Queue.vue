<template>
  <div class="queueContainer">
    <div class="queueHeader">
      <h1>Queue</h1>
    </div>
    <md-table v-model="queuedTracks" md-fixed-header>
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
        >
          <md-table-cell md-label="Title">{{ track.name }}</md-table-cell>
          <md-table-cell md-label="Artist">{{ track.artist.name }}</md-table-cell>
          <md-table-cell md-label="Duration">{{ track.duration }}</md-table-cell>
          <md-table-cell class="buttonCell" md-label="">
            <md-button @click="removeFromQueue(index)" class="md-icon-button md-raised md-accent">
              <md-icon>thumb_up</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </draggable>
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

<style scoped>
.queueContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.queueHeader {
  background: rgb(0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(255, 255, 255)
}
tbody > div {
  display: flex;
  flex-direction: column;
}
tr {
  display: flex;
  color: white;
  background-color: black;
}
td {
  flex-grow: 1;
}
.md-button {
  background-color: rgba(255, 255, 255, 0.822);
}
.emptyQueueHeader {
  background-color: black;
  color: white;
}
</style>