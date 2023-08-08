import Vue from 'vue';

import { mergeObject, mergeReactiveObject } from './helpers';
import { getPetty } from './pettyHelpers';
// import { set } from 'vue-demi';
// const { set } = Vue;
let vm;

export function createStore(id, hook) {
  const petty = getPetty();
  if (!vm) {
    vm = new Vue({
      data: {
        $$state: {},
      },
    });
  }


  function defineStore() {
    if (petty.stores.get(id)) {
      return petty.stores.get(id);
    }
    // 初始化
    const $patch = createPatch(id);
    const $active = createActive(id);
    const initialState = {};
    const userState = hook({ $patch, $active });
    const actions = mergeObject(initialState, userState);
    // 响应式
    Vue.set(vm._data.$$state, id, initialState);
    createActions(actions);
    Object.assign(initialState, actions);
    // 返回值
    const store = [initialState, $patch];
    // 映射store
    petty.stores.set(id, store);
    // store API
    petty.$reset = createReset(hook, { $patch, $active });
    petty.$dispose = createDispose;
    return store;
  }

  function createActive() {
    return function active(state) {
      return { value: state };
    };
  }

  // function createReactive(key, value) {
  //   return {
  //     [key]: { value },
  //   };
  // }

  function createActions(actions) {
    Object.keys(actions).forEach((key) => {
      const action = actions[key];
      actions[key] = function (payload) {
        return action.call(null, payload);
      };
    });
  }

  function createPatch(id) {
    const storeState = () => vm._data.$$state[id];
    return function $patch(stateOrMutation) {
      if (typeof stateOrMutation === 'function') {
        stateOrMutation(storeState());
      } else {
        mergeReactiveObject(storeState(), stateOrMutation);
      }
    };
  }

  function createReset(hook, { $patch, $active }) {
    return function (id) {
      const storeState = vm._data.$$state[id];
      const initialState = hook({ $patch, $active });
      mergeReactiveObject(storeState, initialState);
    };
  }

  function createDispose(id) {
    const vmState = vm._data.$$state;
    delete vmState[id];
    petty.stores.delete(id);
  }

  return defineStore;
}

