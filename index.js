import { createStore } from './ceateStore.js';
import { mapActions, mapStates } from './mapHelpers.js';
import { setPetty } from './pettyHelpers.js';;

export function createPetty() {
  const petty = {
    install(_Vue) {
      injectPetty(_Vue);
    },
    stores: new Map(),
  };

  setPetty(petty);

  return petty;
}

function injectPetty(Vue) {
  Vue.mixin({
    beforeCreate: beforeCreatePetty,
  });
}

function beforeCreatePetty() {
  console.log('在这组件内', this.$options);
  const options = this.$options;
  if (!options.$petty && options.parent && options.parent.$petty) {
    options.$petty = options.parent.$petty;
  }
}


export {
  createStore,
  mapActions,
  mapStates,
};
