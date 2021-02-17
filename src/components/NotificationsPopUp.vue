<template>
  <div id="notificationBackground">
    <div id="notificationsPopUp">
      <h3>New notifications</h3>
      <div id="scroll" class="md-scrollbar">
        <div id="notification" v-for="(notification, index) in newNotifications" :key="index">
          <p>
            <b>{{ notification.SenderName }}</b> wants to share this {{ notification.SharedContentType }} with you:
          </p>
          <p>
            <em>{{ notification.SharedContentName }}</em>
          </p>
          <div id="actionButtons">
            <div id="songAndVideoButtons" v-if="notification.SharedContentType === 'song' || notification.SharedContentType === 'video'">
              <button @click="addTrackToQueueOrPlay(notification, false)">Play now</button>
              <button @click="addTrackToQueueOrPlay(notification, true)">Add to queue</button>
            </div>

            <button v-else @click="loadMediaContent(notification)">Load {{ notification.SharedContentType }}</button>
          </div>
        </div>
      </div>
      <button @click="setRenderNotificationsModalFalse">
        Close Notifications
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationsPopUp",
  methods: {
    setRenderNotificationsModalFalse() {
      this.$store.commit("setRenderNotificationsModal", false);
    },
    addTrackToQueueOrPlay(notification, addToQueue) {
      this.$store.dispatch("getMediaObjectAndAddToQueueOrPlay", { addToQueue: addToQueue, sharedContentType: notification.SharedContentType, sharedContentId: notification.SharedContentId });
    },
    loadMediaContent(notification) {
      console.log(notification.SharedContentId);
      this.$store.dispatch("getMediaContentAndRender", { sharedContentType: notification.SharedContentType, sharedContentId: notification.SharedContentId });
    },
  },
  computed: {
    newNotifications() {
      return this.$store.getters.getNewNotifications;
    },
  },
};
</script>
