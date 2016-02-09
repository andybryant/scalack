/* @flow  */
import React, { Component, PropTypes } from 'react';
import { LeftNav, List, ListItem, FontIcon } from 'material-ui/lib';

class NavBar extends Component {
  constructor(props:any) {
    super(props);
    this.getSelectedIndex = this.getSelectedIndex.bind(this);
  }

  getSelectedIndex() {
    const { channels } = this.props;
    let currentItem;
    for (let index = channels.length - 1; index >= 0; index--) {
      currentItem = channels[index];
      if (currentItem.route && this.props.history.isActive(currentItem.route)) {
        return index;
      }
    }
  }

  render() {
    const { handleNav, showNav, channels } = this.props;
    const items = channels.map(item => {
      const icon = <FontIcon className="material-icons">{item.private ? 'face' : 'group_work' }</FontIcon>;
      const route = `/channel/${item.id}`;
      const clickHandler = () => { handleNav(false, route); };
      return (
        <ListItem key={item.id} primaryText={item.name} leftIcon={icon} onTouchTap={clickHandler} />
      );
    });
    return (
      <LeftNav ref="nav"
        docked={false}
        open={showNav}
        onRequestChange={open => handleNav(open)}
        >
        <List>
          {items}
        </List>
      </LeftNav>
    );
  }
}

NavBar.propTypes = {
  showNav: PropTypes.bool,
  channels: PropTypes.array,
  handleNav: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

NavBar.defaultProps = {
  showNav: false,
};

export default NavBar;
