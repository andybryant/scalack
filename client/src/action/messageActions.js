import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

const defaultMeta = { local: true, synced: false };

export function newMessage(channelId, text) {
  return dispatch => {
    // TODO send to server then...
    dispatch(createAction(
      types.NEW_MESSAGE,
      () => ({
        message: {
          channelId,
          text,
          timestamp: Date.now(),
        },
      }),
      () => defaultMeta
    )());
  };
}
