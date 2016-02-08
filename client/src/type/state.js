/* @flow  */
import type { Contact, Channel, Message } from './entities';


export type LoginDetails = {
  userId: string,
};

export type Entities = {
  contacts: Array<Contact>,
  channels: Array<Channel>,
  messages: { [channelId:string]: Array<Message> }
};

export type State = {
  router: any,
  auth: LoginDetails,
  errorMessage: ?string,
  entities: Entities,
};
