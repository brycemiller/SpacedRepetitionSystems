/**
 * Creates a new action button (such as add, delete, etc)
 * 
 * Action buttons are used to submit forms, via ajax, to a
 * given URL.  They also process the requests and run a callback
 * function based on whether the results was a success or not.
 * 
 * @param text		Text to display on the button
 * @param icon		Picture to display on the button
 * @param url		URL the associated form should be sent to
 * @param waitMsg	Message to display during ajax request (should standardise)
 * @param item		The id of the form this button will send
 * @param cb		The callback function to call on a successful action	
 * 	
 * @return			a new action button
 */
function actionButton(text, icon, url, waitMsg, item, cb, id){
	var b;
	
	if(id){
		b = {
			text: text,
			iconCls: icon,
			handler: function(){
				var c = Ext.getCmp(item);
				
				c.getForm().submit({
					url: url,
					waitMsg: waitMsg,
					success: cb,
					failure: reportError
				});
				
				c.hide();
				cardGrid.show();
			}
		};
	}
	else{
		b = {
			text: text,
			iconCls: icon,
			handler: function(){
				var c = Ext.getCmp(item);
				
				c.getForm().submit({
					url: url,
					waitMsg: waitMsg,
					success: cb,
					failure: reportError
				});
				
				c.hide();
				cardGrid.show();
			}
		};
	}
	
	return b;
}

/**
 * Creates a new cancel button.
 * 
 * Cancel buttons remove the current form from the display, and
 * reinstate the card grid.
 * 
 * @param item		The id of the form this cancel button is on
 * 
 * @return			A cancel button
 */
function cancelButton(item){
	var c = {
		text: 'Cancel',
		iconCls: 'silk-cancel',
		handler: function(){Ext.getCmp(item).hide(); cardGrid.show();}
	};
	
	return c;
}

/**
 * Creates a new button
 * 
 * cancelButton and actionButton ought to be modified to use this
 * function.
 * 
 * @param text			Text to display on the button
 * @param icon			Icon to show on the button
 * @param handler		The function to run when an action occurs
 * 
 * @return				A new button
 */
function genericButton(text, icon, handler, id){
	var b;
	
	if(id){
		b = {
				id: id,
				text: text,
				iconCls: icon,
				handler: handler
		};
	}
	else{
		b = {
				text: text,
				iconCls: icon,
				handler: handler
		};
	}
	
	return b;
}