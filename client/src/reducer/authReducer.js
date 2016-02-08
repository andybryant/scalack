/* @flow  */
import { handleActions } from 'redux-actions';
import {
  LOGIN,
} from '../constants/ActionTypes';

/* $FlowFixMe - computed keys not supported by flow yet */
export const authReducer = handleActions({
  [LOGIN]: (state) => {
    // todo set up auth state
    return state;
  },
}, {
  userId: 'andy',
});
