/* @flow  */
export type Contact = {
  id: string,
  name: string,
};

export type Channel = {
  id: string,
  private: boolean,
  contacts: Array<string>,
};

export type Message = {
  id?: string,
  senderId: string,
  channelId: string,
  text: string,
  timestamp: number,
};
