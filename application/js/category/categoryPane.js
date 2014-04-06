/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * A tree of folders with each folder representing a category
 * 
 * Sections of this category pane code are based on previous work by
 * the ExtJS team
 */
var categoryPane = new Ext.tree.TreePanel({
	id: 'categoryPane',
    autoScroll: true,
    animate: true,
    enableDD: false,
    containerScroll: true,
    border: true,
    width: 200,
    height: 450,

    // Populate this tree with an ajax call to category/categoryPane.php    
    dataUrl: 'php/category/categoryPane.php',

    // Make a root node
    root: {
        nodeType: 'async',
        text: 'All',
        draggable: false,
        id: '0'
    },
    rootVisible: false,
	
	contextMenu: categoryMenu,
	
	listeners: {
        contextmenu: function(node, e) {
			node.select();
            var c = node.getOwnerTree().contextMenu;
            c.contextNode = node;
            c.showAt(e.getXY());
        }
    }
});

// When a node on the tree is selected, reload the card datastore
// with the card from the newly selected categories
categoryPane.on('click', function(node, e){
	cardGrid.store.load({
		params: {'category_id': node.id}
	});
});

// Display the category tree
categoryPane.render('leftColumn');

// Make and display a mask while the category tree loads
var catMask = new Ext.LoadMask('categoryPane', {msg:"Loading categories...", removeMask: true});
catMask.show();
categoryPane.getRootNode().expand(false, true, function(){catMask.hide();});

/**
 * Convenience method for accessing the currently selected
 * node on the category tree
 * 
 * @return Ext.Tree.Node	the current selected node
 */
function getSelectedCategory(){
	return categoryPane.getSelectionModel().getSelectedNode();
}