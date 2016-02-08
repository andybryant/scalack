/* @flow  */
import { createSelector } from 'reselect';
import * as nav from '../util/navigation';

import type { State, Entities } from '../type/state';

const entitiesSelector: (state: State) => Entities = state => state.entities;

export const channelSelector = createSelector(
  entitiesSelector,
  (entities) => ({
    ...entities,
    ...nav,
  })
);
