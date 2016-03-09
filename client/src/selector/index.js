/* @flow  */
import type { State, Entities, LoginDetails } from '../type/state';
import { createSelector } from 'reselect';
import * as nav from '../util/navigation';
import channelCompare from '../model/channelCompare';

const authSelector: (state: State) => LoginDetails = state => state.auth;
const entitiesSelector: (state: State) => Entities = state => state.entities;
const routerSelector: (state: State) => Entities = state => state.router;
const errorMessageSelector: (state: State) => Entities = state => state.errorMessage;

function toIdentityMap(entities) {
  const map = {};
  entities.forEach(entity => {
    map[entity.id] = entity;
  });
  return map;
}

function addChannelNames(channels, auth, contacts) {
  const contactMap = toIdentityMap(contacts);
  return channels.map(channel => {
    if (channel.private) {
      const name = channel.contactIds
        .filter(id => id !== auth.userId)
        .map(id => contactMap[id])
        .map(contact => contact ? contact.name : '')
        .join(' ');
      return {
        ...channel,
        name,
      };
    }
    return channel;
  }).sort(channelCompare);
}

function enrichMessages(channelMessages, contacts, router) {
  const { params: { channelId } } = router;
  if (channelMessages.hasOwnProperty(channelId)) {
    const { unread, messages } = channelMessages[channelId];
    const contactMap = toIdentityMap(contacts);
    const enrichedMessages = messages.map(message => {
      const contact = contactMap[message.senderId];
      return ({
        ...message,
        sender: contact ? contact.name : 'Unknown',
      });
    });
    return {
      unread,
      messages: enrichedMessages,
    };
  }
  return {
    unread: 0,
    messages: [],
  };
}

function calcUnread(channelMessages, router) {
  const { params: { channelId } } = router;
  const unread = {};
  for (const id in channelMessages) {
    if (channelMessages.hasOwnProperty(id)) {
      unread[id] = channelId === id ? 0 : channelMessages[id].unread;
    }
  }
  return unread;
}

export const appSelector = createSelector(
  entitiesSelector,
  authSelector,
  routerSelector,
  errorMessageSelector,
  (entities, auth, router, errorMessage) => ({
    unread: calcUnread(entities.messages, router),
    ...entities,
    ...auth,
    ...nav,
    router,
    errorMessage,
    channels: addChannelNames(entities.channels, auth, entities.contacts),
  })
);

export const channelSelector = createSelector(
  entitiesSelector,
  authSelector,
  routerSelector,
  (entities, auth, router) => ({
    channelMessages: enrichMessages(entities.messages, entities.contacts, router),
    ...entities,
    ...auth,
    ...nav,
    router,
    channels: addChannelNames(entities.channels, auth, entities.contacts),
  })
);

export const notificationSelector = createSelector(
  entitiesSelector,
  authSelector,
  routerSelector,
  (entities, auth) => ({
    channelMessages: entities.messages,
    channels: toIdentityMap(addChannelNames(entities.channels, auth, entities.contacts)),
    userId: auth.userId,
  })
);
