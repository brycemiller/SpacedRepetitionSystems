/**
 * Returns a new menu item for use on a menu.  Pay special
 * attention to the handler and formHandlerBool params.
 * 
 * @param id				a unique id
 * @param text				text to be displayed on the item
 * @param icon				a picture to be displayed on the item
 * @param handler			a callback function which is called
 * 							when this menu item is actioned
 * @param formHandlerBool	if true, then it is expected that
 * 							the handler given to this function
 * 							will be a <i>lib/formHandler</i>
 * 
 * @return					a menu item
 */
function menuItem(id, text, icon, handler, formHandlerBool){
	if(formHandlerBool == null || formHandlerBool){
		return {id: id,
				text: text, 
				iconCls: icon, 
				handler: formHandler(handler, id)}
	}
	else{
		return {id: id,
				text: text,
				iconCls: icon,
				handler: handler};
	}
}