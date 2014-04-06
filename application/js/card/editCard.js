/**
 * Returns a form panel the user can use to 
 * update an existing card.
 * 
 * The form has a textarea for the question and
 * answer fields of the card, ready-filled in with
 * the data from the card to be updated.  A comboBox
 * (<i>lib/comboBox</i>) for category selection is
 * also on the form.  The button 'Update' sends a
 * request to <i>card/editCard.php</i> to update
 * the card in the database.  'Cancel' has the
 * expected effect.
 * 
 * Afterwards, the card grid is automatically refreshed.
 * 
 * @return	a form panel for editing a card
 */
function editCard(){
	var ecrf = new Ext.FormPanel({
		id: 'ecrf',
		labelWidth: 100,
	    frame: true,
	    title: 'Edit Card',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Card', 'card_id', 
	    		'php/card/getCards.php?category_id='+getSelectedCategory().id),
	    		textArea('Question', 'question'), textArea('Answer', 'answer'),
	    		comboBox('New Category', 'category_id', 
	    	    		'php/category/getCategories.php')],
		buttons: [actionButton('Update', 'silk-application-add', 
				'php/card/editCard.php', 'Updating card', 'ecrf', refreshCards),
						cancelButton('ecrf')]
	});
	
	return ecrf;
}