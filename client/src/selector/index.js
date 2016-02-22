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

function addSenders({ unread, messages }, contacts) {
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

export const appSelector = createSelector(
  entitiesSelector,
  authSelector,
  (entities, auth) => ({
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
    channelMessages: addSenders(entities.messages[channelId], entities.contacts),
    ...entities,
    ...auth,
    ...nav,
    channels: addChannelNames(entities.channels, auth, entities.contacts),
  })
);
