import { createAction } from 'redux-actions';
import * as types from '../constants/ActionTypes';

const defaultMeta = { local: true, synced: false };
const defaultServerMeta = { toServer: true, ...defaultMeta };

export const login = createAction(
  types.LOGIN,
  (userName) => ({
    userName,
    password: 'pass1234',
  }),
  () => defaultServerMeta
);
