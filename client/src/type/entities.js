/* @flow  */
export type Contact = {
  id: string,
  name: string,
};

export type NamedChannel = {
  id: string,
  name: string,
  private: boolean,
  contactIds: Array<string>,
};

export type Channel = {
  id: string,
  name?: string,
  private: boolean,
  contactIds: Array<string>,
};

export type Message = {
  clientMessageId?: string,
  messageId?: string,
  senderId: string,
  channelId: string,
  text: string,
  timestamp: number,
  edited?: boolean,
};
