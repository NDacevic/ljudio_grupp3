<template>
  <div id="shareBackground">
    <diV id="shareContainer">
      <h3>Share</h3>
      <p v-if="!showMessage">{{ mediaName }}</p>
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
    media: Object,
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
      let mediaType = this.media.type != null ? this.media.type : "playlist";
      let contentId = this.getContentId(mediaType);
      let contentName = this.getContentName(mediaType);

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
            sharedContentId: contentId,
            sharedContentType: mediaType,
            sharedContentName: contentName,
          };
          this.$store.dispatch("sendNotification", notificationToSend);
          this.$store.commit("setNotificationUser", -1);
          this.$store.commit("showShareComponent", false);
        }
      }
    },
    getContentId(type) {
      if (type === "song" || type === "video") {
        return this.media.videoId;
      } else if (type === "album" || type === "artist") {
        return this.media.browseId;
      } else {
        console.log("PLid", this.media.PlaylistId);
        return this.media.PlaylistId.toString();
      }
    },
    getContentName(type) {
      if (type != "") {
        return this.media.name;
      } else {
        console.log("Plname", this.media.PlaylistName);
        return this.media.PlaylistName;
      }
    },
    exitShareComponent() {
      this.$store.commit("showShareComponent", false);
    },
  },
  computed: {
    mediaName() {
      let mediaName = "";
      console.log(this.media);
      switch (this.media.type) {
        case "song":
          mediaName = this.media.artist.name + " - " + this.media.name;
          break;
        case "video":
          mediaName = this.media.author + " - " + this.media.name;
          break;
        case "album":
          mediaName = this.media.artist + " - " + this.media.name;
          break;
        case "artist":
          mediaName = this.media.name;
          break;
        case "playlist":
          mediaName = this.media.PlaylistName;
          break;
      }
      return mediaName;
    },
  },
};
</script>
