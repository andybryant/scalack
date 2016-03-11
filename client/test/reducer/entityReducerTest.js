/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0*/
import { entityReducer } from 'reducer/entityReducer';
import { createAction } from 'redux-actions';
import initialState from 'data/stub';
import { postMessage } from 'action/messageActions';

describe('entityReducer', () => {
  it('should return state for irrelevant actions', () => {
    const entities = Object.freeze(initialState.entities);
    const newEntities = entityReducer(entities, createAction('irrelevant')());
    expect(newEntities).to.equal(entities);
  });

  it('should return same state for postMessage', () => {
    const channelId = 'Ch2';
    const action = postMessage({
      channelId,
      text: 'yoyoyo',
    });
    const entities = Object.freeze(initialState.entities);
    const newEntities = entityReducer(entities, action);
    const newMessages = newEntities.messages;

    // console.info(JSON.stringify(newTasks));
    expect(newEntities).to.equal(entities);
    expect(newMessages).to.equal(entities.messages);
    expect(entities.messages[channelId].unread).to.equal(0);
    expect(entities.messages[channelId].messages).to.have.length(0);
  });

  it('should add message for publish message', () => {
    const channelId = 'Ch2';
    const action = {
      type: 'publishMessage',
      payload: {
        messageId: 'Msg1',
        clientMessageId: 'sdfsd',
        channelId: channelId,
        senderId: 'User1',
        text: 'yoyoyo',
        timestamp: 12345,
        edited: false,
      },
    };
    const entities = Object.freeze(initialState.entities);
    const newEntities = entityReducer(entities, action);
    const newMessages = newEntities.messages;

    // console.info(JSON.stringify(newTasks));
    expect(newEntities).to.not.equal(entities);
    expect(newMessages).to.not.equal(entities.messages);
    expect(entities.messages[channelId].unread).to.equal(0);
    expect(entities.messages[channelId].messages).to.have.length(0);
    expect(newMessages[channelId].unread).to.equal(1);
    expect(newMessages[channelId].messages).to.have.length(1);
    expect(newMessages[channelId].messages[0].text).to.equal('yoyoyo');
  });
});
