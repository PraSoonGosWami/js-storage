import { getTTLDateString } from "./utils.js";

export function getCookie(identifier) {
  const all = getAllCookies();
  if (!all) return all;
  return all[identifier];
}

export function getAllCookies() {
  const res = document.cookie;
  if (!res.length) return null;
  return res.split(";").reduce((acc, curr) => {
    return { ...acc, [curr.split("=")[0].trim()]: curr.split("=")[1] };
  }, {});
}

export function addCookie(identifier, value, options = {}, isSecured) {
  if (!identifier || !value) return;
  const { expires, path = "/", ...rest } = options;
  let composer = `${identifier}=${value};expires=${getTTLDateString(
    expires
  )};path=${path};`;
  if (isSecured) composer += "secure=true;";
  Object.keys(rest).forEach((key) => (composer += `${key}=${options[key]};`));
  document.cookie = composer;
}

export function deleteCookie(identifier, options = {}) {
  if (!identifier) return;
  let composer = `${identifier}=;expires=${getTTLDateString(null, true)};`;
  if (options.path) composer += `path=${options.path};`;
  if (options.domain) composer += `domain=${options.domain};`;
  console.log(composer);
  document.cookie = composer;
}

export function deleteAllCookies(options) {
  const all = getAllCookies();
  if (all) Object.keys(all).forEach((key) => deleteCookie(key, options));
}
