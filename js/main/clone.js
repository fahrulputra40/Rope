export let isCloning = false;

export function skipDuringClone(callback, fallback = () => {}) {
  return (...args) => (isCloning ? fallback(...args) : callback(...args));
}
