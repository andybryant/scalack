/* @flow  */
import React, { Component, PropTypes } from 'react';
import MDReactComponent from 'markdown-react-js';
import moment from 'moment';
import classnames from 'classnames';
import { FontIcon, IconButton } from 'material-ui/lib';
import { Colors } from 'material-ui/lib/styles';
import { gotoEditMessage } from '../util/navigation';

const propTypes = {
  channelId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  edited: PropTypes.bool,
  senderId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  sender: PropTypes.string,
  sameSender: PropTypes.bool,
  history: PropTypes.object.isRequired,
  deleteMessage: PropTypes.func.isRequired,
};

class MessageView extends Component {
  constructor(props: any) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleEdit() {
    const { history, channelId, messageId } = this.props;
    gotoEditMessage(history, channelId, messageId);
  }

  handleDelete() {
    const { channelId, messageId, deleteMessage } = this.props;
    deleteMessage(channelId, messageId);
  }

  render(): any {
    const { text, timestamp, sender, sameSender, userId, senderId, edited } = this.props;
    const messageClasses = classnames(
      'MessageView',
      { 'same-sender': sameSender },
      { mine: userId === senderId },
      { edited: edited },
    );
    const iconStyle = {
      fontSize: '12px',
    };
    return (
      <div className={messageClasses}>
        <div className="sender">{sender}</div>
        <div className="timestamp">{ moment(timestamp).format('LT') }</div>
        <div className="text">
          <MDReactComponent text={text} className="markdown-text" />
          <span className="edit-label">(edited)</span>
        </div>
        <div className="operations">
          <IconButton onTouchTap={this.handleEdit} style={iconStyle}>
            <FontIcon
              className="material-icons"
              style={iconStyle}
              color={Colors.grey500}
              hoverColor={Colors.green700}
              >
              mode_edit
            </FontIcon>
          </IconButton>
          <IconButton onTouchTap={this.handleDelete} style={iconStyle}>
            <FontIcon
              className="material-icons"
              style={iconStyle}
              color={Colors.grey500}
              hoverColor={Colors.red900}
              >
              delete
            </FontIcon>
          </IconButton>
        </div>
      </div>
    );
  }
}

MessageView.propTypes = propTypes;
MessageView.defaultProps = {
  edited: false,
};

export default MessageView;
