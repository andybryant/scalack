/* @flow  */
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import websocketServiceCreator from '../service/websocketService';
import ScalackTheme from './ScalackTheme';
import Header from '../component/Header';
import NavBar from '../component/NavBar';
import Footer from '../component/Footer';
import { resetErrorMessage } from '../action';
import { gotoUrl } from '../util/navigation';
import { channelSelector } from '../selector';
import thunkCreator from '../service/serviceThunkCreator';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleDismissClick = this.handleDismissClick.bind(this);
    this.handleToggleNavBar = this.handleToggleNavBar.bind(this);
    this.handleNav = this.handleNav.bind(this);
    this.login = this.login.bind(this);
    this.state = { showNav: false };
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
    this.setState({showNav: open});
    if (url) {
      gotoUrl(this.props.history, url);
    }
  }

  handleToggleNavBar() {
    this.setState({showNav: !this.state.showNav});
  }

  login(user, password) {
    const { wsService } = this.props;
    wsService.send({ type: 'login', payload: { user, password }});
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
    const { auth, children, history, channels } = this.props;
    return (
      <div className="main-content">
        <Header auth={auth} toggleNavBar={this.handleToggleNavBar} login={this.login} />
        <NavBar
          showNav={this.state.showNav}
          handleNav={this.handleNav}
          history={history}
          channels={channels}
          />
        {this.renderErrorMessage()}
        {children}
        <Footer />
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
  // actions etc
  wsService: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const messageCallback = thunkCreator(dispatch);
  const wsService = websocketServiceCreator(messageCallback, 'ws://localhost:9000/ws');
  const actions = bindActionCreators({ resetErrorMessage, pushState });
  return {
    ...actions,
    wsService,
  };
}

export default connect(channelSelector, mapDispatchToProps)(App);
