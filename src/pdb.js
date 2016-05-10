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
    debug: false,
    hotSync: false,
    // eventTarget: (context.document)? context.document.getElementsByTagName('body')[0]: false,
  };
  var TT = new TinyText();

  try {
    var exportInterface = (typeof context.localStorage == 'object') ? function(n,v){context.localStorage.setItem(n,v)} : 
      ((typeof context.document == 'object' && typeof context.document.cookie == 'object') ? _setCookie : _setFS);

    var importInterface = (typeof context.localStorage == 'object') ? function(n){return context.localStorage.getItem(n)} : 
      ((typeof context.document == 'object' && typeof context.document.cookie == 'object') ? _getCookie : _getFS);
  } catch(e) {
    return _throwError(0x300003, e);
  }

  console.log(exportInterface);

  var _collections = {};


  // PDB METHODS
  var _selectCollection = function(c){
      if(!c) return _throwError(0x100001);
      return (!_collections[c])? _createCollection(c): _collections[c];
  }

  // PDB UTILS
  var _createCollection = function(c){
    try {
      _collections[c] = new _linkedList(c);

      console.log('PDB: Collection '+c+' created');
      return _collections[c];
    } catch(e) {
      return _throwError(0x100002, e);
    }
  }

  var _throwError = function(e, args){
    var _errors = {
      // PDB ERRORS
      0x100001: 'Collection name not provided',
      0x100002: 'Collection cant be created',

      // NODE ERRORS
      0x200001: 'No data provided',
      0x200002: 'No entries matches the filter',

      // IMPORT/EXPORT ERRORS
      0x300001: 'Data cant be written',
      0x300002: 'Data cant be read',
      0x300003: 'Import/Export interface cant be setted up',
      0x300004: 'File cant be written',
      0x300005: 'File cant be read',
      0x300006: 'Cookie not setted',
      0x300007: 'Theres no data to import',

      // CONFIGURE INTERFACE
      0x400001: 'Argument provided is not a Boolean',
    }

    console.error('PDBError ' + e + ':', _errors[e], (args)? args: "");
    return false;
  }

  function _setCookie(name, data) {
    var d = new Date();
    d.setTime(d.getTime() + (100*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    context.document.cookie = name + "=" + data + "; " + expires;
  }

  function _getCookie(name) {
    var name = name + "=";
    var ca = context.document.cookie.split(';');

    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length,c.length);
      }
    }

    return _throwError(0x300006);
  }

  function _setFS(name, data) {
    // if(context.require == 'object') {
      var fs = require('fs');
      if(!fs.exists("./data")) fs.mkdir("./data");
      fs.writeFile("./data/" + name, data, function(e) {
        if(e) return _throwError(0x300004, e);
      });
    // } else _throwError(0x300003);
  }

  function _getFS(name) {
    // if(context.require == 'object') {
      var fs = require('fs')
      fs.readFile('./data/' + name, 'utf8', function (e, data) {
        if (e) return _throwError(0x300005, e);
        return data;
      });
    // } else _throwError(0x300003);
  }


  var _linkedList = function(collection){
    var lnode = false;
    var collection;

    var _push = function(data){
      lnode = new _node(data,lnode);
      return lnode;
    }

    var _node = function(data,next){
      if (data.length < 1) return _throwError(0x200001);
      var d = (typeof data == "object")? JSON.stringify(data) : false;

      if(config.hotSync) _export(collection);

      var _update = function(data){
        if (data.length < 1) return _throwError(0x200001);
        var d = (typeof data == "object")? JSON.stringify(data) : false;

        if(config.hotSync) _export(collection);

        // this.id = _getEntryToken(d);
        this.data = data;
        this.raw = d
      }

      // this.id = _getEntryToken(d) || "";
      this.data = data || "";
      this.raw = d;
      this.next = next || false;
      this.update = _update;
    }

    var _findByIterator = function(it){
      if (it.length < 1) return _throwError(0x200001);
      var cn = lnode;
      var n = 0;
      while(cn){
        if(n == it) return cn;
        cn = cn.next;
        n++;
      }
    }

    var _searchWhere = function(filter){
      if (filter.length < 1) return _throwError(0x200001);
      var cn = lnode;
      var f = [];
      while(cn){
        if(typeof cn.data !== "object") {
          cn = cn.next;
          continue;
        }

        var match = true;
        for(var fil in filter)
          if (!cn.data[fil] || filter[fil] !== cn.data[fil])
            match = false;

        if(match) f.push(cn);
        cn = cn.next;
      }
      return (f.length > 0)? f: _throwError(0x200002);
    }

    var _searchFirstWhere = function(filter){
      if (filter.length < 1) return _throwError(0x200001);
      var cn = lnode;
      while(cn){
        if(typeof cn.data !== "object") break;

        for(var fil in filter)
          if(!cn.data[fil] || filter[fil] !== cn.data[fil]) {
            cn = cn.next;
            continue;
          } else {
            return cn;
          }
      }
      return _throwError(0x200002);
    }

    var _search = function(d){
      if (d.length < 1) return _throwError(0x200001);
      if(typeof d == "number") return _findByIterator(d);
      if(typeof d == "object") return _findWhere(d);

      var cn = lnode;
      var f = [];

      while(cn){
        var data = (!cn.raw)? cn.data : cn.raw;
        if(data.indexOf(d) >= 0) f.push(cn);
        cn = cn.next;
      }
      return (f.length > 0)? f: _throwError(0x200002);
    }

    var _searchFirst = function(d){
      if (d.length < 1) return _throwError(0x200001);
      if(typeof d == "number") return _findByIterator(d);
      if(typeof d == "object") return _findFirstWhere(d);

      var cn = lnode;
      while(cn){
        var data = (!cn.raw)? cn.data : cn.raw;
        if(data.indexOf(d) >= 0) return cn;
        cn = cn.next;
      }
    }

    // var _findById = function(id){
    //   var cn = lnode;
    //   var f = [];
    //   while(cn){
    //     if(cn.id == id) f.push(cn);
    //     cn = cn.next;
    //   }
    //   return f;
    // }

    var _export = function(toFile){
      var cd = [];
      var cn = lnode;

      var init = Date.now();
      if(config.debug)
        console.log("PDB: Exporting, be patient, this could take several seconds...");
      
      while(cn) {
        cd.push((!cn.raw) ? JSON.stringify(cn.data) : cn.raw);
        cn = cn.next;
      }

      try {
        exportInterface("PDBDB_" + collection, TT.compress(cd.join("|")));
      } catch(e) {
        return _throwError(0x300001, e);
      }

      if(config.debug)
        console.log("PDB: Database exported to LocalStorage successfully in",
                  (Date.now()-init)/1000,"seconds");
    }

    var _import = function(c){
      if(!c) c = collection;
      var init = Date.now();
      if(config.debug)
        console.log("PDB: Importing, be patient, this could take several seconds...");

      try {
        var rawdata = importInterface("PDBDB_" + c);
      } catch (e) {
        return _throwError(0x300002, e);
      }
      if(typeof rawdata != "string" && typeof rawdata != "number") return _throwError(0x300007);

      var cd = TT.decompress(rawdata).split("|");

      for(var e in cd)
        _push((cd[e][0] != "{" && cd[e][0] != "[") ? cd[e] : JSON.parse(cd[e]));

      if(config.debug)
        console.log("PDB: Database imported from LocalStorage successfully in",
                  (Date.now()-init)/1000,"seconds");
      return true;
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


  // PDB PUBLIC INTERFACE
  this.Select = _selectCollection;

  this.debug = function(b){
    if(typeof b !== 'boolean') return _throwError(0x400001);
    config.debug = b
  };
  this.hotSync = function(b){
    if(typeof b !== 'boolean') return _throwError(0x400001);
    config.hotSync = b
  };

  this.__defineGetter__("collections", function(){return _collections});
  this.__defineGetter__("version", function(){return config.version});

// TINNY TEXT IS SOOO FCKING LONG LINE, VIM EXPLODES SO HAD TO send it to the bottom





















  // TT COMPRESS
  function TinyText(){var o=String.fromCharCode,r={implode:function(o){for(var t=r.compress(o),e=new Uint8Array(2*t.length),n=0,i=t.length;i>n;n++){var s=t.charCodeAt(n);e[2*n]=s>>>8,e[2*n+1]=s%256}return e},explode:function(t){if(null===t||void 0===t)return r.decompress(t);for(var e=new Array(t.length/2),n=0,i=e.length;i>n;n++)e[n]=256*t[2*n]+t[2*n+1];var s=[];return e.forEach(function(r){s.push(o(r))}),r.decompress(s.join(""))},compress:function(t){return r._compress(t,16,function(r){return o(r)})},_compress:function(o,r,t){if(null==o)return"";var e,n,i,s={},p={},a="",h="",c="",f=2,l=3,u=2,d=[],v=0,w=0;for(i=0;i<o.length;i+=1)if(a=o.charAt(i),Object.prototype.hasOwnProperty.call(s,a)||(s[a]=l++,p[a]=!0),h=c+a,Object.prototype.hasOwnProperty.call(s,h))c=h;else{if(Object.prototype.hasOwnProperty.call(p,c)){if(c.charCodeAt(0)<256){for(e=0;u>e;e++)v<<=1,w==r-1?(w=0,d.push(t(v)),v=0):w++;for(n=c.charCodeAt(0),e=0;8>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1}else{for(n=1,e=0;u>e;e++)v=v<<1|n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n=0;for(n=c.charCodeAt(0),e=0;16>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1}f--,0==f&&(f=Math.pow(2,u),u++),delete p[c]}else for(n=s[c],e=0;u>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1;f--,0==f&&(f=Math.pow(2,u),u++),s[h]=l++,c=String(a)}if(""!==c){if(Object.prototype.hasOwnProperty.call(p,c)){if(c.charCodeAt(0)<256){for(e=0;u>e;e++)v<<=1,w==r-1?(w=0,d.push(t(v)),v=0):w++;for(n=c.charCodeAt(0),e=0;8>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1}else{for(n=1,e=0;u>e;e++)v=v<<1|n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n=0;for(n=c.charCodeAt(0),e=0;16>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1}f--,0==f&&(f=Math.pow(2,u),u++),delete p[c]}else for(n=s[c],e=0;u>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1;f--,0==f&&(f=Math.pow(2,u),u++)}for(n=2,e=0;u>e;e++)v=v<<1|1&n,w==r-1?(w=0,d.push(t(v)),v=0):w++,n>>=1;for(;;){if(v<<=1,w==r-1){d.push(t(v));break}w++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:r._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(r,t,e){var n,i,s,p,a,h,c,f,l=[],u=4,d=4,v=3,w="",A=[],m={val:e(0),position:t,index:1};for(i=0;3>i;i+=1)l[i]=i;for(p=0,h=Math.pow(2,2),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;switch(n=p){case 0:for(p=0,h=Math.pow(2,8),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;f=o(p);break;case 1:for(p=0,h=Math.pow(2,16),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;f=o(p);break;case 2:return""}for(l[3]=f,s=f,A.push(f);;){if(m.index>r)return"";for(p=0,h=Math.pow(2,v),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;switch(f=p){case 0:for(p=0,h=Math.pow(2,8),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;l[d++]=o(p),f=d-1,u--;break;case 1:for(p=0,h=Math.pow(2,16),c=1;c!=h;)a=m.val&m.position,m.position>>=1,0==m.position&&(m.position=t,m.val=e(m.index++)),p|=(a>0?1:0)*c,c<<=1;l[d++]=o(p),f=d-1,u--;break;case 2:return A.join("")}if(0==u&&(u=Math.pow(2,v),v++),l[f])w=l[f];else{if(f!==d)return null;w=s+s.charAt(0)}A.push(w),l[d++]=s+w.charAt(0),u--,s=w,0==u&&(u=Math.pow(2,v),v++)}}};return r};
});
