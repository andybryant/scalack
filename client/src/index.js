// import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './container/Root';
import configureStore from './store/configureStore';
import notificationManager from './service/notificationManager';
import initialState from './data/initial';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { log } from './util';

injectTapEventPlugin();
const store = configureStore(initialState);
log.info('Created store', store);
notificationManager(store);

render(
  <Root store={store} />,
  document.getElementById('app')
);
