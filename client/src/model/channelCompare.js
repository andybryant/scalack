/* @flow  */
import type { NamedChannel } from '../type/entities';
import { compareNums, compareStrings } from '../util/comparator';

type ChannelCompareFunction = (lhs: NamedChannel, rhs: NamedChannel) => number;

function privateToInt(channel: NamedChannel): number {
  return channel.private ? 1 : 0;
}

const channelCompare: ChannelCompareFunction = (lhs, rhs) => {
  let result = compareNums(privateToInt(lhs), privateToInt(rhs));
  if (result === 0) {
    result = compareStrings(lhs.name.toUpperCase(), rhs.name.toUpperCase());
  }
  return result;
};

export default channelCompare;
