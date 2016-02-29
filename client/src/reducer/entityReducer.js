/* @flow  */
import type { ChannelMessages, Entities } from '../type/state';
import { handleActions } from 'redux-actions';
// import equal from 'deep-equal';
import update from 'immupdate';
import {
  CHANNEL_SET,
  USER_SET,
  PUBLISH_MESSAGE,
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
    return update(state, { channels, messages });
  },
  [USER_SET]: (state: Entities, action: any) => {
    return update(state, { contacts: action.payload });
  },
  [PUBLISH_MESSAGE]: (state: Entities, action: any) => {
    const channelId = action.payload.channelId;
    const index = state.messages[channelId].messages.length;
    if (channelId !== state.currentChannelId) {
      state.messages[channelId].unread += 1;
    }
    const unread = state.messages[channelId].unread;
    return update(state, { messages: { [channelId]: { unread, messages: { [index]: action.payload } } } });
  },
  [MESSAGE_HISTORY]: (state: Entities, action: any) => {
    const { channelId, history } = action.payload;
    const channelMessages = { unread: history.length, messages: history };
    return update(state, { messages: { [channelId]: channelMessages } });
  },
  [ROUTER_DID_CHANGE]: (state: Entities, action: any) => {
    const { params } = action.payload;
    if (params && params.channelId) {
      return update(state, {
        messages: {
          [params.channelId]: { unread: 0 },
        },
        currentChannelId: params.channelId,
      });
    }
    return state;
  },

}, {});
