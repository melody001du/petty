export function isPlainObject(obj) {
  return typeof obj === 'object'
    && Object.prototype.toString.call(obj) === '[object Object]';
}

export function mergeObject(target, needMergeObject, isPatch) {
  console.log('在这target', target);
  const actions = {};
  Object.keys(needMergeObject).forEach((key) => {
    if (isPatch ? target.hasOwnProperty(key) : true) {
      const readyState = needMergeObject[key];
      typeof readyState !== 'function' ? target[key] =  readyState : actions[key] = readyState;
    }
  });
  return actions;
}

export function mergeReactiveObject(target, needMergeObject) {
  console.log('在这target2', target);
  Object.keys(needMergeObject).forEach((key) => {
    const readyState = needMergeObject[key]?.value || needMergeObject[key];
    if (target.hasOwnProperty(key) && typeof readyState !== 'function') {
      target[key].value =  readyState;
    }
  });
}


/**
 * obj or array => [{key,value}]
 * @param {Array|Object} map
 * @return {Array}
 */
export function unifyToKeyValue(map) {
  assert(typeof map === 'object', 'mapHelers must pass object or array');
  return  isPlainObject(map)
    ? Object.keys(map).map(key => ({ key, value: map[key] }))
    : map.map(key => ({ key, value: key }));
}


export function assert(condition, errorMsg) {
  if (!condition) throw new Error(`[petty]:${errorMsg}`);
}
