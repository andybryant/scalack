/* @flow  */
let count = 1;
const localPrefix = 'local_';

export default function idGenerator(prefix: string = ''): string {
  const id = prefix + new Date().toISOString().slice(0, 19).
    replace(/-/g, '').
    replace(/:/g, '');
  const val = (count++).toString();
  return id + '_' + new Array(8 - val.length + 1).join('0') + val;
}

export function localIdGenerator(): string {
  return idGenerator(localPrefix);
}

export function isLocalId(id: string = ''): boolean {
  return id.startsWith(localPrefix);
}
