/**
 * Instantiates a new form for creating a new
 * category.  The form has a filed for the category
 * name, a box for selecting the parent category, an
 * 'Add' button, and a cancel button.  The form makes
 * and ajax call to <i>category/newCategory.php</i>
 * when 'Add' is selected.
 * 
 * @return	a form for creating a new category
 */
function newCategory(){
	var ncf = new Ext.FormPanel({
		id: 'ncf',
		labelWidth: 100,
	    frame: true,
	    title: 'New Category',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [textField('Name', 'name'), comboBox('Parent Category', 'parent_id')],
		buttons: [actionButton('Add', 'silk-folder-add', 
				'php/category/newCategory.php', 'Adding Category', 'ncf', refreshCategories), 
						cancelButton('ncf')]
	});
	
	return ncf;
}
