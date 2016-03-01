/* @flow  */
import type { ChannelMessages, Entities } from '../type/state';
import { handleActions } from 'redux-actions';
import update from 'react-addons-update';
import {
  CHANNEL_SET,
  USER_SET,
  PUBLISH_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
  MESSAGE_HISTORY,
} from '../constants/ActionTypes';
import { ROUTER_DID_CHANGE } from 'redux-router/lib/constants';

const DEFAULT_MESSAGES: ChannelMessages = {
  unread: 0,
  messages: [],
};

export const entityReducer = handleActions({
  // $FlowFixMe - computed keys not supported by flow yet
  [CHANNEL_SET]: (state: Entities, action: any) => {
    const messages = Object.assign({}, state.messages);
    const channels = action.payload;
    channels.forEach(channel => {
      messages[channel.id] = state.messages[channel.id] || DEFAULT_MESSAGES;
    });
    return update(state, {$merge: { channels, messages }});
  },
  [USER_SET]: (state: Entities, action: any) => {
    return update(state, { contacts: {$set: action.payload }});
  },
  [PUBLISH_MESSAGE]: (state: Entities, action: any) => {
    const channelId = action.payload.channelId;
    let unread = state.messages[channelId].unread;
    if (channelId !== state.currentChannelId) {
      unread += 1;
    }
    return update(state, { messages: { [channelId]: {
      unread: {$set: unread},
      messages: {$push: [action.payload] },
    }}});
  },
  [UPDATE_MESSAGE]: (state: Entities, action: any) => {
    if (action.meta.local) return state;
    const { messageId, channelId, text } = action.payload;
    const { messages } = state.messages[channelId];
    const index = messages.findIndex(msg => msg.messageId === messageId);
    if (index >= 0) {
      const updatedMessage = Object.assign({}, messages[index], { text, edited: true });
      return update(state, { messages: { [channelId]: { messages: { [index]: {$set: updatedMessage}}}}});
    }
    return state;
  },
  [DELETE_MESSAGE]: (state: Entities, action: any) => {
    if (action.meta.local) return state;
    const { messageId, channelId } = action.payload;
    const { messages } = state.messages[channelId];
    let { unread } = state.messages[channelId];
    const index = messages.findIndex(msg => msg.messageId === messageId);
    if (index >= 0) {
      if (unread > 0 && index >= (messages.length - unread)) {
        unread -= 1;
      }
      return update(state, { messages: { [channelId]: {
        messages: {$splice: [[index, 1]]},
        unread: {$set: unread},
      }}});
    }
    return state;
  },
  [MESSAGE_HISTORY]: (state: Entities, action: any) => {
    const { channelId, history } = action.payload;
    const channelMessages = { unread: history.length, messages: history };
    return update(state, { messages: {$merge: { [channelId]: channelMessages }}});
  },
  [ROUTER_DID_CHANGE]: (state: Entities, action: any) => {
    const { params } = action.payload;
    if (params && params.channelId) {
      return update(state, {
        messages: {
          [params.channelId]: { unread: {$set: 0 }},
        },
        currentChannelId: {$set: params.channelId},
      });
    }
    return state;
  },

}, {});
