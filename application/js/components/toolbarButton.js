/**
 * Makes a new button which can go on a toolbar.
 * 
 * Could probably move this to button.js, but
 * it is a different type of button, so undecided.
 * 
 * @param id		a unique id for the button
 * @param text		text to display on the button
 * @param icon		an icon to display on the button
 * @param menu		a menu which is displayed when the button is clicked
 * @return			a toolbar button
 */
function toolbarButton(id, text, icon, menu){	
	var t = new Ext.Toolbar.Button({
		id: id,
		text: text,
		arrowAlign: 'right',
		iconAlign: 'top',
		iconCls: icon,
		height: 60,
		width: 80,
		scale: 'large',
		menu: menu
	});
	
	return t;
}
