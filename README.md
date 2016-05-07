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

# ISSUES
[0001] Import doesnt work in node
