export type WebsocketService = {
  connect: (callback: any) => void,
  status: () => number,
  send: (action: any) => void
};
