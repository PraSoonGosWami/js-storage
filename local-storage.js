import { getTTLDateString } from "./utils.js";

export function getLStorage(identifier) {
  if (!identifier) return null;
  const data = window.localStorage.getItem(identifier);
  if (!data) return null;
  const { expires, ...rest } = JSON.parse(data);
  if (expires && new Date() > new Date(expires)) {
    deleteLStorage(identifier);
    return null;
  }
  return rest;
}

export function getAllLStorage() {
  return Object.keys(window.localStorage).reduce((acc, curr) => {
    return getLStorage(curr)
      ? { ...acc, [curr]: getLStorage(curr) }
      : { ...acc };
  }, {});
}

export function addLStorage(identifier, value = "", options = {}) {
  if (!identifier) return;
  let data = value;
  if (typeof data !== "string")
    data = JSON.stringify({
      ...data,
      expires: options.expires ? getTTLDateString(options.expires) : null,
    });
  window.localStorage.setItem(identifier, data);
}

export function deleteLStorage(identifier) {
  if (!identifier) return;
  window.localStorage.removeItem(identifier);
}

export function deleteAllLStorage() {
  window.localStorage.clear();
}
