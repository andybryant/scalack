/* @flow  */
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { FontIcon, IconButton, TextField } from 'material-ui/lib';
import { Colors } from 'material-ui/lib/styles';

const propTypes = {
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  sender: PropTypes.string,
};

class MessageEdit extends Component {
  constructor(props) {
    super(props);
    const { text } = this.props;
    this.state = {
      message: text,
    };
    this.onSave = this.onSave.bind(this);
    this.onRevert = this.onRevert.bind(this);
  }

  onSave(): void {

  }

  onRevert(): void {

  }

  render(): any {
    const messageClasses = classnames(
      'MessageEdit',
    );
    return (
      <div className={messageClasses}>
        <TextField
          className="message-input"
          ref="messageField"
          hintText="New message"
          fullWidth
          onChange={this.handleChange}
          onEnterKeyDown={this.handleSaveUpdate}
          value={this.state.message}
          />
        <IconButton onTouchTap={this.onRevert} className="cancel" title="Revert">
          <FontIcon
            className="material-icons"
            color={Colors.grey500}
            hoverColor={Colors.grey800}
            >
            cancel
          </FontIcon>
        </IconButton>

        <IconButton onTouchTap={this.onSave} className="save" title="Save">
          <FontIcon
            className="material-icons"
            color={Colors.grey500}
            hoverColor={Colors.grey800}
            >
            save
          </FontIcon>
        </IconButton>
      </div>
    );
  }
}

MessageEdit.propTypes = propTypes;

export default MessageEdit;
