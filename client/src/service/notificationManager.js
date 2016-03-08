import { notificationSelector } from '../selector';

Notification.requestPermission();

const notificationManager = (store) => {
  let oldChannelMessages;
  let oldState;
  store.subscribe(() => {
    const state = store.getState();
    if (state === oldState) return;
    const { channelMessages, channels, userId } = notificationSelector(state);
    if (channelMessages === oldChannelMessages) return;
    for (const channelId in oldChannelMessages) {
      if (oldChannelMessages.hasOwnProperty(channelId) &&
        channelMessages.hasOwnProperty(channelId)) {
        const newMessages = channelMessages[channelId].unread - oldChannelMessages[channelId].unread;
        if (newMessages > 0) {
          const msgs = channelMessages[channelId].messages;
          const lastMessage = msgs[msgs.length - 1];
          if (lastMessage.senderId !== userId) {
            const channel = channels[channelId];
            const unread = channelMessages[channelId].unread;
            const title = unread === 1 ? 'New message available' : `${unread} new messages available`;
            new Notification(title, { // eslint-disable-line no-new
              body: (channel.private ? 'from ' : 'on ') + channel.name,
              tag: channelId,
            });
          }
        }
      }
    }
    oldChannelMessages = channelMessages;
    oldState = state;
  });
};

export default notificationManager;
