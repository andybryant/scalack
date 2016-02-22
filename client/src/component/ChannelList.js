/* @flow  */
import React, { Component, PropTypes } from 'react';
import { List, ListItem, FontIcon } from 'material-ui/lib';
import Colors from 'material-ui/lib/styles/colors';

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
    const listStyle = {
      backgroundColor: Colors.deepOrange50,
    };
    const items = channels.map(item => {
      const icon = <FontIcon className="material-icons">{item.private ? 'face' : 'group_work' }</FontIcon>;
      const route = `/channel/${item.id}`;
      const clickHandler = () => { handleNav(false, route); };
      return (
        <ListItem key={item.id} primaryText={item.name} leftIcon={icon} onTouchTap={clickHandler} />
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
};

export default ChannelList;
