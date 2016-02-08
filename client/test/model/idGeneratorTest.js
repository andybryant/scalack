/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0*/
import idGenerator, { localIdGenerator, isLocalId } from 'model/idGenerator';

describe('idGenerator', () => {
  it('ids all same length', () => {
    const len = idGenerator().length;
    for (let count = 0; count < 1000; count++) {
      expect(idGenerator()).to.have.length(len);
    }
  });

  it('ids all different', () => {
    const ids = new Set();
    for (let count = 0; count < 1000; count++) {
      ids.add(idGenerator());
    }
    expect(ids.size).to.equal(1000);
  });
});

describe('localIdGenerator', () => {
  it('local ids are all local', () => {
    for (let count = 0; count < 1000; count++) {
      expect(isLocalId(localIdGenerator())).to.equal(true);
    }
  });
});
