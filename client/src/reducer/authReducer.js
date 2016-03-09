/* @flow  */
import type { LoginDetails } from '../type/state';
import { handleActions } from 'redux-actions';
import update from 'react-addons-update';
import {
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED,
  LOGOUT_SUCCESSFUL,
} from '../constants/ActionTypes';

const loginSuccessful = (state: LoginDetails, action: any) => {
  const { userId, userName } = action.payload;
  return update(state, {$merge: { userId, userName, loggedIn: true }});
};

const clearUser = (state: LoginDetails) => {
  return update(state, {$merge: { userId: undefined, userName: undefined, loggedIn: false }});
};

/* $FlowFixMe - computed keys not supported by flow yet */
export const authReducer = handleActions({
  [LOGIN_SUCCESSFUL]: loginSuccessful,
  [LOGIN_FAILED]: clearUser,
  [LOGOUT_SUCCESSFUL]: clearUser,
}, {});
