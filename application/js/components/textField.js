/**
 * Creates a new text field for use in a form.
 * 
 * @param label		the display name of the text field
 * @param name		the post name of the text field
 * @param width		the width of the text field; defaults
 * 					to auto if not present
 * 
 * @return			a new text field
 */
function textField(label, name, width, disabled, value){
	var t;
	
	if(!disabled)
		disabled = false;
	
	if(!value)
		value = '';
	
	if(!width){
		t = {
			fieldLabel: label,
			name: name,
			layout: 'anchor',
			xtype: 'textfield',
			disabled: disabled,
			value: value
		};
	}
	else{
		t = {
			fieldLabel: label,
			name: name,
			layout: 'anchor',
			xtype: 'textfield',
			width: width,
			disabled: disabled,
			value: value
		};
	}
	
	return t;
}