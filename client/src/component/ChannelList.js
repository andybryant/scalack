/* @flow  */
import React, { Component, PropTypes } from 'react';
import { List, ListItem, FontIcon } from 'material-ui/lib';
import Colors from 'material-ui/lib/styles/colors';
import classnames from 'classnames';

class ChannelList extends Component {
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
    const { handleNav, channels, unread } = this.props;
    const listStyle = {
      backgroundColor: Colors.lightBlueA100,
    };
    const itemStyle = {
      color: Colors.indigo900,
      fontWeight: 'bold',
    };
    const items = channels.map(item => {
      const count = unread[item.id];
      const countClasses = classnames(
        'count',
        { 'none': count === 0 },
        { 'non-zero': count > 0 },
      );
      const leftIcon = (
        <FontIcon
          className="material-icons"
          color={Colors.indigo900}>
          {item.private ? 'face' : 'group_work' }
        </FontIcon>
      );
      const rightIcon = <div><div className={countClasses}>{count}</div></div>;
      const route = `/channel/${item.id}`;
      const clickHandler = () => { handleNav(route); };
      return (
        <ListItem
          key={item.id}
          primaryText={item.name}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          onTouchTap={clickHandler}
          style={itemStyle}
          />
      );
    });
    return (
      <div className="col-lg-3 ChannelList">
        <List style={listStyle}>
          {items}
        </List>
      </div>
    );
  }
}

ChannelList.propTypes = {
  channels: PropTypes.array,
  handleNav: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  unread: PropTypes.object.isRequired,
};

export default ChannelList;
