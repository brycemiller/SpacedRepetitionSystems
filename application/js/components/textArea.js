/**
 * Returns a new text area
 * 
 * @param label		the display name for the text area
 * @param name		the post name for the text area
 * 
 * @return			a text area for use in a form
 */
function textArea(label, name){
	var t = {
		fieldLabel: label,
		name: name,
		layout: 'anchor',
		xtype: 'textarea'
	};
	
	return t;
}