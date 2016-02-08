import React, { Component, PropTypes } from 'react';
import {
  AppBar,
  FontIcon,
  IconButton,
} from 'material-ui/lib';

const propTypes = {
  toggleNavBar: PropTypes.func.isRequired,
};

class Header extends Component {

  render() {
    const leftIcon = (
      <IconButton onClick={this.props.toggleNavBar}>
        <FontIcon className="material-icons">menu</FontIcon>
      </IconButton>
    );
    const rightIcon = (
      <IconButton>
        <FontIcon className="material-icons">more_vert</FontIcon>
      </IconButton>
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
