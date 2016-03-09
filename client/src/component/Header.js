/* @flow  */
import React, { Component, PropTypes } from 'react';
import {
  AppBar,
  FontIcon,
  IconButton,
  IconMenu,
  MenuItem,
} from 'material-ui/lib';
import Colors from 'material-ui/lib/styles/colors';

const propTypes = {
  userName: PropTypes.string,
  loggedIn: PropTypes.bool,
  logout: PropTypes.func.isRequired,
};

class Header extends Component {

  constructor(props:any) {
    super(props);
  }

  render():any {
    const { userName, loggedIn, logout } = this.props;
    const leftIcon = (
      <IconButton>
        <FontIcon className="material-icons">chat</FontIcon>
      </IconButton>
    );
    const rightIcon = loggedIn ? (
        <div className="right-icon">
          <h5 className="user-name">{userName}</h5>
          <IconMenu iconButtonElement={
            <IconButton>
              <FontIcon className="material-icons" color={Colors.white}>more_vert</FontIcon>
            </IconButton>}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText="Sign out" onTouchTap={logout} />
          </IconMenu>
        </div> ) : null;
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
