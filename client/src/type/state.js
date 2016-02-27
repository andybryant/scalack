/* @flow  */
import type { Contact, Channel, Message } from './entities';


export type LoginDetails = {
  userId?: string,
  userName?: string,
  loggedIn: boolean,
};

export type ChannelMessages = {
  unread: number,
  messages: Array<Message>,
}

export type Entities = {
  currentChannelId: ?string,
  contacts: Array<Contact>,
  channels: Array<Channel>,
  messages: { [channelId:string]: ChannelMessages }
};

export type State = {
  router: any,
  auth: LoginDetails,
  errorMessage: ?string,
  entities: Entities,
};
