/*
eslint
@typescript-eslint/explicit-function-return-type: 0,
@typescript-eslint/no-explicit-any: 0
*/

import _omit from 'lodash/omit'

export default function makeDefaultState(servicePath, options) {
  const nonStateProps = [
    'actions',
    'getters',
    'instanceDefaults',
    'Model',
    'mutations',
    'service',
    'setupInstance',
    'state',
    'actions'
  ]

  const state = {
    ids: [],
    keyedById: {},
    copiesById: {},
    tempsById: {},
    pagination: {
      defaultLimit: null,
      defaultSkip: null
    },

    isFindPending: false,
    isGetPending: false,
    isCreatePending: false,
    isUpdatePending: false,
    isPatchPending: false,
    isRemovePending: false,

    errorOnFind: null,
    errorOnGet: null,
    errorOnCreate: null,
    errorOnUpdate: null,
    errorOnPatch: null,
    errorOnRemove: null
  }

  if (options.Model) {
    // @ts-ignore
    state.modelName = options.Model.modelName
  }

  const startingState = _omit(options, nonStateProps)

  return Object.assign({}, state, startingState)
}
