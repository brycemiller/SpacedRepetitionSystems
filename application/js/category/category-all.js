function bulkUpload(){
	var ncf = new Ext.FormPanel({
		id: 'buf',
		fileUpload: true,
		labelWidth: 100,
	    frame: true,
	    title: 'Bulk Upload',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [fileUpload('File', 'file'), comboBox('Parent Category', 'parent_id')],
		buttons: [actionButton('Upload', 'silk-folder-go', 
				'php/category/bulkUpload.php', 'Uploading', 'buf', refreshCategories), 
						cancelButton('buf')]
	});
	
	return ncf;
}

function refreshCategories(){
	var cp = Ext.getCmp('categoryPane');
	var catMask = new Ext.LoadMask('categoryPane', {msg:"Loading categories...", removeMask: true});
	catMask.show();
	var root = cp.getRootNode();
	cp.getLoader().load(root, function(){catMask.hide();});
	root.expand();
}

function newCategory(){
	var ncf = new Ext.FormPanel({
		id: 'ncf',
		labelWidth: 100,
	    frame: true,
	    title: 'New Category',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [textField('Name', 'name'), comboBox('Parent Category', 'parent_id')],
		buttons: [actionButton('Add', 'silk-folder-add', 
				'php/category/newCategory.php', 'Adding Category', 'ncf', refreshCategories), 
						cancelButton('ncf')]
	});
	
	return ncf;
}

function editCategory(){
	var ecf = new Ext.FormPanel({
		id: 'ecf',
		labelWidth: 100,
	    frame: true,
	    title: 'Edit Category',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Category', 'category_id'), 
	            textField('New Name', 'name'), comboBox('New Parent Category', 'parent_id')],
		buttons: [actionButton('Update', 'silk-folder-edit', 
				'php/category/editCategory.php', 'Updating category', 'ecf', refreshCategories),
						cancelButton('ecf')]
	});
	
	return ecf;
}

function deleteCategory(){
	var dcf = new Ext.FormPanel({
		id: 'dcf',
		labelWidth: 100,
	    frame: true,
	    title: 'Delete Category',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Delete', 'category_id')],
		buttons: [actionButton('Delete', 'silk-folder-delete', 
				'php/category/deleteCategory.php', 'Removing category', 'dcf', refreshCategories),
						cancelButton('dcf')]
	});
	
	return dcf;
}

var categoryMenu = new Ext.menu.Menu({
	items: [menuItem('rcm', 'Refresh Categories', 'silk-arrow-refresh', refreshCategories, false),'-',
	    menuItem('ncm', 'Add Category', 'silk-folder-add', newCategory),
		menuItem('ecm', 'Edit Category', 'silk-folder-edit', editCategory),
		menuItem('dcm', 'Delete Category', 'silk-folder-delete', deleteCategory),'-',
		menuItem('bucm', 'Bulk Upload', 'silk-folder-go', bulkUpload)],
	listeners: {
        itemclick: function(item){
        	switch(item.id){
            	case 'ncm':
            		var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && (n.parentNode || n.text == 'All')) {
            			var ncfl = Ext.getCmp('ncf');
            			var tf = ncfl.get(0);
            			var cb = ncfl.get(1);
            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
            			tf.setValue('New Category');
            		}
            		break;
		        case 'ecm':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && n.parentNode) {
            			var ecfl = Ext.getCmp('ecf');
            			var cb = ecfl.get(0);
            			var tf = ecfl.get(1);
            			var nb = ecfl.get(2);
            			cb.getStore().load({callback: function(){cb.setValue(n.id);}});
            			nb.getStore().load({callback: function(){nb.setValue(n.parentNode.id);}});
            			tf.setValue(n.attributes['name']);
            		}
	        		break;
		        case 'dcm':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && n.parentNode) {
            			var cb = Ext.getCmp('dcf').get(0);
            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
            		}
	        		break;
		        case 'bucm':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
            		if (n != null && (n.parentNode || n.text == 'All')) {
            			var ncfl = Ext.getCmp('buf');
            			var tf = ncfl.get(0);
            			var cb = ncfl.get(1);
            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
            			tf.setValue('Upload File');
            		}
		        	break;
		        case 'crv':
		        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
		        	var ct = Ext.getCmp('rf').get(0);
		        	ct.getStore().load({callback: function(){ct.setValue(n.id);}});
		        	break;
        	}
	    }
	}
});

/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
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
    
    dataUrl: 'php/category/categoryPane.php',

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

categoryPane.on('click', function(node, e){
	cardGrid.store.load({
		params: {'category_id': node.id}
	});
});

categoryPane.render('leftColumn');
var catMask = new Ext.LoadMask('categoryPane', {msg:"Loading categories...", removeMask: true});
catMask.show();
categoryPane.getRootNode().expand(false, true, function(){catMask.hide();});

function getSelectedCategory(){
	return categoryPane.getSelectionModel().getSelectedNode();
}
