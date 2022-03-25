class IndexedDB {
  constructor(config) {
    this.config = config;
    this.#connectDB();
  }
  getByID(currentStore, id) {
    return new Promise((resolve, reject) => {
      this.#connectDB(this.config)
        .then((db) => {
          let tx = this.#createTransaction(
            db,
            "readonly",
            currentStore,
            resolve,
            reject
          );
          let objectStore = tx.objectStore(currentStore);
          let request = objectStore.get(id);
          request.onsuccess = (e) => {
            resolve(e.target.result);
          };
        })
        .catch(reject);
    });
  }
  getOneByIndex(currentStore, keyPath, value) {
    return new Promise((resolve, reject) => {
      this.#connectDB(this.config)
        .then((db) => {
          let tx = this.#createTransaction(
            db,
            "readonly",
            currentStore,
            resolve,
            reject
          );
          let objectStore = tx.objectStore(currentStore);
          let index = objectStore.index(keyPath);
          let request = index.get(value);
          request.onsuccess = (e) => {
            resolve(e.target.result);
          };
        })
        .catch(reject);
    });
  }
  getManyByIndex(currentStore, keyPath, value) {
    return new Promise((resolve, reject) => {
      this.#connectDB(config)
        .then((db) => {
          let tx = this.#createTransaction(
            db,
            "readonly",
            currentStore,
            resolve,
            reject
          );
          let objectStore = tx.objectStore(currentStore);
          let index = objectStore.index(keyPath);
          let request = index.getAll(value);
          request.onsuccess = (e) => {
            resolve(e.target.result);
          };
        })
        .catch(reject);
    });
  }
  getAll(currentStore) {
    return new Promise((resolve, reject) => {
      this.#connectDB(this.config)
        .then((db) => {
          let tx = this.#createTransaction(
            db,
            "readonly",
            currentStore,
            resolve,
            reject
          );
          let objectStore = tx.objectStore(currentStore);
          let request = objectStore.getAll();
          request.onsuccess = (e) => {
            resolve(e.target.result);
          };
        })
        .catch(reject);
    });
  }
  add(currentStore, value, key) {
    return new Promise((resolve, reject) => {
      this.#connectDB(this.config)
        .then((db) => {
          let tx = this.#createTransaction(
            db,
            "readwrite",
            currentStore,
            resolve,
            reject
          );
          let objectStore = tx.objectStore(currentStore);
          let request = objectStore.add(value, key ? key : undefined);
          request.onsuccess = (e) => {
            tx?.commit?.();
            resolve(e.target.result);
          };
        })
        .catch(reject);
    });
  }
  update(currentStore, value, key) {
    return new Promise((resolve, reject) => {
      this.#connectDB(this.config)
        .then((db) => {
          let tx = this.#createTransaction(
            db,
            "readwrite",
            currentStore,
            resolve,
            reject
          );
          let objectStore = tx.objectStore(currentStore);
          let request = objectStore.put(value, key ? key : undefined);
          request.onsuccess = (e) => {
            tx?.commit?.();
            resolve(e.target.result);
          };
        })
        .catch(reject);
    });
  }
  deleteByID(currentStore, id) {
    return new Promise((resolve, reject) => {
      this.#connectDB(this.config)
        .then((db) => {
          let tx = this.#createTransaction(
            db,
            "readwrite",
            currentStore,
            resolve,
            reject
          );
          let objectStore = tx.objectStore(currentStore);
          let request = objectStore.delete(id);
          request.onsuccess = (e) => {
            tx?.commit?.();
            resolve(e.target);
          };
        })
        .catch(reject);
    });
  }
  deleteAll(currentStore) {
    return new Promise((resolve, reject) => {
      this.#connectDB(this.config)
        .then((db) => {
          let tx = this.#createTransaction(
            db,
            "readwrite",
            currentStore,
            resolve,
            reject
          );
          let objectStore = tx.objectStore(currentStore);
          objectStore.clear();
          tx.oncomplete = (e) => {
            resolve(e.target);
          };
          tx?.commit?.();
        })
        .catch(reject);
    });
  }
  openCursor(currentStore, callback, keyRange) {
    return new Promise((resolve, reject) => {
      this.#connectDB(this.config)
        .then((db) => {
          let tx = this.#createTransaction(
            db,
            "readonly",
            currentStore,
            resolve,
            reject
          );
          let objectStore = tx.objectStore(currentStore);
          let request = objectStore.openCursor(keyRange);
          request.onsuccess = (e) => {
            callback(e);
            resolve();
          };
        })
        .catch(reject);
    });
  }
  #connectDB() {
    return new Promise((resolve, reject) => {
      const idbInstance = window ? window.indexedDB : null;
      if (idbInstance) {
        const request = idbInstance.open(
          this.config.databaseName,
          this.config.version
        );
        request.onsuccess = (e) => {
          resolve(e.target.result);
        };
        request.onerror = (e) => {
          reject(e.target.error);
        };
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          this.config.stores.forEach((s) => {
            if (!db.objectStoreNames.contains(s.name)) {
              const store = db.createObjectStore(s.name, s.id);
              s.indices?.forEach((index) => {
                store.createIndex(index.name, index.keyPath, index.options);
              });
            }
          });
          db.close();
          resolve(undefined);
        };
      } else {
        reject("Indexed DB not supported on your browser");
      }
    });
  }
  #createTransaction(db, dbMode, currentStore, resolve, reject, abort) {
    if (!db) reject("DB connection not open");
    if (!db.objectStoreNames.contains(currentStore))
      reject(`Store ${currentStore} not found`);
    const tx = db.transaction(currentStore, dbMode);
    tx.onerror = (e) => {
      reject(e.target.error);
    };
    tx.oncomplete = resolve;
    tx.onabort = abort;
    return tx;
  }
}

export default IndexedDB;

// const IDB_CONFIG = {
//   databaseName: "ixora-db",
//   version: 1,
//   stores: [
//     {
//       name: "customers",
//       id: { keyPath: "id", autoIncrement: true },
//       indices: [
//         { name: "name", keyPath: "name", options: { unique: false } },
//         { name: "email", keyPath: "email", options: { unique: true } },
//       ],
//     },
//   ],
// };
