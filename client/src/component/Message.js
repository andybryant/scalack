/* @flow  */
import React, { Component, PropTypes } from 'react';
import MessageEdit from './MessageEdit';
import MessageView from './MessageView';
import classnames from 'classnames';

const propTypes = {
  router: PropTypes.object.isRequired,
  messageId: PropTypes.string.isRequired,
};

class Message extends Component {

  render(): any {
    const { router, messageId } = this.props;
    const editing = (router.params.messageId === messageId);
    const classes = classnames(
      'Message',
      editing ? 'edit' : 'view'
    );
    return (
      <div className={classes}>
        {editing ? <MessageEdit {...this.props} /> : <MessageView {...this.props} />}
      </div>
    );
  }
}

Message.propTypes = propTypes;

export default Message;
