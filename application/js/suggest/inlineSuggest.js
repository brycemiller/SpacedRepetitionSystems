// returns a form for taking suggestions
function inlineSuggest(){
	var is = new Ext.FormPanel({
		id: 'is',
		labelWidth: 255,
		frame: false,
		bodyStyle: 'padding:5px 5px 0',
		height: 65,
		border: false,
		items: [textField('Problem?  Suggestion?  Tell us - we\'re listening', 
					'suggestion', 200)],
		buttons: [actionButton('Suggest', 'silk-accept', 'php/suggest/inlineSuggestion.php', 
					'Thanks, we\'ll get on it right away', 'is', isClean)]
	});
	
	return is;
}

// resets the suggestion box
function isClean(){
	var c = Ext.getCmp('is');
	c.get(0).setValue('');
	c.show();
}

// make new suggestion form and display it
var is = new inlineSuggest();
is.render('inlineSuggestForm');	