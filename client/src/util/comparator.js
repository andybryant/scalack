/* @flow  */
function comparator(lhs:any, rhs: any): number {
  if (lhs < rhs) {
    return -1;
  }
  return (lhs === rhs ? 0 : 1);
}

export function compareStrings(lhs: string, rhs: string): number {
  return comparator(lhs, rhs);
}

export function compareNums(lhs: number, rhs: number): number {
  return comparator(lhs, rhs);
}
