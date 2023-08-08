/* eslint-disable arrow-body-style */
import { unifyToKeyValue } from './helpers';

export const mapStates = mapFactory((state, keyValue) =>  {
  return keyValue.reduce((userState, userMap) => {
    const { key, value } = userMap;
    if (typeof value === 'function') {
      userState[key] = value.bind(null, state);
    } else {
      userState[key] = function () {
        return state[value].value;
      };
    }
    return userState;
  }, {});
});

export const mapActions = mapFactory((actions, keyValue) => {
  return keyValue.reduce((userActions, userMap) => {
    const { key, value } = userMap;
    userActions[key] = actions[value];
    return userActions;
  }, {});
});

function mapFactory(helperFunc) {
  return function (useStore, mapKeys) {
    const [useState] = useStore();
    const keyValue = unifyToKeyValue(mapKeys);
    return helperFunc(useState, keyValue);
  };
}
