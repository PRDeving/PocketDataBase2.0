(function(context, constructor) {

  if ( typeof module === "object" && typeof module.exports === "object" ) {
    module.exports = !context.document ?
    new constructor(context) :
    function(){
      return new constructor(context);
    };
  } else {
    context.PDB = new constructor(context);
  }


})(typeof window !== "undefined" ? window : this, function(context) {
  var config = {
    version: '2.0.1',
    debug: true,
    eventTarget: (context.document)? context.document.getElementsByTagName('body')[0]: false,
  };

  _collections = [];
  _cindex = {};


  // PDB METHODS
  var _selectCollection = function(c){
      if(!c) return _throwError(0x100001);
      return (!_cindex[c])? _createCollection(c): _collections[_cindex[c]];
  }



  // PDB UTILS
  var _createCollection = function(c){
    try {
      _collections.push(new _linkedList(c));
      _cindex[c] = _collections.length - 1;

      console.log('PDB: Collection '+c+' created');
      return _collections[_cindex[c]];
    } catch(e) {
      return _throwError(0x100002, e);
    }
  }

  var _throwError = function(e, args){
    var _errors = {
      0x100001: 'Collection name not provided',
      0x100002: 'Collection cant be created',
    }

    console.error('PDBError ' + e + ':', _errors[e], (args)? args: "");
    return false;
  }

  // PDB PUBLIC INTERFACE
  this.version = config.version;
  this.collection = _selectCollection;


  var _linkedList = function(colection){
    var lnode = false;
    var colection;

    var _push = function(data){
      lnode = new _node(data,lnode);
    }

    var _node = function(data,next){
      var _update = function(data){
        var d = (typeof data == "object")? JSON.stringify(data) : false;
        // this.id = _getEntryToken(d);
        this.data = data;
        this.raw = d
      }

      var d = (typeof data == "object")? JSON.stringify(data) : false;

      // this.id = _getEntryToken(d) || "";
      this.data = data || "";
      this.raw = d;
      this.next = next || false;
      this.update = _update;
    }

    var _findByIterator = function(it){
      var cn = lnode;
      var n = 0;
      while(cn){
        if(n == it) return cn;
        cn = cn.next;
        n++;
      }
    }

    var _searchWhere = function(filter){
      var cn = lnode;
      var f = [];
      while(cn){
        if(typeof cn.data !== "object") break;

        var match = (function(){
          for(var fil in filter){
            if(!cn.data[fil]) return false;
            if(filter[fil] !== cn.data[fil]) return false;
          };
          return true;
        })();

        if(match) f.push(cn);
        cn = cn.next;
      }
      return f;
    }

    var _searchFirstWhere = function(filter){
      var cn = lnode;
      while(cn){
        if(typeof cn.data !== "object") break;

        var match = (function(){
          for(var fil in filter){
            if(!cn.data[fil]) return false;
            if(filter[fil] !== cn.data[fil]) return false;
          };
          return true;
        })();

        if(match) return cn;
        cn = cn.next;
      }
      return f;
    }

    var _search = function(d){
      if(typeof d == "number") return _findByIterator(d);
      if(typeof d == "object") return _findWhere(d);

      var cn = lnode;
      var f = [];

      while(cn){
        var data = (!cn.raw)? cn.data : cn.raw;
        if(data.indexOf(d) >= 0){
          f.push(cn);
        }
        cn = cn.next;
      }
      return f;
    }

    var _searchFirst = function(d){
      if(typeof d == "number") return _findByIterator(d);
      if(typeof d == "object") return _findFirstWhere(d);

      var cn = lnode;
      while(cn){
        var data = (!cn.raw)? cn.data : cn.raw;

        // if(new RegExp(d).test(cn.data)){
        if(data.indexOf(d) >= 0){
          return cn;
        }
        cn = cn.next;
      }
    }

    var _findById = function(id){
      var cn = lnode;
      var f = [];
      while(cn){
        if(cn.id == id) f.push(cn);
        cn = cn.next;
      }
      return f;
    }

    var _export = function(toFile){
      var cd = [];
      var cn = lnode;
      var init = Date.now();
      console.log("PDB: Exporting, be patient, this could last several seconds...");
      while(cn){
        cd.push((!cn.raw)?cn.data:cn.raw);
        cn = cn.next;
      }

      try {
        localStorage.setItem("PDBDB_"+colection,TT.compress(cd.join("|")));
      } catch(e){
        _raiseError("EXPORT_FAILURE",e);
        return false;
      }
      console.log("PDB: Database exported to LocalStorage successfully in",
                  (Date.now()-init)/1000,"seconds");
    }

    var _import = function(c){
      var init = Date.now();
      console.log("PDB: Importing, be patient, this could last several seconds...");

      var rawdata = localStorage.getItem("PDBDB_"+c);
      if(!rawdata) return false;

      var cd = TT.decompress(rawdata).split("|");
      for(var e in cd) _push((cd[e][0] != "{" && cd[e][0] != "[")?cd[e] : JSON.parse(cd[e]));
      console.log("PDB: Database imported from LocalStorage successfully in",
                  (Date.now()-init)/1000,"seconds");
    }

    this.Save = _push;
    this.Search = _search;
    this.SearchFirst = _searchFirst;
    this.SearchFirstWhere = _searchFirstWhere;
    this.SearchWhere = _searchWhere;
    this.FindByIterator = _findByIterator;
    this.Export = _export;
    this.Import = _import;
    this.__defineGetter__("data",function(){return {lastIn: lnode}; });
    this.__defineGetter__("length",function(){var c = 0; var cn = lnode; while(cn){c++;cn = cn.next};return c});
  }

  


});
