/**
 * Refreshes the category tree.
 * 
 * A mask is added to the category pane as a signal to the user
 * that the tree is being updated.  When the update is finished,
 * the mask is removed.
 * 
 * @return unit
 */
function refreshCategories(){
	var cp = Ext.getCmp('categoryPane');
	var catMask = new Ext.LoadMask('categoryPane', {msg:"Loading categories...", removeMask: true});
	catMask.show();
	var root = cp.getRootNode();
	cp.getLoader().load(root, function(){catMask.hide();});
	root.expand();
}