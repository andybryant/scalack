/* @flow  */
import type { State, Entities, LoginDetails } from '../type/state';
import { createSelector } from 'reselect';
import * as nav from '../util/navigation';
import channelCompare from '../model/channelCompare';

const channelIdSelector: (state: State) => string = state => state.router.params.channelId;
const authSelector: (state: State) => LoginDetails = state => state.auth;
const entitiesSelector: (state: State) => Entities = state => state.entities;

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

function enrichMessages({ unread, messages }, contacts) {
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

function calcUnread(channelId, channelMessages) {
  const unread = {};
  for (const id in channelMessages) {
    if (channelMessages.hasOwnProperty(id)) {
      unread[id] = channelId === id ? 0 : channelMessages[id].unread;
    }
  }
  return unread;
}

export const appSelector = createSelector(
  channelIdSelector,
  entitiesSelector,
  authSelector,
  (channelId, entities, auth) => ({
    unread: calcUnread(channelId, entities.messages),
    ...entities,
    ...auth,
    ...nav,
    channels: addChannelNames(entities.channels, auth, entities.contacts),
  })
);

export const channelSelector = createSelector(
  channelIdSelector,
  entitiesSelector,
  authSelector,
  (channelId, entities, auth) => ({
    channelMessages: enrichMessages(entities.messages[channelId], entities.contacts),
    ...entities,
    ...auth,
    ...nav,
    channels: addChannelNames(entities.channels, auth, entities.contacts),
  })
);
