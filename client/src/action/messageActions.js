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
