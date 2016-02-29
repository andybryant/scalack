import React from 'react';
import { Route } from 'react-router';
import App from './container/App';
import ChannelPage from './container/ChannelPage';

export default (
  <Route path="/" component={App}>
    <Route path="/channel/:channelId"
           component={ChannelPage} >
      <Route path="/channel/:channelId/:messageId" />
    </Route>
  </Route>
);
