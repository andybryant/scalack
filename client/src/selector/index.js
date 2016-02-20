/* @flow  */
import { createSelector } from 'reselect';
import * as nav from '../util/navigation';

import type { State, Entities, LoginDetails } from '../type/state';

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

function addSenders(messages, contacts) {
  const contactMap = toIdentityMap(contacts);
  return messages.map(message => {
    const contact = contactMap[message.senderId];
    return ({
      ...message,
      sender: contact ? contact.name : 'Unknown',
    });
  });
}

export const appSelector = createSelector(
  entitiesSelector,
  authSelector,
  (entities, auth) => ({
    ...entities,
    ...auth,
    ...nav,
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
  })
);
