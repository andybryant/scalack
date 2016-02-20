/* @flow  */
import type { LoginDetails } from '../type/state';
import { handleActions } from 'redux-actions';
import update from 'immupdate';
import {
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED,
} from '../constants/ActionTypes';

/* $FlowFixMe - computed keys not supported by flow yet */
export const authReducer = handleActions({
  [LOGIN_SUCCESSFUL]: (state: LoginDetails, action: any) => {
    const { userId, userName } = action.payload;
    return update(state, { userId, userName, loggedIn: true });
  },
  [LOGIN_FAILED]: (state) => {
    return update(state, { userId: undefined, userName: undefined, loggedIn: false });
  },
}, {});
