/**
 * Produces a form for deleting a card.
 * 
 * The form has two buttons, delete and cancel, with
 * appropriate associated actions.  Specifically,
 * the 'Delete' button calls card/deleteCard.php on
 * the server and 'deletes' the card (really, it just
 * sets a flag in the database).  There is also a comboBox
 * (<i>lib/comboBox.js</i>) for selecting the card to
 * delete.  This box is populated based on the category id.
 * 
 * Afterwards, the card grid is automatically refreshed.
 * 
 * @return	a form panel for deleting a card
 */
function deleteCard(){
	var dcrf = new Ext.FormPanel({
		id: 'dcrf',
		labelWidth: 100,
	    frame: true,
	    title: 'Delete Card',
	    bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    defaults: {width: 230},
	    items: [comboBox('Delete', 'card_id', 
	    		'php/card/getCards.php?category_id='+getSelectedCategory().id)],
		buttons: [actionButton('Delete', 'silk-folder-delete', 
				'php/card/deleteCard.php', 'Removing card', 'dcrf', refreshCards),
						cancelButton('dcrf')]
	});
	
	return dcrf;
}