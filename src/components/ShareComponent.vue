<template>
  <div id="shareBackground">
    <diV id="shareContainer">
      <h3>Share</h3>
      <p>{{ track.artist.name }} - {{ track.name }}</p>
      <input id="userInput" type="text" placeholder="Name of the user" />
      <div class="buttonContainer">
        <button @click="sendShareContent">Send</button>
        <button @click="exitShareComponent">Close</button>
      </div>
    </diV>
  </div>
</template>

<script>
export default {
  name: "Share",
  props: {
    track: Object,
  },
  methods: {
    sendShareContent() {
      let user = document.getElementbyId("userInput").value;
      if (user !== "") {
        let notificationToSend = {
          userId: this.$state.user.userId,
          senderName: this.$state.user.Username,
          unread: true,
          url: this.track.videoId,
          contentType: this.track.type,
          playlistId: null,
        };
        this.$store.dispatch("sendNotification", notificationToSend);
      }
    },
    exitShareComponent() {
      this.$emit("hide-share");
    },
  },
};
</script>
