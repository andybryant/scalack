import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

const defaultMeta = { local: true, synced: false };
const defaultServerMeta = { toServer: true, ...defaultMeta };

export const postMessage = createAction(
  types.POST_MESSAGE,
  (channelId, text) => ({
    channelId,
    text,
    clientMessageId: 'Msg' + Date.now(),
  }),
  () => defaultServerMeta
);

export const updateMessage = createAction(
  types.UPDATE_MESSAGE,
  (channelId, messageId, text) => ({
    channelId,
    messageId,
    text,
  }),
  () => defaultServerMeta
);

export const deleteMessage = createAction(
  types.DELETE_MESSAGE,
  (channelId, messageId) => ({
    channelId,
    messageId,
  }),
  () => defaultServerMeta
);
