<template>
  <div id="shareBackground">
    <diV id="shareContainer">
      <h3>Share</h3>
      <p v-if="!showMessage">{{ track.artist.name }} - {{ track.name }}</p>
      <p v-else>USERNAME NOT FOUND! TRY AGAIN!</p>
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
  data() {
    return {
      showMessage: false,
      message: "",
    };
  },
  methods: {
    async checkUser(userName) {
      this.$store.commit("setNotificationUser", userName);
      let id = await this.$store.getters.getNotificationUser;
      return id;
    },
    async sendShareContent() {
      let userInputText = document.getElementById("userInput").value;
      let id;
      if (userInputText !== "") {
        id = await this.checkUser(userInputText);

        if (id < 0) {
          console.log("Username not found!");
          this.showMessage = !this.showMessage;
          const x = setInterval(() => {
            this.showMessage = !this.showMessage;
            clearInterval(x);
          }, 3000);
        } else {
          let notificationToSend = {
            userId: id,
            senderName: this.$store.state.user.Username,
            unread: true,
            sharedContentId: this.track.videoId,
            sharedContentType: this.track.type,
            sharedContentName: this.track.name,
          };
          this.$store.dispatch("sendNotification", notificationToSend);
          this.$store.commit("setNotificationUser", -1);
          this.$store.commit("hideShareWindow");
        }
      }
    },
    exitShareComponent() {
      this.$store.commit("showShareComponent", false);
    },
  },
};
</script>
