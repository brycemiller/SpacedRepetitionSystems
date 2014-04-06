/**
 * A menu that gives access to functions which manipulate <i>categories</i>.
 * 
 * This menu is used in <i>appMenu/appMenu.js</i> as part of the main menu,
 * and in <i>category/categoryPane.js</i> as a context menu for the category tree.
 * This script makes extensive use of <i>lib/menuItem.js</i> which nices the 
 * creation of menuItems:
 * 		Refresh Categories	Refreshes the category tree.  See 
 * 							<i>category/refreshCategories.js</i> for more.
 * 		
 * 		Add Category		Displays a form which the user can use to add a category
 * 							to the deck.  See <i>category/newCagegory.js</i> for more.
 * 		
 * 		Edit Category		Displays a form which allows the user to change an
 * 							existing category.  See <i>category/editCategory.js</i>
 * 							for more.
 * 		
 * 		Delete Category		Displays a form for confirming the deletion of a category.
 * 							See <i>category/deleteCategory.js</i> for more.
 * 		
 * 		Bulk Category		Displays a form to help the user upload cards and categories
 * 							en masse in one file upload.  This feature is experimental.
 * 							See <i>category/bulkUpload.js</i> for more.
 */
var categoryMenu = new Ext.menu.Menu({
		items: [menuItem('rcm', 'Refresh Categories', 'silk-arrow-refresh', refreshCategories, false),'-',
		    menuItem('ncm', 'Add Category', 'silk-folder-add', newCategory),
			menuItem('ecm', 'Edit Category', 'silk-folder-edit', editCategory),
			menuItem('dcm', 'Delete Category', 'silk-folder-delete', deleteCategory),'-',
			menuItem('bucm', 'Bulk Upload', 'silk-folder-go', bulkUpload)],
		listeners: {
			// This lambda function is run whenever any of the above items is clicked
	        itemclick: function(item){
	        	switch(item.id){
	        		// Add category
	            	case 'ncm':
	            		// get the selected node from the category tree
	            		var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
	            		if (n != null && (n.parentNode || n.text == 'All')) {
	            			// initiate a "new category" form with selected category as parent
	            			var ncfl = Ext.getCmp('ncf');
	            			var tf = ncfl.get(0);
	            			var cb = ncfl.get(1);
	            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
	            			tf.setValue('New Category');
	            		}
	            		break;
	            	// Edit category	
			        case 'ecm':
			        	// get the selected node from the category tree
			        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
			        	// initiate an "edit category" form with this node's name and parent
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
		        	// Delete category
			        case 'dcm':
			        	// get the selected node from the category tree
			        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
	            		if (n != null && n.parentNode) {
	            			// instantiate a delete form with the currently selected category
	            			var cb = Ext.getCmp('dcf').get(0);
	            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
	            		}
		        		break;
		        	// Bulk upload
			        case 'bucm':
			        	// THIS IS DUPLICATE CODE - REMEMBER THE RULE OF 3 - come back, put into a function
			        	// get the selected node from the category tree
			        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
	            		if (n != null && (n.parentNode || n.text == 'All')) {
	            			// instantiate a bulk upload form with the selected category
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