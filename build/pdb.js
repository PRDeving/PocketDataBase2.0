(function(context, factory) {
  
  if (context.document) context.document.PDB = factory();
  else if (context.exports) context.exports = new factory();

})(window ? window : this, function() {
  this.name = "PDB";

  return this;
});
