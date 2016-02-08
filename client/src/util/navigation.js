
export function gotoUrl(history: any, url: string) {
  history.pushState(null, url);
}

export function gotoChannel(history: any, channelId: string): void {
  gotoUrl(history, `/channel/${channelId}`);
}
