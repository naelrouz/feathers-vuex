/*
eslint
@typescript-eslint/explicit-function-return-type: 0,
@typescript-eslint/no-explicit-any: 0
*/
import { assert } from 'chai'
import Vue from 'vue'
import Vuex from 'vuex'
import { clearModels } from '../../src/service-module/global-models'
import { clients } from '../../src/service-module/global-clients'
import { feathersRestClient as feathers } from '../../test/fixtures/feathers-client'
import feathersVuex from '../../src/index'
import _pick from 'lodash/pick'
import _omit from 'lodash/omit'

Vue.use(Vuex)

describe('makeServicePlugin', function () {
  beforeEach(() => {
    clearModels()
  })

  it('adds Feathers client to the global clients', () => {
    feathersVuex(feathers, {
      serverAlias: 'this is a test'
    })
    assert(clients.byAlias['this is a test'], 'got a reference to the client.')
  })

  it('registers the vuex module with options', function () {
    interface RootState {
      todos: {}
    }

    const serverAlias = 'default'
    const { makeServicePlugin, BaseModel } = feathersVuex(feathers, {
      serverAlias
    })
    const servicePath = 'todos'
    class Todo extends BaseModel {
      public static modelName = 'Todo'
      public static servicePath = servicePath
    }
    const todosPlugin = makeServicePlugin({
      servicePath,
      Model: Todo,
      service: feathers.service(servicePath)
    })
    const store = new Vuex.Store<RootState>({ plugins: [todosPlugin] })

    const keys = Object.keys(store.state.todos)
    const received = _pick(store.state.todos, keys)
    const expected = {
      addOnUpsert: false,
      autoRemove: false,
      debug: false,
      copiesById: {},
      enableEvents: true,
      errorOnCreate: null,
      errorOnFind: null,
      errorOnGet: null,
      errorOnPatch: null,
      errorOnRemove: null,
      errorOnUpdate: null,
      idField: 'id',
      tempIdField: '__id',
      ids: [],
      isCreatePending: false,
      isFindPending: false,
      isGetPending: false,
      isPatchPending: false,
      isRemovePending: false,
      isUpdatePending: false,
      keepCopiesInStore: false,
      keyedById: {},
      modelName: 'Todo',
      nameStyle: 'short',
      namespace: 'todos',
      pagination: {
        defaultLimit: null,
        defaultSkip: null
      },
      paramsForServer: [],
      preferUpdate: false,
      replaceItems: false,
      serverAlias: 'default',
      servicePath: 'todos',
      skipRequestIfExists: false,
      tempsById: {},
      whitelist: []
    }

    assert.deepEqual(_omit(received), _omit(expected), 'defaults in place.')
  })

  it('sets up Model.store && service.FeathersVuexModel', function () {
    const serverAlias = 'default'
    const { makeServicePlugin, BaseModel } = feathersVuex(feathers, {
      serverAlias
    })

    const servicePath = 'todos'
    const service = feathers.service(servicePath)
    class Todo extends BaseModel {
      public static modelName = 'Todo'
      public static servicePath = servicePath
    }
    const todosPlugin = makeServicePlugin({ servicePath, Model: Todo, service })
    const store = new Vuex.Store({ plugins: [todosPlugin] })

    assert(Todo.store === store, 'the store is on the Model!')
    // @ts-ignore
    assert.equal(service.FeathersVuexModel, Todo, 'Model accessible on service')
  })

  it('allows accessing other models', function () {
    const serverAlias = 'default'
    const { makeServicePlugin, BaseModel, models } = feathersVuex(feathers, {
      idField: '_id',
      serverAlias
    })

    const servicePath = 'todos'
    class Todo extends BaseModel {
      public static modelName = 'Todo'
      public static servicePath = servicePath
    }
    const todosPlugin = makeServicePlugin({
      servicePath,
      Model: Todo,
      service: feathers.service(servicePath)
    })

    const store = new Vuex.Store({
      plugins: [todosPlugin]
    })

    assert(models[serverAlias][Todo.name] === Todo)
    assert(Todo.store === store)
  })
})
