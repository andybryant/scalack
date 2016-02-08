/* @flow  */
import type { State } from '../type/state';

const initialState: State = {
  auth: {
    userid: 'AB125',
  },
  errorMessage: null,
  router: {
    params: {
      channel: 'Ch1',
    },
    location: {
      pathname: '/channel/Ch1',
    },
  },
  entities: {
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
      'General': [
        { id: '123', senderId: 'AB123', channelId: 'General', timestamp: 123456, text: 'yoyoyo'},
        { id: '124', senderId: 'AB125', channelId: 'General', timestamp: 123458, text: 'hey hey'},
      ],
    },
  },
};

export default initialState;

