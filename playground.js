import Storage from "./index.js";

const IDB_CONFIG = {
  databaseName: "ixora-db",
  version: 1,
  stores: [{ name: "customers" }],
};
const idb = new Storage(Storage.INDEXED_DB, IDB_CONFIG);

idb.add(
  "pg001",
  { name: "Prasoon Goswammi", email: "pgoswami@gmail.com" },
  { currentStore: "customers" }
);
