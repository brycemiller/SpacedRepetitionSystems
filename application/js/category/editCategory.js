/**
 * Makes a new form for editing an existing category.
 * 
 * The form is instantiated with a name field, box for
 * selecting the parent category, and two buttons:
 * 'Update' and 'Cancel'.  When 'Update' is selected,
 * an ajax call to <i>category/editCategory.php</i> is
 * made.
 * 
 * @return	a form for updating a category
 */
function editCategory(){
	var ecf = new Ext.FormPanel({
		id: 'ecf',
		labelWidth: 100,
	    frame: true,
	    title: 'Edit Category',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Category', 'category_id'), 
	            textField('New Name', 'name'), comboBox('New Parent Category', 'parent_id')],
		buttons: [actionButton('Update', 'silk-folder-edit', 
				'php/category/editCategory.php', 'Updating category', 'ecf', refreshCategories),
						cancelButton('ecf')]
	});
	
	return ecf;
}