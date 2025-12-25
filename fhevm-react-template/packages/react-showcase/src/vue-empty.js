/**
 * Empty Vue module stub for React builds
 * This replaces vue imports to prevent webpack resolution errors
 * when Vue adapters are exported but not used
 * 
 * Browser-safe: uses ES modules, no require()
 */

// Export empty object and Vue functions as stubs
// These will never be called in React showcase
export default {};

export function ref(initialValue) {
  return { value: initialValue };
}

export function computed(getter) {
  return { value: getter ? getter() : null };
}

export function onMounted(fn) {
  // No-op in React builds
}

export function watch(source, callback, options) {
  // No-op in React builds
  return () => {}; // Return unwatch function
}

export function reactive(target) {
  return target || {};
}

export function toRef(object, key) {
  return { value: object ? object[key] : null };
}

export function toRefs(object) {
  return object || {};
}

export function unref(ref) {
  return ref && typeof ref === 'object' && 'value' in ref ? ref.value : ref;
}

export function isRef(value) {
  return value && typeof value === 'object' && 'value' in value;
}

export function nextTick(fn) {
  return Promise.resolve().then(() => fn && fn());
}
