/**
 * Creates a new file upload box for use in a form
 * 
 * @param label		display name for the box
 * @param name		post name for the box
 * 
 * @return			a file upload box for a form
 */
function fileUpload(label, name, width, disabled, value){
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
			value: value,
			inputType : 'file'
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
			value: value,
			inputType : 'file'
		};
	}
	
	return t;
}