/**
 * A menu that gives access to functions which manipulate <i>cards</i>.
 * 
 * This menu is used in <i>appMenu/appMenu.js</i> as part of the main menu,
 * and in <i>card/cardGrid.js</i> as a context menu for the card grid.  This
 * script makes extensive use of <i>lib/menuItem.js</i> which nices the 
 * creation of menuItems:
 * 		Add Card		Displays a form which the user can use to add a card
 * 						to the deck.  See <i>card/newCard.js</i> for more.
 * 		
 * 		Edit Card		Displays a form which allows the user to change an
 * 						existing card.  See <i>card/editCard.js</i> for more.
 * 		
 * 		Delete Card		Displays a form for confirming the deletion of a card.
 * 						See <i>card/deleteCard.js</i> for more.
 * 		
 * 		Bulk upload		Displays a form to help the user upload cards and categories
 * 						en masse in one file upload.  This feature is experimental.
 * 						See <i>category/bulkUpload.js</i> for more.
 */
var cardMenu = new Ext.menu.Menu({
		items: [menuItem('rcrm', 'Refresh Cards', 'silk-arrow-refresh', refreshCards, false),'-',
		    menuItem('ncrm', 'Add Card', 'silk-application-add', newCard),
			menuItem('ecrm', 'Edit Card', 'silk-application-edit', editCard),
			menuItem('dcrm', 'Delete Card', 'silk-application-delete', deleteCard),'-',
			menuItem('bucrm', 'Bulk Upload', 'silk-application-go', bulkUpload)],
		listeners: {
			// This lambda function is run whenever any of the above items is clicked
	        itemclick: function(item){
	        	switch(item.id){
	        		// Add card
	            	case 'ncrm':
	            		// get the selected node from the category tree
	            		var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
	            		if (n != null && (n.parentNode || n.text == 'All')) {
	            			// instantiate a "new card" form with the selected category and
	            			// default question and answer values
	            			var ncrfl = Ext.getCmp('ncrf');
	            			var qf = ncrfl.get(0);
	            			var af = ncrfl.get(1);
	            			var cb = ncrfl.get(2);
	            			cb.getStore().load({callback: function(){cb.setValue(n.id)}});
	            			qf.setValue('New Question');
	            			af.setValue('New Answer');
	            		}
	            		break;
	            	// Edit card
			        case 'ecrm':
			        	// get the selected node from the category tree
			        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
			        	// get the selected card in the card grid
			        	var r = Ext.getCmp('cardGrid').getSelectionModel().getSelected();
			        	if(r != null){
			        		// instantiate an "edit card" form with the selected category and
	            			// question and answer values from the selected card
	            			var ecrfl = Ext.getCmp('ecrf');
	            			var cr = ecrfl.get(0);
	            			var qu = ecrfl.get(1);
	            			var an = ecrfl.get(2);
	            			var ct = ecrfl.get(3);
	            			cr.getStore().load({callback: function(){cr.setValue(r.get('id'));}});
	            			ct.getStore().load({callback: function(){ct.setValue(n.id);}});
	            			qu.setValue(r.get('question'));
	            			an.setValue(r.get('answer'));
			        	}
		        		break;
		        	// Delete card
			        case 'dcrm':
						// get the selected card in the card grid
			        	var r = Ext.getCmp('cardGrid').getSelectionModel().getSelected();
	            		if (r != null) {
	            			// instantiate a delete form with the currently selected card
	            			var cb = Ext.getCmp('dcrf').get(0);
	            			cb.getStore().load({callback: function(){cb.setValue(r.get('id'))}});
	            		}
		        		break;
		        	// Bulk upload
			        case 'bucrm':
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
			        case 'crrv':
			        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
			        	var ct = Ext.getCmp('rf').get(0);
			        	ct.getStore().load({callback: function(){ct.setValue(n.id);}});
			        	break;
	        	}
		    }
		}
	});