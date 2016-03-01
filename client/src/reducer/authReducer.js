/* @flow  */
import type { LoginDetails } from '../type/state';
import { handleActions } from 'redux-actions';
import update from 'react-addons-update';
import {
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED,
} from '../constants/ActionTypes';

/* $FlowFixMe - computed keys not supported by flow yet */
export const authReducer = handleActions({
  [LOGIN_SUCCESSFUL]: (state: LoginDetails, action: any) => {
    const { userId, userName } = action.payload;
    return update(state, {$merge: { userId, userName, loggedIn: true }});
  },
  [LOGIN_FAILED]: (state) => {
    return update(state, {$merge: { userId: undefined, userName: undefined, loggedIn: false }});
  },
}, {});
