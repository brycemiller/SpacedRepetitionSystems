/**
 * Instantiates and displays loading mask for the
 * whole program.  Used with <i>lib/maskBottom.js</i>
 */
var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait...", removeMask: true});
mask.show();