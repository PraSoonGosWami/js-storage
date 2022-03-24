export function getSStorage(identifier) {
  if (!identifier) return null;
  const data = window.sessionStorage.getItem(identifier);
  if (!data) return null;
  return JSON.parse(data);
}

export function getAllSStorage() {
  return Object.keys(window.sessionStorage).reduce((acc, curr) => {
    return { ...acc, [curr]: getSStorage(curr) };
  }, {});
}

export function addSStorage(identifier, value = "") {
  if (!identifier) return;
  let data = value;
  if (typeof data !== "string") data = JSON.stringify(data);
  window.sessionStorage.setItem(identifier, data);
}

export function deleteSStorage(identifier) {
  if (!identifier) return;
  window.sessionStorage.removeItem(identifier);
}

export function deleteAllSStorage() {
  window.sessionStorage.clear();
}
