/* @flow  */
import type { State } from '../type/state';

const initialState: State = {
  auth: {
    loggedIn: false,
  },
  errorMessage: null,
  entities: {
    currentChannelId: undefined,
    contacts: [],
    channels: [],
    messages: {},
  },
  router: {
    location: {
      pathname: '/',
    },
    params: {},
  },
};

export default initialState;
