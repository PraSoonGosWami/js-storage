# Storage

Storage is a simple light weight utility class for handling all types of browser based storage using a single instance.

- Cookies
- Local Storage
- Session Storage
- Indexed DB

## Features

- Use single class instance to manage all types of storage in browser
- Comes with easy and handy methods to manipulate your data in the most effcient way
- Reduces effort and improves code redablity and development experience

<br/>

## Getting Started

In order to use Storage simply import the Storage class from the package and create a new instance

```js
import Storage from "storage"

//definition
new Storage(<storage-type>, <storage-config>);

//cookie
const cookie = new Storage(Storage.COOKIE);
//local storage
const localStorage = new Storage(Storage.LOCAL_STORAGE)
//session storage
const sessionStorage = new Storage(Storage.SESSION_STORAGE)
//indexed db
const idb = new Storage(Storage.INDEXED_DB, IDB_CONFIG)

```

<br/>

### Methods

| Functions | Arguments                  | Description                                    |
| --------- | -------------------------- | ---------------------------------------------- |
| get       | identifier, options        | returns found data based on identifier         |
| getAll    | options                    | returns all the data                           |
| add       | identifier, value, options | add data to the chosen storage type            |
| delete    | identifier, options        | deletes data based on identifier               |
| deleteAll | options                    | deletes all the data for a chosen storage type |

> Note
> `identifier` is required for all types of storage except given that storage type in `INDEXED_DB` and `id` is configured in `IDB_CONFIG`

<br/>

### Static Properties and setters

| Properties              | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| Storage.COOKIE          | used to set the storage type to Cookie                    |
| Storage.LOCAL_STORAGE   | used to set the storage type to Local Storage             |
| Storage.SESSION_STORAGE | used to set the storage type to Session Storage           |
| Storage.INDEXED_DB      | used to set the storage type to Indedex Db                |
| Storage.COOKIE_PRIORITY | used to set the priority of the cookie. High, Medium, Low |
| cookieSecured           | (boolean) used to set the cookies secure propety          |

<br/>

## Basic Usage

<br/>

### Cookies

#### Adding a cookie

```js
const cookie = new Storage(Storage.COOKIE);

//cookieOptions - optional
const cookieOptions = {
  expires: 10, //(in minutes) default - Session
  priority: Storage.COOKIE_PRIORITY.HIGH, // default - Storage.COOKIE_PRIORITY.MEDIUM
  path: "/", // default - "/"
  domain: "yourdomain.com", //default - undefined
};
// setting cookies secured
cookie.cookieSecured = true;

cookie.add("cookie_id", "cookie_value", cookieOptions);
```

#### Retrieving single cookie

```js
cookie.get("cookie_id"); // => value
```

The cookie with the id `cookie_id` will only be available on .get() if it's visible from where the code is called; the domain and/or path attribute will not have any effect when reading.

#### Retrieving all cookies

```js
cookie.getAll(); // => Object {id1 : value1, id2 : value2 ...}
```

#### Deleting single cookie

```js
const cookieOptions = {
  path: "/path", // default - "/"
  domain: "yourdomain.com", //default - undefined
};
cookie.delete("cookie_id", cookieOptions);
```

#### Deleting all cookies

```js
const cookieOptions = {
  path: "/path", // default - "/"
  domain: "yourdomain.com", //default - undefined
};
cookie.deleteAll(cookieOptions);
```

<br/> <br/>

### Local Storage

#### Adding data

```js
const localStorage = new Storage(Storage.LOCAL_STORAGE);
//storageOptions - optional
const storageOptions = {
  expires: 10, //(in minutes) default - null
};
localStorage.add("id", data, storageOptions);
```

#### Retrieving single data

```js
localStorage.get("id"); // => data
```

#### Retrieving all data

```js
localStorage.getAll(); // => Object {id1 : data1, id2 : data2 ...}
```

#### Deleting single data

```js
localStorage.delete("id");
```

#### Deleting all data

```js
localStorage.deleteAll();
```

<br/> <br/>

### Session Storage

#### Adding data

```js
const sessionStorage = new Storage(Storage.SESSION_STORAGE);
sessionStorage.add("id", data);
```

#### Retrieving single data

```js
sessionStorage.get("id"); // => data
```

#### Retrieving all data

```js
sessionStorage.getAll(); // => Object {id1 : data1, id2 : data2 ...}
```

#### Deleting single data

```js
sessionStorage.delete("id");
```

#### Deleting all data

```js
sessionStorage.deleteAll();
```

<br/> <br/>

### Indexed DB

#### Adding data

##### With `identifier` set to null as id is configured to autoIncrement in IDB_CONFIG

```js
const IDB_CONFIG = {
  databaseName: "ixora-db",
  version: 1,
  stores: [
    {
      name: "customers",
      id: { keyPath: "id", autoIncrement: true },
      indices: [
        { name: "name", keyPath: "name", options: { unique: false } },
        { name: "email", keyPath: "email", options: { unique: true } },
      ],
    },
  ],
};
const idb = new Storage(Storage.INDEXED_DB, IDB_CONFIG);
idb.add(null, data, { currentStore: "customers" });
```

##### With `identifier` as id is NOT configured in IDB_CONFIG

```js
const  IDB_CONFIG = {
	databaseName:  "ixora-db",
	version:  1,
	stores: [{name:  "customers"}]
};
const  idb = new  Storage(Storage.INDEXED_DB,IDB_CONFIG);
idb.add(id, data, {currentStore : "customers"}) => returns JS Promise

```

#### Retrieving single data

```js
//returns JS Promise
idb.get("id",{currentStore : "customers"}).then(value => ...).catch(err => ...)
```

#### Retrieving all data

```js
//returns JS Promise
sessionStorage.getAll({currentStore : "customers"}).then(values => ...).catch(err => ...)
```

#### Deleting single data

```js
sessionStorage.delete("id", {currentStore : "customers"}) => returns JS Promise
```

#### Deleting all data

```js
sessionStorage.deleteAll({currentStore : "customers"}) => returns JS Promise
```
