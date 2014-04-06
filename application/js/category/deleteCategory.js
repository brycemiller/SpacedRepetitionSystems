/**
 * Returns a form for deleting a category.
 * 
 * The form has an action button, 'Delete'; a
 * cancel button, and a drop-down comboBox for
 * selecting the category to be deleted.  The action
 * associated with the 'Delete' button is a call
 * to <i>category/deleteCategory.php</i> on the
 * server.
 * 
 * @return	a form for deleting a category
 */
function deleteCategory(){
	var dcf = new Ext.FormPanel({
		id: 'dcf',
		labelWidth: 100,
	    frame: true,
	    title: 'Delete Category',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Delete', 'category_id')],
		buttons: [actionButton('Delete', 'silk-folder-delete', 
				'php/category/deleteCategory.php', 'Removing category', 'dcf', refreshCategories),
						cancelButton('dcf')]
	});
	
	return dcf;
}