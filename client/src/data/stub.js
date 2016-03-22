/* @flow  */
import type { State } from '../type/state';

const initialState: State = {
  auth: {
    userId: 'User125',
    userName: 'Bob',
    loggedIn: true,
  },
  errorMessage: null,
  router: {
    params: {
      channelId: 'Ch1',
    },
    location: {
      pathname: '/channel/Ch1',
    },
  },
  entities: {
    currentChannelId: undefined,
    contacts: [
      { id: 'AB123', name: 'Max' },
      { id: 'AB124', name: 'Mark' },
      { id: 'AB125', name: 'Andy' },
    ],
    channels: [
      { id: 'Ch1', name: 'General', private: false, contactIds: ['AB123', 'AB124', 'AB125'] },
      { id: 'Ch2', name: 'Max', private: true, contactIds: ['AB123', 'AB125'] },
      { id: 'Ch3', name: 'Mark', private: true, contactIds: ['AB124', 'AB125'] },
    ],
    messages: {
      'Ch1': {
        unread: 0,
        messages: [
          { id: '123', senderId: 'AB123', channelId: 'Ch1', timestamp: 123456, text: 'yoyoyo'},
          { id: '124', senderId: 'AB125', channelId: 'Ch1', timestamp: 123458, text: 'hey hey'},
        ]},
      'Ch2': { unread: 0, messages: []},
      'Ch3': { unread: 0, messages: []},
    },
  },
  presence: {
    lastActivityMs: 0,
  },
};

export default initialState;

