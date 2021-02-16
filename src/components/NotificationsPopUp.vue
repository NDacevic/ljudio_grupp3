<template>
  <div id="notificationsPopUp">
    <h3>New notifications</h3>
    <div id="scroll" class="md-scrollbar">
      <div
        id="notification"
        v-for="(notification, index) in newNotifications"
        :key="index"
      >
        <p>
          <b>{{ notification.SenderName }}</b> wants to share this
          {{ notification.SharedContentType }} with you:
        </p>
        <p>
          <em>{{ notification.SharedContentName }}</em>
        </p>
        <div id="actionButtons">
          <div
            id="songAndVideoButtons"
            v-if="
              notification.SharedContentType === 'song' ||
                notification.SharedContentType === 'video'
            "
          >
            <button>Play now</button>
            <button @click="addMediaToQueue(notification)">Add to queue</button>
          </div>

          <button v-else>Load {{notification.SharedContentType}}</button>
        </div>
      </div>
    </div>
    <button @click="setRenderNotificationsModalFalse">
      Close Notifications
    </button>
  </div>
</template>

<script>
export default {
  name: "NotificationsPopUp",
  methods: {
    setRenderNotificationsModalFalse() {
      this.$store.commit("setRenderNotificationsModal", false);
    },
      addMediaToQueue(notification) {
        //this.$store.dispatch("getSearchResults", {sharedContentType: notification.SharedContentType, sharedContentId: notification.SharedContentId })
        console.log(notification)
    }
  },
  computed: {
    newNotifications() {
      return this.$store.getters.getNewNotifications;
    },
  }
};
</script>
