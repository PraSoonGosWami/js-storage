import Storage from "./index.js";

const cookie = new Storage(Storage.COOKIE);
const localStorage = new Storage(Storage.LOCAL_STORAGE);
cookie.add("price", 100, { expires: 1 });
cookie.cookieSecured = true;
cookie.add("qty", 12);
cookie.cookieSecured = false;
cookie.add("ordered", 12);

console.log(cookie.getAll());
