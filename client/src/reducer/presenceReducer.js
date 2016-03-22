/* @flow  */
import type { Presence } from '../type/state';
import { handleActions } from 'redux-actions';
import {
  PUBLISH_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
  LOGIN_SUCCESSFUL,
} from '../constants/ActionTypes';
import { ROUTER_DID_CHANGE } from 'redux-router/lib/constants';

const update = () => {
  const result: Presence = {
    lastActivityMs: Date.now(),
  };
  return result;
};

/* $FlowFixMe - computed keys not supported by flow yet */
export const presenceReducer = handleActions({
  [LOGIN_SUCCESSFUL]: update,
  [ROUTER_DID_CHANGE]: update,
  [PUBLISH_MESSAGE]: update,
  [UPDATE_MESSAGE]: update,
  [DELETE_MESSAGE]: update,
}, {});
