/**
 * Produces a form for creating a new card
 * 
 * Returns a form with a text area each for the
 * 'question' and 'answer' fields of the card.  The
 * form also contains a comboBox (<i>lib/comboBox</i>)
 * for selecting the category.  The two buttons, 'Add'
 * and 'Cancel' have the appropriate actions.  Specifically,
 * 'Add' sends an ajax request til <i>card/newCard.php</i>
 * to create a new card in the database.
 * 
 * Afterwards, the card grid is automatically refreshed.
 * 
 * @return	a form panel for creating a new card
 */
function newCard(){
	var ncrf = new Ext.FormPanel({
		id: 'ncrf',
		labelWidth: 100,
	    frame: true,
	    title: 'New Card',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [textArea('Question', 'question'), textArea('Answer', 'answer'), 
	            comboBox('Category', 'category_id', 
	            		'php/category/getCategories.php')],
		buttons: [actionButton('Add', 'silk-application-add', 
				'php/card/newCard.php', 'Adding card', 'ncrf', refreshCards),
						cancelButton('ncrf')]
	});
	
	return ncrf;
}