var pdb = require('./src/pdb.js');
var c = pdb.Select('nodeTest');
c.Save('ana');
c.Export();
