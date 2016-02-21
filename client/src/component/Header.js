/* @flow  */
import React, { Component, PropTypes } from 'react';
import {
  AppBar,
  FontIcon,
  IconButton,
  IconMenu,
  MenuItem,
  TextField,
} from 'material-ui/lib';

const propTypes = {
  login: PropTypes.func.isRequired,
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
    const { userName, loggedIn } = this.props;
    const leftIcon = (
      <IconButton>
        <FontIcon className="material-icons">chat</FontIcon>
      </IconButton>
    );
    const rightIcon = loggedIn ? (
        <div className="right-icon">
          <span className="user-name">{userName}</span>
          <IconMenu iconButtonElement={
            <IconButton>
              <FontIcon className="material-icons">more_vert</FontIcon>
            </IconButton>}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="Sign out" />
          </IconMenu>
        </div> ) : (
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
