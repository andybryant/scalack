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
};

class Header extends Component {

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event) {
    const username = event.target.value;
    const password = 'pass123';
    this.props.login(username, password);
  }

  render() {
    const leftIcon = (
      <IconButton onClick={this.props.toggleNavBar}>
        <FontIcon className="material-icons">menu</FontIcon>
      </IconButton>
    );
    const rightIcon = (
      <TextField ref="userField" hintText="Username" onEnterKeyDown={this.handleLogin} />
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
