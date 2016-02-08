/* @flow  */
import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

export const resetErrorMessage = createAction(types.RESET_ERROR_MESSAGE);

export const loginInitiated = createAction(types.LOGIN);

export {
  newMessage,
} from './messageActions';
