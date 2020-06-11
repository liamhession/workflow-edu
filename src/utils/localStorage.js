const isBrowser = () => typeof window !== "undefined";

export const getLocalItem = (key) =>
  isBrowser() && window.localStorage.getItem(key)
    ? JSON.parse(window.localStorage.getItem(key))
    : {};

export const setLocalItem = (key, object) =>
  window.localStorage.setItem(key, JSON.stringify(object));