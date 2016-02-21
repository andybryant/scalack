/* @flow  */
import React, { Component, PropTypes } from 'react';
import { List, ListItem, FontIcon } from 'material-ui/lib';

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
    const { handleNav, channels } = this.props;
    const items = channels.map(item => {
      const icon = <FontIcon className="material-icons">{item.private ? 'face' : 'group_work' }</FontIcon>;
      const route = `/channel/${item.id}`;
      const clickHandler = () => { handleNav(false, route); };
      return (
        <ListItem key={item.id} primaryText={item.name} leftIcon={icon} onTouchTap={clickHandler} />
      );
    });
    return (
      <List>
        {items}
      </List>
    );
  }
}

ChannelList.propTypes = {
  channels: PropTypes.array,
  handleNav: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default ChannelList;
