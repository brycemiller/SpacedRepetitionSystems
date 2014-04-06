/**
 * Creates a new alert box, displaying the error
 * returned by the ajax action.
 * 
 * @param	form	
 * @param	action	
 */
function reportError(form, action){	
	Ext.Msg.alert('Error', action.result.errorMessage);
}