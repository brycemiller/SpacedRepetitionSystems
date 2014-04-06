/**
 * Makes a form for starting a bulk upload of categories
 * and cards
 * 
 * The form has a file upload box (<i>lib/fileUpload.js</i>),
 * a comboBox (<i>lib/comboBox.js</i>), an 'Upload' and a 
 * 'Cancel' button.  The comboBox is for choosing the parent
 * category which shall act as the root category for the
 * categories created in this upload.  The real magic here
 * happens in <i>category/bulkUpload.php</i>, which is called
 * via ajax when 'Upload' is pressed.
 * 
 * This functionality is experimental.
 * 
 * @return a bulk upload form
 */
function bulkUpload(){
	var ncf = new Ext.FormPanel({
		id: 'buf',
		fileUpload: true,
		labelWidth: 100,
	    frame: true,
	    title: 'Bulk Upload',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [fileUpload('File', 'file'), comboBox('Parent Category', 'parent_id')],
		buttons: [actionButton('Upload', 'silk-folder-go', 
				'php/category/bulkUpload.php', 'Uploading', 'buf', refreshCategories), 
						cancelButton('buf')]
	});
	
	return ncf;
}
