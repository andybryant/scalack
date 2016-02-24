/* @flow  */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import { websocketService } from '../service/websocketService';
import ScalackTheme from './ScalackTheme';
import Header from '../component/Header';
import ChannelList from '../component/ChannelList';
import Footer from '../component/Footer';
import * as actions from '../action';
import { gotoUrl } from '../util/navigation';
import { appSelector } from '../selector';
import thunkCreator from '../service/serviceThunkCreator';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleDismissClick = this.handleDismissClick.bind(this);
    this.handleNav = this.handleNav.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(ScalackTheme),
    };
  }

  handleDismissClick(event) {
    this.props.resetErrorMessage();
    event.preventDefault();
  }

  handleNav(open, url) {
    if (url) {
      gotoUrl(this.props.history, url);
    }
  }

  renderErrorMessage() {
    const { errorMessage } = this.props;
    if (!errorMessage) {
      return null;
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
    );
  }

  render() {
    const { children, history, channels, messages } = this.props;
    return (
      <div className="App">
        <Header {...this.props} />
        <div className="container-fluid">
          <div className="row">
            <ChannelList
              handleNav={this.handleNav}
              history={history}
              channels={channels}
              messages={messages}
              />
            <div className="main-body col-lg-9">
              {this.renderErrorMessage()}
              {children}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object,
};

App.propTypes = {
  // Injected by React Redux
  auth: PropTypes.object,
  channels: PropTypes.array,
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  // Injected by React Router
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const messageCallback = thunkCreator(dispatch);
  websocketService.connect(messageCallback);
  const boundActions = bindActionCreators({ pushState, ...actions }, dispatch);
  return {
    ...boundActions,
  };
}

export default connect(appSelector, mapDispatchToProps)(App);
