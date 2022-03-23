import {
  getCookie,
  getAllCookies,
  addCookie,
  deleteCookie,
  deleteAllCookies,
} from "./cookie-storage.js";
import IndexedDB from "./indexed-db.js";
import {
  getLStorage,
  getAllLStorage,
  addLStorage,
  deleteLStorage,
  deleteAllLStorage,
} from "./local-storage.js";
import {
  getSStorage,
  getAllSStorage,
  addSStorage,
  deleteSStorage,
  deleteAllSStorage,
} from "./session-storage.js";

class Storage {
  constructor(type, dbConfig) {
    this.type = type;
    this.isSecured = false;
    if (dbConfig) this.idb = new IndexedDB(dbConfig);
  }
  static COOKIE = "cookie";
  static LOCAL_STORAGE = "localStorage";
  static SESSION_STORAGE = "sessionStorage";
  static INDEXED_DB = "indexedDb";
  static COOKIE_PRIORITY = { HIGH: "High", MEDIUM: "Medium", LOW: "Low" };

  set cookieSecured(bool) {
    this.isSecured = bool;
  }

  get(identifier, currentStore) {
    if (this.type === Storage.COOKIE) return getCookie(identifier);
    if (this.type === Storage.LOCAL_STORAGE) return getLStorage(identifier);
    if (this.type === Storage.SESSION_STORAGE) return getSStorage(identifier);
    if (this.type === Storage.INDEXED_DB)
      return this.idb.getByID(currentStore, identifier);
  }
  getAll(currentStore) {
    if (this.type === Storage.COOKIE) return getAllCookies();
    if (this.type === Storage.LOCAL_STORAGE) return getAllLStorage();
    if (this.type === Storage.SESSION_STORAGE) return getAllSStorage();
    if (this.type === Storage.INDEXED_DB) return this.idb.getAll(currentStore);
  }
  add(identifier, value, options) {
    this.type === Storage.COOKIE &&
      addCookie(identifier, value, options, this.isSecured);
    this.type === Storage.LOCAL_STORAGE &&
      addLStorage(identifier, value, options);
    this.type === Storage.SESSION_STORAGE &&
      addSStorage(identifier, value, options);
    if (this.type === Storage.INDEXED_DB)
      return this.idb.update(options.currentStore, value, identifier);
  }
  delete(identifier, currentStore) {
    this.type === Storage.COOKIE && deleteCookie(identifier);
    this.type === Storage.LOCAL_STORAGE && deleteLStorage(identifier);
    this.type === Storage.SESSION_STORAGE && deleteSStorage(identifier);
    if (this.type === Storage.INDEXED_DB)
      return this.idb.deleteByID(currentStore, identifier);
  }
  deleteAll(currentStore) {
    this.type === Storage.COOKIE && deleteAllCookies();
    this.type === Storage.LOCAL_STORAGE && deleteAllLStorage();
    this.type === Storage.SESSION_STORAGE && deleteAllSStorage();
    if (this.type === Storage.INDEXED_DB)
      return this.idb.deleteAll(currentStore);
  }
}

export default Storage;
