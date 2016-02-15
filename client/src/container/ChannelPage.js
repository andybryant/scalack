/* @flow  */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { channelSelector } from '../selector';
import * as actions from '../action';

const propTypes = {
  routeParams: PropTypes.object.isRequired,
  entities: PropTypes.object.isRequired,
};

class ChannelPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // const { channels } = this.props;
    // const channelId = 'sss';

    return (
      <div className="ChannelPage container">
        <h2></h2>
      </div>
    );
  }
}

ChannelPage.propTypes = propTypes;

export default connect(channelSelector, actions)(ChannelPage);
