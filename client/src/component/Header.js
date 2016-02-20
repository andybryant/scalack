/* @flow  */
import React, { Component, PropTypes } from 'react';
import {
  AppBar,
  FontIcon,
  IconButton,
  TextField,
} from 'material-ui/lib';

const propTypes = {
  login: PropTypes.func.isRequired,
  toggleNavBar: PropTypes.func.isRequired,
  userName: PropTypes.string,
  loggedIn: PropTypes.bool,
};

class Header extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      userName: '',
    };
  }

  handleChange(event) {
    const userName = event.target.value;
    this.setState({ userName });
  }

  handleLogin(event) {
    const userName = event.target.value;
    const password = 'pass123';
    this.props.login(userName, password);
    this.setState({ userName: ''});
  }

  render() {
    const { userName, loggedIn, toggleNavBar } = this.props;
    const leftIcon = (
      <IconButton onClick={toggleNavBar}>
        <FontIcon className="material-icons">menu</FontIcon>
      </IconButton>
    );
    const rightIcon = loggedIn ? <span>{userName}</span> : (
      <TextField ref="userField"
        hintText="Username"
        onChange={this.handleChange}
        value={this.state.userName}
        onEnterKeyDown={this.handleLogin}
        />
    );
    return (
      <AppBar
        className="Header"
        title="Scalack"
        iconElementLeft={leftIcon}
        iconElementRight={rightIcon}
      />
    );
  }
}

Header.propTypes = propTypes;

export default Header;
