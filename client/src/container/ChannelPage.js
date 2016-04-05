/* @flow  */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { channelSelector } from '../selector';
import * as actions from '../action';
import MessageList from '../component/MessageList';
import MessageInput from '../component/MessageInput';
import * as Mousetrap from 'mousetrap';
import { gotoEditMessage } from '../util/navigation';

const propTypes = {
  channels: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired,
  channelMessages: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

class ChannelPage extends Component {
  constructor(props: any) {
    super(props);
    this.handleEditLastMessage = this.handleEditLastMessage.bind(this);
    this.mousetrap = new Mousetrap.default(); // eslint-disable-line new-cap
  }

  componentWillMount() {
    this.mousetrap
      .bind('up', () => { this.handleEditLastMessage(); });
  }

  handleEditLastMessage() {
    const { userId, channelMessages: { messages }, history } = this.props;
    const lastMessage = messages.reverse().find(message => message.senderId === userId);
    if (lastMessage) {
      const { messageId, channelId } = lastMessage;
      gotoEditMessage(history, channelId, messageId);
    }
  }

  render(): any {
    const { channels, params: { channelId } } = this.props;
    const channel = channels.find(ch => ch.id === channelId);
    return channel ? (
      <div className="ChannelPage">
        <div className="title">{channel.name ? channel.name : 'Private'}</div>
        <MessageList {...this.props} />
        <MessageInput editLastMessage={this.handleEditLastMessage} {...this.props}/>
      </div>
    ) : null;
  }
}

ChannelPage.propTypes = propTypes;

export default connect(channelSelector, actions)(ChannelPage);
