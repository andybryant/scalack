/* @flow  */
import type { Entities } from '../type/state';
import { handleActions } from 'redux-actions';
// import equal from 'deep-equal';
// import update from 'immupdate';
import { log } from '../util';
import {
  NEW_CHANNEL,
  NEW_MESSAGE,
} from '../constants/ActionTypes';

export const entityReducer = handleActions({
  // $FlowFixMe - computed keys not supported by flow yet
  [NEW_CHANNEL]: (state: Entities, action: any) => {
    log(action);
    return state;
  },
  [NEW_MESSAGE]: (state, action) => {
    log(action);
    return state;
  },

}, {});
