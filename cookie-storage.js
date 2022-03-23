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
  const { expires, ...rest } = options;
  let str = `${identifier}=${value}; expires=${getTTLDateString(expires)}; ${
    isSecured ? "secure=true;" : ""
  }`;
  Object.keys(rest).forEach((key) => (str += `${key}=${options[key]}; `));
  document.cookie = str;
}

export function deleteCookie(identifier) {
  if (!identifier) return;
  document.cookie = `${identifier}=; expires=${getTTLDateString(
    null,
    true
  )}; path=/; `;
}

export function deleteAllCookies() {
  const all = getAllCookies();
  if (all) Object.keys(all).forEach((key) => deleteCookie(key));
}
