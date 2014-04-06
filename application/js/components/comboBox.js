/**
 * Nices the creation of a comboBox (combined drop-down
 * and text field).
 * 
 * @param label		the display name of the combobox
 * @param name		the post name of the combobox
 * @param url		the url which will be called to
 * 					populate the box
 * 
 * @return			a new combobox for use in a form
 */
function comboBox(label, name, url){
	
	if(!url)
		url = 'php/category/getCategories.php';
	
	var c = new Ext.form.ComboBox({
				fieldLabel: label,
				name: name,
				layout: 'anchor',
				readOnly: true,
				triggerAction: 'all',
				store: new Ext.data.ArrayStore({
					url: url,
					fields: [
					         {name: 'value', type: 'int'},
					         {name: 'text', type: 'string'}
					         ]
				}),
				hiddenName: name,
				valueField: 'value',
				displayField: 'text',
				emptyText: 'Press down ... ',
				mode: 'remote',
				listWidth: 230
	});
	
	return c;
}