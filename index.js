class Storage {
  constructor(type) {
    this.type = type;
    this.isSecured = false;
  }
  static COOKIE = "cookie";
  static LOCAL_STORAGE = "localStorage";
  static SESSION_STORAGE = "sessionStorage";
  static DEFAULT_TTL = 1; // in minutes

  static COOKIE_PRIORITY = { HIGH: "High", MEDIUM: "Medium", LOW: "Low" };

  get(name) {
    if (this.type === Storage.COOKIE) return this.#getCookie(name);
    if (this.type === Storage.LOCAL_STORAGE) return this.#getLStorage(name);
    if (this.type === Storage.SESSION_STORAGE) return this.#getSStorage(name);
  }
  getAll() {
    if (this.type === Storage.COOKIE) return this.#getAllCookies();
    if (this.type === Storage.LOCAL_STORAGE) return this.#getAllLStorage();
    if (this.type === Storage.SESSION_STORAGE) return this.#getAllSStorage();
  }
  add(name, value, options) {
    this.type === Storage.COOKIE && this.#addCookie(name, value, options);
    this.type === Storage.LOCAL_STORAGE &&
      this.#addLStorage(name, value, options);
    this.type === Storage.SESSION_STORAGE &&
      this.#addSStorage(name, value, options);
  }
  delete(name) {
    this.type === Storage.COOKIE && this.#deleteCookie(name);
    this.type === Storage.LOCAL_STORAGE && this.#deleteLStorage(name);
    this.type === Storage.SESSION_STORAGE && this.#deleteSStorage(name);
  }
  deleteAll() {
    this.type === Storage.COOKIE && this.#deleteAllCookies();
    this.type === Storage.LOCAL_STORAGE && this.#deleteAllLStorage();
    this.type === Storage.SESSION_STORAGE && this.#deleteAllSStorage();
  }

  set cookieSecured(bool) {
    this.isSecured = bool;
  }

  //Private methods for Cookie management
  #getCookie(name) {
    const all = this.#getAllCookies();
    console.log(all);
    if (!all) return all;
    return all[name];
  }

  #getAllCookies() {
    const res = document.cookie;
    if (!res.length) return null;
    return res.split(";").reduce((acc, curr) => {
      return { ...acc, [curr.split("=")[0].trim()]: curr.split("=")[1] };
    }, {});
  }

  #addCookie(name, value, options = {}) {
    if (!name || !value) return;
    const { expires, ...rest } = options;
    const ttl = expires || Storage.DEFAULT_TTL;
    let str = `${name}=${value}; expires=${this.#getTTLDateString(ttl)}; ${
      this.isSecured && "secure"
    }`;
    Object.keys(rest).forEach((key) => (str += `${key}=${options[key]}; `));
    document.cookie = str;
  }

  #deleteCookie(name) {
    if (!name) return;
    document.cookie = `${name}=; expires=${this.#getTTLDateString(
      null,
      true
    )}; path=/; `;
  }

  #deleteAllCookies() {
    const all = this.#getAllCookies();
    if (all) Object.keys(all).forEach((key) => this.#deleteCookie(key));
  }

  //Private methods for Local Storage management
  #getLStorage(name) {
    if (!name) return null;
    const data = window.localStorage.getItem(name);
    if (!data) return null;
    const { ttl, ...rest } = JSON.parse(data);
    if (ttl && new Date() > new Date(ttl)) {
      this.#deleteLStorage(name);
      return null;
    }
    return rest;
  }

  #getAllLStorage() {
    return Object.keys(window.localStorage).reduce((acc, curr) => {
      return this.#getLStorage(curr)
        ? { ...acc, [curr]: this.#getLStorage(curr) }
        : { ...acc };
    }, {});
  }

  #addLStorage(name, value = "", options = {}) {
    if (!name) return;
    let data = value;
    if (typeof data !== "string")
      data = JSON.stringify({
        ...data,
        ttl: options.expires ? this.#getTTLDateString(options.expires) : null,
      });
    window.localStorage.setItem(name, data);
  }

  #deleteLStorage(name) {
    if (!name) return;
    window.localStorage.removeItem(name);
  }

  #deleteAllLStorage() {
    window.localStorage.clear();
  }

  //Private methods for Session Storage management
  #getSStorage(name) {
    if (!name) return null;
    const data = window.sessionStorage.getItem(name);
    if (!data) return null;
    return JSON.parse(data);
  }

  #getAllSStorage() {
    return Object.keys(window.sessionStorage).reduce((acc, curr) => {
      return { ...acc, [curr]: this.#getSStorage(curr) };
    }, {});
  }

  #addSStorage(name, value = "", options = {}) {
    if (!name) return;
    let data = value;
    if (typeof data !== "string") data = JSON.stringify(data);
    window.sessionStorage.setItem(name, data);
  }

  #deleteSStorage(name) {
    if (!name) return;
    window.sessionStorage.removeItem(name);
  }

  #deleteAllSStorage() {
    window.localStorage.clear();
  }

  #getTTLDateString(minutes, isPrevious = false) {
    const now = new Date();
    const expireTime = isPrevious
      ? now.getTime() - 1000 * 60 * 60 * 24
      : now.getTime() + 1000 * 60 * minutes;
    now.setTime(expireTime);
    return now.toUTCString();
  }
}

export default Storage;
