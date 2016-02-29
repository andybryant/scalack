/* @flow  */
import React, { Component, PropTypes } from 'react';
import MDReactComponent from 'markdown-react-js';
import moment from 'moment';
import classnames from 'classnames';
import { gotoEditMessage } from '../util/navigation';
import {
  FontIcon,
  IconButton,
  IconMenu,
  MenuItem,
} from 'material-ui/lib';

const propTypes = {
  channelId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  sender: PropTypes.string,
  sameSender: PropTypes.bool,
  history: PropTypes.object.isRequired,
  deleteMessage: PropTypes.func.isRequired,
};

class MessageView extends Component {
  constructor(props) {
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
    const { text, timestamp, sender, sameSender } = this.props;
    const messageClasses = classnames(
      'MessageView',
      { 'same-sender': sameSender },
    );
    return (
      <div className={messageClasses}>
        <div className="sender">{sender}</div>
        <div className="timestamp">{ moment(timestamp).format('LT') }</div>
        <div className="text"><MDReactComponent text={text} /></div>
        <div className="operations">
          <IconMenu iconButtonElement={
            <IconButton>
              <FontIcon className="material-icons">more_vert</FontIcon>
            </IconButton>}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem
              primaryText="Edit"
              leftIcon={<FontIcon className="material-icons">mode_edit</FontIcon>}
              onTouchTap={this.handleEdit}
              />
            <MenuItem
              primaryText="Delete"
              leftIcon={<FontIcon className="material-icons">delete</FontIcon>}
              onTouchTap={this.handleDelete}
              />
          </IconMenu>
        </div>
      </div>
    );
  }
}

MessageView.propTypes = propTypes;

export default MessageView;
