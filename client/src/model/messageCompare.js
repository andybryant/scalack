/* @flow  */
import type { Message } from '../type/entities';
import { compareNums } from '../util/comparator';

type MessageCompareFunction = (lhs: Message, rhs: Message) => number;

const messageCompare: MessageCompareFunction = (lhs, rhs) => {
  return compareNums(lhs.timestamp, rhs.timestamp);
};

export default messageCompare;
