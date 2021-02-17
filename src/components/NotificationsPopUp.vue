<template>
  <div id="notificationBackground">
    <div id="notificationsPopUp">
      <h2>New notifications</h2>
      <div id="scroll" class="md-scrollbar">
        <div id="notification" v-for="notification in newNotifications" :key="notification.Id">
          <p>
            {{notification.Id}} <b>{{ notification.SenderName }}</b> wants to share this {{ notification.SharedContentType }} with you:
          </p>
          <p>
            <em>{{ notification.SharedContentName }}</em>
          </p>

          <div class="notificationActions" v-if="notification.SharedContentType === 'song' || notification.SharedContentType === 'video'">
            <button @click="addTrackToQueueOrPlay(notification, false)">Play now</button>
            <button @click="addTrackToQueueOrPlay(notification, true)">Add to queue</button>
            <button id="dismissButton" @click="updateNotificationUnread(notification)">Dismiss</button>
          </div>
          <div class="notificationActions" v-else>
            <button @click="loadMediaContent(notification)">Load {{ notification.SharedContentType }}</button>
            <button id="dismissButton" @click="updateNotificationUnread(notification)">Dismiss</button>
          </div>
        </div>
      </div>
      <button id="closeButton" @click="setRenderNotificationsModalFalse">
        Close
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
      this.$store.dispatch("updateNotificationUnread", notification);
      this.$store.commit("setRenderNotificationsModal", false)
    },
    loadMediaContent(notification) {
      this.$store.dispatch("getMediaContentAndRender", { sharedContentType: notification.SharedContentType, sharedContentId: notification.SharedContentId });
      this.$store.dispatch("updateNotificationUnread", notification);
      this.$store.commit("setRenderNotificationsModal", false)
    },
    updateNotificationUnread(notification)
    {
      this.$store.dispatch("updateNotificationUnread", notification);
    }
  },
  computed: {
    newNotifications() {
      return this.$store.getters.getNewNotifications;
    },
  },
};
</script>
