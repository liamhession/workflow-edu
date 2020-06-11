const isBrowser = () => typeof window !== "undefined";

export const getLocalItem = (key) =>
  isBrowser() && window.localStorage.getItem(key)
    ? JSON.parse(window.localStorage.getItem(key))
    : {};

export const setLocalItem = (key, object) =>
  isBrowser() && window.localStorage.setItem(key, JSON.stringify(object));

export const clearLocalStorage = () =>
  isBrowser() && window.localStorage.clear();