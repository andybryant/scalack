/* @flow  */
import type { Entities } from '../type/state';
import { handleActions } from 'redux-actions';
// import equal from 'deep-equal';
import update from 'immupdate';
import { log } from '../util';
import {
  CHANNEL_SET,
  USER_SET,
  PUBLISH_MESSAGE,
  MESSAGE_HISTORY,
} from '../constants/ActionTypes';

export const entityReducer = handleActions({
  // $FlowFixMe - computed keys not supported by flow yet
  [CHANNEL_SET]: (state: Entities, action: any) => {
    return update(state, { channels: action.payload });
  },
  [USER_SET]: (state: Entities, action: any) => {
    return update(state, { contacts: action.payload });
  },
  [PUBLISH_MESSAGE]: (state: Entities, action: any) => {
    log(action);
    const channelId = action.payload.channelId;
    const index = state.messages[channelId].length;
    return update(state, { messages: { [channelId]: { [index]: action.payload } } });
  },
  [MESSAGE_HISTORY]: (state: Entities, action: any) => {
    const { channelId, history } = action.payload;
    return update(state, { messages: { [channelId]: history } });
  },

}, {});
