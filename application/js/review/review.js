/**
 * Processes the received card to prepare it for review
 * 
 * @param form		not in use
 * @param action	an object containing the
 * 					next card
 * @return			unit
 */
function reviewCallBack(form, action){
	var card = action.result.card;
	
	// if no card, reset view as review time is over
	if(card.length == 0){
		Ext.getCmp('rbt').enable();
		Ext.getCmp('rpf2').hide();
		refreshCards();
		cardGrid.render('rightColumn');
		return;
	}
	
	// get the different parts of the card
	id = card[0];
	q = card[1];
	a = card[2];
	
	// get a new review panel and display it
	rpf = reviewPanel(id, q, a);
	formHandler2(rpf, rpf.getId())();
}

function review(b){
	var k = new function(){
		var rf = new Ext.FormPanel({
			id: 'rf',
			labelWidth: 100,
		    frame: true,
		    title: 'Review!',
		    bodyStyle: 'padding:5px 5px 0',
		    width: 495,
		    height: 450,
		    defaults: {width: 230},
		    items: [comboBox('Review Category', 'category_id')],
			buttons: [actionButton('Review', 'silk-page-go', 
					'php/review/reviewStart.php', 'Fetching Cards', 'rf',
					reviewCallBack), {text: 'Cancel',
										iconCls: 'silk-cancel',
										handler: function(){
													b.enable();
													Ext.getCmp('rf').hide();
													cardGrid.show();
												}
										}]
		});
		
		return rf;
	}
	
	return k;
}

/**
 * Makes a review panel from the card details.
 * 
 * The panel includes buttons for displaying the answer,
 * or recycling the card back into the deck (skip).
 * 
 * @param id			the card id
 * @param question		the question on the card
 * @param answer		the answer to the question
 * 
 * @return				a form panel for reviewing the card
 */
function reviewPanel(id, question, answer){
	question = '<font size="4">'+question+'</font>';
	answer = '<font size="4">'+answer+'</font>';
	
	var rpf = new Ext.FormPanel({
		id: 'rpf',
		labelWidth: 100,
		frame: true,
		title: 'Review!',
		bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    items: [new Ext.Panel({autoScroll: true, html: question, height: 180, width: 450}),
	            {xtype:'hidden', name: 'a', value:'b'}/* <-- looks like test code; remove */],
	    buttons: [genericButton('Show Answer', 'silk-page-go', 
	    				function(){return showAnswer(id, question, answer)}, 'sab'),
	    			actionButton('Later', 'silk-arrow-refresh',
	    					'php/review/reviewContinuous.php?instruction=skip', 'Recycling Card',
	    					'rpf', reviewCallBack, 'recb')]
	});
	
	return rpf;
}

/**
 * Creates a stage 2 review panel, with buttons for getting
 * the next card, and for recycling this card.
 * 
 * This code has lots in common with reviewPanel, look into
 * refactoring
 * 
 * @param id			the card id
 * @param question		the question on the card
 * @param answer		the answer to the question
 * 
 * @return				a stage 2 form panel for reviewing cards
 */
function reviewPanel2(id, question, answer){
	var rpf = new Ext.FormPanel({
		id: 'rpf2',
		labelWidth: 100,
		frame: true,
		title: 'Review!',
		bodyStyle: 'padding:5px 5px 0',
	    width: 495,
	    height: 450,
	    items: [new Ext.Panel({autoScroll: true, html: question, height: 180, width: 450}),
	            new Ext.Panel({autoScroll: true, html: answer, height: 180, width: 450}),
	            {xtype:'hidden', name: 'a', value:'b'}],
	    buttons: [actionButton('Correct', 'silk-accept', 
					'php/review/reviewContinuous.php?instruction=correct&card_id='+id, 'Fetching Next Card',
					'rpf2', reviewCallBack),
					actionButton('Again', 'silk-arrow-refresh', 
							'php/review/reviewContinuous.php?instruction=wrong&card_id='+id, 'Recycling Card',
							'rpf2', reviewCallBack)]
	});
	
	return rpf;
}

/**
 * Makes and displays a stage 2 review panel.
 * 
 * @param id		the card id
 * @param q			the question on the card
 * @param a			the answer to the question
 * 
 * @return			unit
 */
function showAnswer(id, q, a){
	rpf2 = reviewPanel2(id, q, a);
	formHandler2(rpf2, rpf2.getId())();
}
