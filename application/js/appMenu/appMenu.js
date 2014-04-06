/**
 * The main menu bar at the top of the screen.  
 * 
 * All of the system's main functions are available in this menu:
 * 		My account		Right now, there's only one sub-item: log out.
 * 						In the future, the sub-item <i>Edit Account</i>
 * 						will probably be added.
 * 		
 * 		Category		Menu for actions concerning <i>categories</i>.
 * 						This menu is described in more detail in 
 * 						<i>category/categoryMenu.js</i>
 * 		
 * 		Card			Menu for actions concerning <i>cards</i>.
 * 						This menu is described in more detail in
 * 						<i>card/cardMenu.js</i>.
 * 		
 * 		Review			Starts a review sequence.  More information can
 * 						be found in the documentation for <i>review.js</i>.
 * 		
 * Menu makes extensive use of <i>lib/toolbarButton.js</i> for nicing the
 * instantiation of buttons, and ensuring that they are all of the right size,
 * class, etc.
 */

// Initiate the new toolbar.
var appMenu = new Ext.Toolbar({height: 60, width: 700});

// Add new buttons and menus to the toolbar.
appMenu.add(
	// My Account menu
	toolbarButton('acc', 'My Account', 'silk-user-female-32', new Ext.menu.Menu({
			/* One item: log out.  When we add more items, this menu should be
			 * moved out to its own file. 
			 */
			items: [menuItem('lom', 'Log out', 'silk-door-open', function(){window.location = 'php/login/logout.php';}, false)]
		})
	),
	// Category menu
	toolbarButton('cat', 'Category', 'silk-folder-32', categoryMenu),
	// Card menu
	toolbarButton('card', 'Card', 'silk-application-32', cardMenu),
	/* 
	 * Review button
	 * 
	 * <i>lib/toolbarButton</i> is not used here because it does not support
	 * handler (callback) functions. 
	 */
	new Ext.Toolbar.Button({
		id: 'rbt',
		text: 'Review!',
		iconAlign: 'top',
		iconCls: 'silk-page-go-32',
		/*
		 * Lambda function called when the button is clicked.
		 * 
		 * This function disables the review button and displays the review
		 * panel <i>(review/review.js)</i>.
		 * 
		 * @param	{Ext.button}	This button
		 * @param	{Ext.EventObject}	The click event
		 */
		handler: function(b, e){
			// Disable this button, so that it can't be clicked twice
			b.disable();
			
			// function formHandler2 is in components/formHandler.js
			var k = formHandler2(review(b), 'rf')();
			
			// if the form was successfully created
			if(k){
				// get the selected node in the category tree
	        	var n = Ext.getCmp('categoryPane').getSelectionModel().getSelectedNode();
	        	
	        	// get the review form object we just created
	        	var ct = Ext.getCmp('rf').get(0);
	        	if(n != null){
	        		// instantiate the form with the currently selected category
	        		ct.getStore().load({callback: function(){ct.setValue(n.id);}});
	        	}
			}
        },
		height: 60,
		width: 80,
		scale: 'large'
	})
)

// Now that menu is ready; display it.
appMenu.render('topRow');