# PocketDataBase2.0
AWESOME AND STUNNING NoSQL PocketDataBase, VERSION

## Why PDB?
PocketDataBase is a fast and easy to use standalone database designed to work as a intermediate between services
and platform/application.

PocketDataBase is a NoSQL DataBase that runs near-enterely in RAM, so it's fast and storage-wise, of course, this
has it's own drawbacks, PDB has no prediction or cache implemented yet and changes could be lost if hotSync is not
enabled.

### When to use it?
* web applications
* web/platform games
* websites
* as bridge between services and platform

### When to avoid it?
* Large data like webstores


## What's new in PDB2.0
* PDB v2 has been isolated from window and now runs in different enviroments.
* has been architecturized to work both in clientside (browser) and serverside (nodeJS).
* PDB2.0 has a reviewed and refactored code that runs faster and does a better memory use.
* it has a Error handling system that allows it to work failureless and to debug your code.
* it has a better crossBrowser support than his predecessor.

## How to install
just clone and use, you can use the ./src/pdb.js file or generate a compilated one using `gulp build`

#### Web use
index.html
```html
    <script src="pdb.js"></script>
    <script src="main.js"></script>
```
main.js
```javascript
    // PDB will be inserted as window object, to check use:
    PDB.version;
```

#### Node use
index.js
```javascript
    var pdb = require('./pdb.js');
    pdb.version;
```

# How does it work?
PDB works with collections, collections are similar to SQL tables, it is the container of the data entries.
If you want to store cars there would be a collection named 'cars' and entries with data:
````json
  {
    name: "honda",
    model: "civic",
    age: 2012
  }
```
you can have as many collections as you please and as many entries as you want, but, PDB stores the info in RAM so be sure you dont store large amounts
of ridicously large data.

#USE
```javascript
  // select the collection you want to use if exists, if not it will be created
  // Select(...) returns a reference so you can select as many collections as you want and work on them simultaneosuly
  var cars = PDB.Select('cars');
  var owners = PDB.Select('owners');

  var newowner = {
    name: 'John',
    phone: 83871378381,
  }

  var newcar = {
    name: 'honda',
    model: 'civic',
    year: 2012,
    // .Save(...) returns a reference to the node so you can use it ike this
    owner: owners.Save(newowner),
  }

  cars.Save(newcar);

  // now the collections 'cars' and 'owners' has new entries

  // searches returns nodes, so you can modify or work with them
  var node = cars.SearchWhere({name: 'honda'});
  node.update({year: 2010}); 
  // now the year of that car is 2010 instead 2012

  // you can retrieve data from a node gettin his data
  var data = node.data;
  console.log(data);

  // as we have a nested node as 'owner' we could access it doing...
  var owner = node.owner;
  // so we can work on it
  owner.update({phone: 318548514851});
  //or read his data
  var ownerdata = owner.data;
  console.log(ownerdata);
```


# METHODS AND GETTERS

## PDB
### .Select(String)
  selects a collection if it exists, if not it will be created. Select gets ONE argument that has to be a *String*,
  this argument will be the collection name.

  .Select returns a reference to the collection (linkedList);

### .debug(Boolean -default: false-)
  if setted to true debug log will be showed in console

### .hotSync(Boolean -default: false-)
  if setted to true every change on the database will be streamed to the exportInterface to make it persistent in the
    system, this allows you to build apps with persistent data as you would with other database systems.
  data will still being read from RAM but all the updates will be written in local.

### -GETTER- .collections
  returns all the collections, for debug pruporses.

### -GETTER- .version
  returns the PDB version.


## Collections
### .Save(String || Integer || Float || Long || Double || Boolean || Object || Array)
  creates a new entrie in the said collection with the data provided.
  Gets ONE argument treated as data.

### .Search(String || Integer || Object);
  If an integer is provided as argument .FindByIterator(...) will be fired, read it instead.
  If an Object is provided as argument .SearchWhere(...) will be triggered, read instead.

  If an String is provided, it will find literal matches and return all of them.
  ```javascript
  var collection = PDB.Select('test');
  // you can find every node that contains John
  var find = collection.Search('John');
  // you can even find every node thats a object by looking for json structures like
  var find = collection.Search('{');
  ```

### .SearchFirst(String || Integer || Object)
  If an integer is provided as argument .FindByIterator(...) will be fired, read it instead.
  If an Object is provided as argument .SearchFirstWhere(...) will be triggered, read instead.

  does the same as .Search(...) but returns only the first node found that matches.

### .SearchWhere(Object)
  returns all nodes that matches the filter, filter has to be provided as argument with an object
  ```javascript
    var find = collection.SearchWhere({age: 1980});
    var find = collection.SearchWhere({lastname: 'Doe', age: 1980});
  ```

### .SearchFirstWhere(Object)
  does the same as .SearchWhere(...) but returns only the first node found that matches the filter.

### .FindByIterator(Integer)
  returns the Nth node

### .Export(String -optional-)
  encripts and stores the data in local support, read more in LOCAL SUPPORT AND STORING

### .Import(String -optional-)
  retrieves data from local support, decrypts it and imports it in the said collection.
  if no argument is provided, the system will try to import the collection named like the active collection,
    if argument is provided the system will try to import said collection
      ```javascript
        var col = PDB.Select('test');

        col.Import(); // will import 'test' collection here
        col.Import('cars'); // will import 'cars' collection here
      ```
### -GETTER- .data
  returs the collection data. Debug and development prouporses.

### -GETTER- .length
  returns the number of nodes in the collection

## Nodes
### .update(String || Integer || Float || Long || Double || Boolean || Object || Array)
  updates the node with the provided data.
  If Object is passed as argument, just said entries will be overwritten.

### -GETTER- .data
  returns the node data

### -GETTER- .raw
  returns the node data stringified if its an object and returns false if fata is a primitive

## -GETTER- .next
  returns the next node in the collection, debug and internal prouporses

# LOCAL SUPPORT AND STORING
the persistent storing is done using different technics depending on the platform, in node enviroments fs will be
used, in browser will be used localStorage or cookies depending on the avaiability.

To store data PDB uses a text 'tinnifier' that stringifies all the data and transforms it to ofusced characters to save space and
transference time.
Data can only be read by using PDB Import(...).

Collections will be stored with the 'PDBDB_' prefix, so it can be easily identificable.

in node enviroments a 'data/' folder will be created automaticly to store the collections.

# PENDING ISSUES

# CLOSED ISSUES
[0001][FIX PRDeving v2.0.2][4038313139b1851b12730b7d416e3394570d9d48] Import doesnt work in node
