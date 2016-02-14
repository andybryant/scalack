/* @flow  */
import { handleActions } from 'redux-actions';
import {
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED,
} from '../constants/ActionTypes';

/* $FlowFixMe - computed keys not supported by flow yet */
export const authReducer = handleActions({
  [LOGIN_SUCCESSFUL]: (state) => {
    // todo set up auth state
    return state;
  },
  [LOGIN_FAILED]: (state) => {
    // todo set up auth state
    return state;
  },
}, {
  userId: 'andy',
});
