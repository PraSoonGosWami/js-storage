import Storage from "./index.js";

const localStorage = new Storage(Storage.LOCAL_STORAGE);

console.log(localStorage.getAll());
